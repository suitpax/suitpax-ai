import { useState, useCallback, useRef, useEffect } from 'react'

interface SearchParams {
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

interface CachedResult {
  key: string
  data: any
  timestamp: number
  expiresAt: number
}

interface UseFlightSearchReturn {
  search: (params: SearchParams) => Promise<any>
  isLoading: boolean
  error: string | null
  offers: any[]
  requestId: string | null
  searchMetadata: any
  clearCache: () => void
  getCacheStats: () => { size: number; hits: number; misses: number }
}

// Cache con TTL de 5 minutos para búsquedas de vuelos
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const MAX_CACHE_SIZE = 50 // Máximo 50 búsquedas en cache

export function useFlightSearch(): UseFlightSearchReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [requestId, setRequestId] = useState<string | null>(null)
  const [searchMetadata, setSearchMetadata] = useState<any>(null)

  // Cache management
  const cacheRef = useRef<Map<string, CachedResult>>(new Map())
  const cacheStatsRef = useRef({ hits: 0, misses: 0 })
  const activeRequestRef = useRef<AbortController | null>(null)
  const rateLimitRef = useRef<{ lastRequest: number; requestCount: number }>({
    lastRequest: 0,
    requestCount: 0
  })

  // Limpiar cache expirado cada 30 segundos
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      const cache = cacheRef.current
      
      for (const [key, result] of cache.entries()) {
        if (now > result.expiresAt) {
          cache.delete(key)
        }
      }
    }, 30000)

    return () => clearInterval(cleanupInterval)
  }, [])

  const generateCacheKey = (params: SearchParams): string => {
    // Crear una clave única basada en los parámetros de búsqueda
    const keyParts = [
      params.origin,
      params.destination,
      params.departureDate,
      params.returnDate || '',
      params.passengers.toString(),
      params.cabinClass,
      JSON.stringify(params.loyaltyProgrammes || []),
      params.corporateDiscounts ? 'corp' : 'std'
    ]
    
    return keyParts.join('|')
  }

  const checkRateLimit = (): boolean => {
    const now = Date.now()
    const rateLimit = rateLimitRef.current
    
    // Reset counter si ha pasado más de 1 minuto
    if (now - rateLimit.lastRequest > 60000) {
      rateLimit.requestCount = 0
    }
    
    // Máximo 10 requests por minuto
    if (rateLimit.requestCount >= 10) {
      setError("Too many search requests. Please wait a moment before searching again.")
      return false
    }
    
    rateLimit.lastRequest = now
    rateLimit.requestCount++
    return true
  }

  const validateSearchParams = (params: SearchParams): string | null => {
    // Validaciones mejoradas
    if (!params.origin || !params.destination) {
      return "Origin and destination are required"
    }

    if (params.origin === params.destination) {
      return "Origin and destination cannot be the same"
    }

    if (!params.departureDate) {
      return "Departure date is required"
    }

    const departureDate = new Date(params.departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (departureDate < today) {
      return "Departure date cannot be in the past"
    }

    // Validar que la fecha no sea más de 1 año en el futuro
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
    
    if (departureDate > oneYearFromNow) {
      return "Departure date cannot be more than 1 year in the future"
    }

    if (params.returnDate) {
      const returnDate = new Date(params.returnDate)
      if (returnDate <= departureDate) {
        return "Return date must be after departure date"
      }
    }

    if (params.passengers < 1 || params.passengers > 9) {
      return "Number of passengers must be between 1 and 9"
    }

    return null
  }

  const getCachedResult = (cacheKey: string): any | null => {
    const cached = cacheRef.current.get(cacheKey)
    
    if (!cached) {
      cacheStatsRef.current.misses++
      return null
    }

    if (Date.now() > cached.expiresAt) {
      cacheRef.current.delete(cacheKey)
      cacheStatsRef.current.misses++
      return null
    }

    cacheStatsRef.current.hits++
    return cached.data
  }

  const setCachedResult = (cacheKey: string, data: any): void => {
    const cache = cacheRef.current
    
    // Limpiar cache si está lleno
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = Array.from(cache.keys())[0]
      cache.delete(oldestKey)
    }

    cache.set(cacheKey, {
      key: cacheKey,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_TTL
    })
  }

  const search = useCallback(async (params: SearchParams) => {
    // Cancelar request anterior si existe
    if (activeRequestRef.current) {
      activeRequestRef.current.abort()
    }

    setError(null)
    setIsLoading(true)

    try {
      // Validar parámetros
      const validationError = validateSearchParams(params)
      if (validationError) {
        setError(validationError)
        setIsLoading(false)
        return null
      }

      // Check rate limit
      if (!checkRateLimit()) {
        setIsLoading(false)
        return null
      }

      // Verificar cache
      const cacheKey = generateCacheKey(params)
      const cachedResult = getCachedResult(cacheKey)
      
      if (cachedResult) {
        setOffers(cachedResult.offers || [])
        setRequestId(cachedResult.request_id)
        setSearchMetadata(cachedResult.search_metadata)
        setIsLoading(false)
        return cachedResult
      }

      // Crear nuevo AbortController para esta request
      const abortController = new AbortController()
      activeRequestRef.current = abortController

      // Preparar datos de búsqueda con mejores prácticas
      const searchData = {
        origin: params.origin.toUpperCase(),
        destination: params.destination.toUpperCase(),
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        passengers: params.passengers,
        cabinClass: params.cabinClass,
        loyaltyProgrammes: params.loyaltyProgrammes || [],
        corporateDiscounts: params.corporateDiscounts || false,
        // Añadir configuraciones de mejores prácticas
        maxConnections: 2,
        preferDirectFlights: true,
        includeNearbyAirports: false, // Puede configurarse según preferencias
        flexibleDates: false, // Para implementar en futuras versiones
        sortBy: 'price', // price, duration, departure_time
        currency: 'USD',
        // Timeout más largo para búsquedas complejas
        timeout: 30000
      }

      const response = await fetch("/api/duffel/flight-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Search failed with status ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Search failed")
      }

      // Guardar en cache
      setCachedResult(cacheKey, data)

      // Actualizar estado
      setOffers(data.offers || [])
      setRequestId(data.request_id)
      setSearchMetadata(data.search_metadata)

      return data

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request fue cancelada, no mostrar error
        return null
      }

      console.error("Flight search error:", error)
      
      // Manejo específico de errores
      if (error.message.includes('rate limit')) {
        setError("Too many requests. Please wait a moment before searching again.")
      } else if (error.message.includes('airport not found')) {
        setError("One or more airports not found. Please check your airport codes.")
      } else if (error.message.includes('no offers available')) {
        setError("No flights available for the selected route and dates. Try different dates or destinations.")
        setOffers([]) // Limpiar ofertas pero no es un error crítico
      } else {
        setError(error.message || "An error occurred while searching for flights. Please try again.")
      }

      return null
    } finally {
      setIsLoading(false)
      activeRequestRef.current = null
    }
  }, [])

  const clearCache = useCallback(() => {
    cacheRef.current.clear()
    cacheStatsRef.current = { hits: 0, misses: 0 }
  }, [])

  const getCacheStats = useCallback(() => {
    return {
      size: cacheRef.current.size,
      hits: cacheStatsRef.current.hits,
      misses: cacheStatsRef.current.misses
    }
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort()
      }
    }
  }, [])

  return {
    search,
    isLoading,
    error,
    offers,
    requestId,
    searchMetadata,
    clearCache,
    getCacheStats
  }
}