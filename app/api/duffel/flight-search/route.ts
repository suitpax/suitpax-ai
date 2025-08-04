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
        direct_flights: sortedOffers.filter(offer => offer.metadata.is_direct).length,
        airlines_found: [...new Set(sortedOffers.map(offer => offer.metadata.main_airline))].length,
        price_range: {
          min: Math.min(...sortedOffers.map(offer => offer.metadata.price_score)),
          max: Math.max(...sortedOffers.map(offer => offer.metadata.price_score)),
          currency: sortedOffers[0]?.total_currency || 'USD'
        }
      }
    })

  } catch (error) {
    console.error("Duffel API Error:", error)
    
    // Manejo específico de errores de Duffel
    if (error instanceof Error) {
      // Errores comunes de la API de Duffel
      if (error.message.includes('airport not found')) {
        return NextResponse.json({
          success: false,
          error: "One or more airports not found. Please check your airport codes.",
          error_code: "AIRPORT_NOT_FOUND"
        }, { status: 400 })
      }
      
      if (error.message.includes('no offers available')) {
        return NextResponse.json({
          success: false,
          error: "No flights available for the selected route and dates. Try different dates or destinations.",
          error_code: "NO_OFFERS_AVAILABLE"
        }, { status: 200 }) // 200 porque es una respuesta válida sin resultados
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json({
          success: false,
          error: "Too many search requests. Please wait a moment before searching again.",
          error_code: "RATE_LIMIT_EXCEEDED"
        }, { status: 429 })
      }
    }

    return NextResponse.json({
      success: false,
      error: "Failed to search flights. Please try again.",
      error_code: "SEARCH_FAILED",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : "Unknown error" : undefined
    }, { status: 500 })
  }
}
