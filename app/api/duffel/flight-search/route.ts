import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test' // Cambiar a 'production' cuando vayas a producción
})

interface SearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
  loyaltyProgrammes?: Array<{
    airline_iata_code: string
    account_number: string
  }>
  corporateDiscounts?: boolean
  maxConnections?: number
  preferDirectFlights?: boolean
  includeNearbyAirports?: boolean
  sortBy?: 'price' | 'duration' | 'departure_time'
  currency?: string
  timeout?: number
}

// Cache en memoria para requests recientes (en producción usar Redis)
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Rate limiting por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 10

function getRealIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const rateLimitInfo = rateLimitMap.get(ip)
  
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (rateLimitInfo.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  rateLimitInfo.count++
  return true
}

function generateCacheKey(params: SearchRequest): string {
  const keyParts = [
    params.origin,
    params.destination,
    params.departureDate,
    params.returnDate || '',
    params.passengers.toString(),
    params.cabinClass,
    JSON.stringify(params.loyaltyProgrammes || []),
    params.corporateDiscounts ? 'corp' : 'std',
    params.maxConnections?.toString() || '2',
    params.sortBy || 'price'
  ]
  
  return keyParts.join('|')
}

function getCachedResult(cacheKey: string): any | null {
  const cached = requestCache.get(cacheKey)
  
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    requestCache.delete(cacheKey)
    return null
  }
  
  return cached.data
}

function setCachedResult(cacheKey: string, data: any): void {
  // Limpiar cache viejo si hay más de 100 entradas
  if (requestCache.size > 100) {
    const oldestKey = requestCache.keys().next().value
    requestCache.delete(oldestKey)
  }
  
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check rate limit
    const clientIP = getRealIP(request)
    
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({
        success: false,
        error: "Too many requests. Please wait a moment before searching again.",
        error_code: "RATE_LIMIT_EXCEEDED"
      }, { status: 429 })
    }

    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      loyaltyProgrammes = [],
      corporateDiscounts = false,
      maxConnections = 2,
      preferDirectFlights = false,
      includeNearbyAirports = false,
      sortBy = 'price',
      currency = 'USD',
      timeout = 30000
    }: SearchRequest = await request.json()

    // Validaciones mejoradas
    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: origin, destination, departureDate, and passengers are required",
        error_code: "MISSING_REQUIRED_FIELDS"
      }, { status: 400 })
    }

    // Validar códigos IATA
    const iataRegex = /^[A-Z]{3}$/
    if (!iataRegex.test(origin.toUpperCase()) || !iataRegex.test(destination.toUpperCase())) {
      return NextResponse.json({
        success: false,
        error: "Origin and destination must be valid 3-letter IATA codes",
        error_code: "INVALID_AIRPORT_CODE"
      }, { status: 400 })
    }

    // Validar fechas
    const departure = new Date(departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (departure < today) {
      return NextResponse.json({
        success: false,
        error: "Departure date cannot be in the past",
        error_code: "INVALID_DEPARTURE_DATE"
      }, { status: 400 })
    }

    // Check cache
    const cacheKey = generateCacheKey({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      loyaltyProgrammes,
      corporateDiscounts,
      maxConnections,
      sortBy,
      currency
    })

    const cachedResult = getCachedResult(cacheKey)
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        cache_timestamp: requestCache.get(cacheKey)?.timestamp
      })
    }

    if (returnDate) {
      const returnDateObj = new Date(returnDate)
      if (returnDateObj <= departure) {
        return NextResponse.json({
          success: false,
          error: "Return date must be after departure date",
          error_code: "INVALID_RETURN_DATE"
        }, { status: 400 })
      }
    }

    // Validar número de pasajeros
    if (passengers < 1 || passengers > 9) {
      return NextResponse.json({
        success: false,
        error: "Number of passengers must be between 1 and 9",
        error_code: "INVALID_PASSENGER_COUNT"
      }, { status: 400 })
    }

    // Construir slices para la búsqueda
    const slices = [
      {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departure_date: departureDate,
      }
    ]

    // Agregar slice de vuelta si es round trip
    if (returnDate) {
      slices.push({
        origin: destination.toUpperCase(),
        destination: origin.toUpperCase(),
        departure_date: returnDate,
      })
    }

    // Construir pasajeros
    const passengerArray = Array(passengers).fill({ type: "adult" })

    // Configuración de búsqueda con mejores prácticas de Duffel
    const searchConfig: any = {
      slices,
      passengers: passengerArray,
      cabin_class: cabinClass,
      max_connections: maxConnections,
      return_offers: true,
      // Optimizaciones según mejores prácticas de Duffel
      supplier_timeout: Math.min(timeout, 30000),
      // Filtros para mejorar relevancia
      ...(preferDirectFlights && { max_connections: 0 }),
      // Configuración de moneda
      ...(currency && { currency: currency.toUpperCase() }),
    }

    // Agregar programas de lealtad si se proporcionan
    if (loyaltyProgrammes.length > 0) {
      searchConfig.loyalty_programme_accounts = loyaltyProgrammes.map(programme => ({
        airline_iata_code: programme.airline_iata_code.toUpperCase(),
        account_number: programme.account_number
      }))
    }

    // Configurar filtros corporativos
    if (corporateDiscounts) {
      searchConfig.private_fares = true
    }

    // Configuración avanzada para incluir aeropuertos cercanos
    if (includeNearbyAirports) {
      searchConfig.include_nearby_airports = true
    }

    console.log("Duffel search config:", JSON.stringify(searchConfig, null, 2))

    // Crear la oferta de vuelo con timeout personalizado
    const searchPromise = duffel.offerRequests.create(searchConfig)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Search timeout')), timeout)
    })

    const offerRequest = await Promise.race([searchPromise, timeoutPromise]) as any

    if (!offerRequest.data) {
      return NextResponse.json({
        success: false,
        error: "No data received from flight search",
        error_code: "NO_DATA_RECEIVED"
      }, { status: 500 })
    }

    const offers = offerRequest.data.offers || []

    // Procesar y enriquecer las ofertas con scoring mejorado
    const processedOffers = offers.map((offer: any) => {
      const firstSlice = offer.slices[0]
      const totalDuration = firstSlice?.duration
      const stops = firstSlice?.segments ? firstSlice.segments.length - 1 : 0
      
      // Información de la aerolínea principal
      const mainAirline = firstSlice?.segments[0]?.operating_carrier || firstSlice?.segments[0]?.marketing_carrier

      // Calcular score de relevancia
      let relevanceScore = 0
      
      // Penalizar por paradas
      relevanceScore -= stops * 20
      
      // Bonificar vuelos directos
      if (stops === 0) relevanceScore += 50
      
      // Bonificar aerolíneas con programas de lealtad del usuario
      if (loyaltyProgrammes.some(lp => lp.airline_iata_code === mainAirline?.iata_code)) {
        relevanceScore += 30
      }

      // Procesar condiciones de cambio y reembolso
      const conditions = {
        change_before_departure: offer.conditions?.change_before_departure ? {
          allowed: offer.conditions.change_before_departure.allowed,
          penalty_amount: offer.conditions.change_before_departure.penalty_amount,
          penalty_currency: offer.conditions.change_before_departure.penalty_currency
        } : { allowed: false },
        
        refund_before_departure: offer.conditions?.refund_before_departure ? {
          allowed: offer.conditions.refund_before_departure.allowed,
          penalty_amount: offer.conditions.refund_before_departure.penalty_amount,
          penalty_currency: offer.conditions.refund_before_departure.penalty_currency
        } : { allowed: false }
      }

      // Información de tarifas privadas/corporativas
      const privateFares = offer.private_fares || []

      return {
        id: offer.id,
        slices: offer.slices.map((slice: any) => ({
          ...slice,
          segments: slice.segments.map((segment: any) => ({
            ...segment,
            airline: {
              name: segment.operating_carrier?.name || segment.marketing_carrier?.name,
              iata_code: segment.operating_carrier?.iata_code || segment.marketing_carrier?.iata_code,
              logo_symbol_url: segment.operating_carrier?.logo_symbol_url || segment.marketing_carrier?.logo_symbol_url
            },
            // Calcular paradas con más detalle
            stops: slice.segments.length > 1 ? slice.segments.slice(0, -1).map((stopSegment: any, index: number) => {
              const nextSegment = slice.segments[index + 1]
              return {
                airport: {
                  iata_code: nextSegment?.origin?.iata_code || stopSegment.destination.iata_code,
                  name: nextSegment?.origin?.name || stopSegment.destination.name,
                  city_name: nextSegment?.origin?.city_name || stopSegment.destination.city_name
                },
                duration: this.calculateLayoverDuration(stopSegment.arriving_at, nextSegment?.departing_at)
              }
            }) : []
          }))
        })),
        total_amount: offer.total_amount,
        total_currency: offer.total_currency,
        cabin_class: offer.cabin_class,
        owner: offer.owner,
        conditions,
        private_fares: privateFares,
        
        // Metadatos mejorados para filtrado y ordenamiento
        metadata: {
          total_duration: totalDuration,
          stops_count: stops,
          main_airline: mainAirline?.name,
          main_airline_code: mainAirline?.iata_code,
          departure_time: firstSlice?.segments[0]?.departing_at,
          arrival_time: firstSlice?.segments[firstSlice.segments.length - 1]?.arriving_at,
          is_direct: stops === 0,
          price_score: parseFloat(offer.total_amount),
          relevance_score: relevanceScore,
          has_loyalty_program: loyaltyProgrammes.some(lp => lp.airline_iata_code === mainAirline?.iata_code),
          has_corporate_discount: privateFares.length > 0
        }
      }
    })

    // Ordenar ofertas según preferencia del usuario
    let sortedOffers = [...processedOffers]
    
    switch (sortBy) {
      case 'price':
        sortedOffers.sort((a, b) => a.metadata.price_score - b.metadata.price_score)
        break
      case 'duration':
        sortedOffers.sort((a, b) => {
          const aDuration = this.parseDuration(a.metadata.total_duration || "PT0M")
          const bDuration = this.parseDuration(b.metadata.total_duration || "PT0M")
          return aDuration - bDuration
        })
        break
      case 'departure_time':
        sortedOffers.sort((a, b) => 
          new Date(aimport { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test' // Cambiar a 'production' cuando vayas a producción
})

interface SearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
  loyaltyProgrammes?: Array<{
    airline_iata_code: string
    account_number: string
  }>
  corporateDiscounts?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      loyaltyProgrammes = [],
      corporateDiscounts = false
    }: SearchRequest = await request.json()

    // Validaciones mejoradas
    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: origin, destination, departureDate, and passengers are required"
      }, { status: 400 })
    }

    // Validar códigos IATA
    if (origin.length !== 3 || destination.length !== 3) {
      return NextResponse.json({
        success: false,
        error: "Origin and destination must be valid 3-letter IATA codes"
      }, { status: 400 })
    }

    // Validar fechas
    const departure = new Date(departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (departure < today) {
      return NextResponse.json({
        success: false,
        error: "Departure date cannot be in the past"
      }, { status: 400 })
    }

    if (returnDate) {
      const returnDateObj = new Date(returnDate)
      if (returnDateObj <= departure) {
        return NextResponse.json({
          success: false,
          error: "Return date must be after departure date"
        }, { status: 400 })
      }
    }

    // Construir slices para la búsqueda
    const slices = [
      {
        origin,
        destination,
        departure_date: departureDate,
      }
    ]

    // Agregar slice de vuelta si es round trip
    if (returnDate) {
      slices.push({
        origin: destination,
        destination: origin,
        departure_date: returnDate,
      })
    }

    // Construir pasajeros
    const passengerArray = Array(passengers).fill({ type: "adult" })

    // Configuración de búsqueda mejorada
    const searchConfig: any = {
      slices,
      passengers: passengerArray,
      cabin_class: cabinClass,
      max_connections: 2, // Límite de conexiones
      return_offers: true, // Incluir toda la información de las ofertas
    }

    // Agregar programas de lealtad si se proporcionan
    if (loyaltyProgrammes.length > 0) {
      searchConfig.loyalty_programme_accounts = loyaltyProgrammes
    }

    // Configurar filtros corporativos
    if (corporateDiscounts) {
      searchConfig.private_fares = true
    }

    console.log("Duffel search config:", JSON.stringify(searchConfig, null, 2))

    // Crear la oferta de vuelo con manejo de errores mejorado
    const offerRequest = await duffel.offerRequests.create(searchConfig)

    if (!offerRequest.data) {
      return NextResponse.json({
        success: false,
        error: "No data received from flight search"
      }, { status: 500 })
    }

    const offers = offerRequest.data.offers || []

    // Procesar y enriquecer las ofertas
    const processedOffers = offers.map((offer: any) => {
      // Calcular información adicional
      const firstSlice = offer.slices[0]
      const totalDuration = firstSlice?.duration
      const stops = firstSlice?.segments ? firstSlice.segments.length - 1 : 0
      
      // Información de la aerolínea principal
      const mainAirline = firstSlice?.segments[0]?.operating_carrier || firstSlice?.segments[0]?.marketing_carrier

      // Procesar condiciones de cambio y reembolso
      const conditions = {
        change_before_departure: offer.conditions?.change_before_departure ? {
          allowed: offer.conditions.change_before_departure.allowed,
          penalty_amount: offer.conditions.change_before_departure.penalty_amount,
          penalty_currency: offer.conditions.change_before_departure.penalty_currency
        } : { allowed: false },
        
        refund_before_departure: offer.conditions?.refund_before_departure ? {
          allowed: offer.conditions.refund_before_departure.allowed,
          penalty_amount: offer.conditions.refund_before_departure.penalty_amount,
          penalty_currency: offer.conditions.refund_before_departure.penalty_currency
        } : { allowed: false }
      }

      // Información de tarifas privadas/corporativas
      const privateFares = offer.private_fares || []

      return {
        id: offer.id,
        slices: offer.slices.map((slice: any) => ({
          ...slice,
          segments: slice.segments.map((segment: any) => ({
            ...segment,
            airline: {
              name: segment.operating_carrier?.name || segment.marketing_carrier?.name,
              iata_code: segment.operating_carrier?.iata_code || segment.marketing_carrier?.iata_code,
              logo_symbol_url: segment.operating_carrier?.logo_symbol_url || segment.marketing_carrier?.logo_symbol_url
            },
            // Calcular paradas
            stops: slice.segments.length > 1 ? slice.segments.slice(1, -1).map((stopSegment: any) => ({
              airport: {
                iata_code: stopSegment.origin.iata_code,
                name: stopSegment.origin.name,
                city_name: stopSegment.origin.city_name
              },
              duration: stopSegment.duration
            })) : []
          }))
        })),
        total_amount: offer.total_amount,
        total_currency: offer.total_currency,
        cabin_class: offer.cabin_class,
        owner: offer.owner,
        conditions,
        private_fares: privateFares,
        
        // Metadatos adicionales para filtrado y ordenamiento
        metadata: {
          total_duration: totalDuration,
          stops_count: stops,
          main_airline: mainAirline?.name,
          main_airline_code: mainAirline?.iata_code,
          departure_time: firstSlice?.segments[0]?.departing_at,
          arrival_time: firstSlice?.segments[firstSlice.segments.length - 1]?.arriving_at,
          is_direct: stops === 0,
          price_score: parseFloat(offer.total_amount), // Para ordenamiento por precio
        }
      }
    })

    // Ordenar ofertas por precio (mejores primero)
    const sortedOffers = processedOffers.sort((a, b) => 
      a.metadata.price_score - b.metadata.price_score
    )

    return NextResponse.json({
      success: true,
      offers: sortedOffers,
      request_id: offerRequest.data.id,
      search_metadata: {
        total_offers: sortedOffers.length,
        search_params: {
          origin,
          destination,
          departure_date: departureDate,
          return_date: returnDate,
          passengers,
          cabin_class: cabinClass
        },
        direct_flights: sortedOffers.filter(offer => o