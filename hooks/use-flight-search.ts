import { useState, useCallback, useRef, useEffect } from 'react'
import { flightCache, useSmartCache } from '@/lib/cache-manager'

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

interface UseFlightSearchReturn {
  search: (params: SearchParams) => Promise<any>
  searchDebounced: (params: SearchParams, delayMs?: number) => Promise<any>
  isLoading: boolean
  error: string | null
  offers: any[]
  requestId: string | null
  searchMetadata: any
  clearCache: () => void
  getCacheStats: () => { size: number; hits: number; misses: number; hitRate: number }
  prefetchPopularRoutes: () => Promise<void>
}

export function useFlightSearch(): UseFlightSearchReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [requestId, setRequestId] = useState<string | null>(null)
  const [searchMetadata, setSearchMetadata] = useState<any>(null)

  // Usar cache inteligente
  const { cache, getStats, clear: clearSmartCache, prefetchPopularRoutes } = useSmartCache()
  
  const activeRequestRef = useRef<AbortController | null>(null)
  const rateLimitRef = useRef<{ lastRequest: number; requestCount: number }>({
    lastRequest: 0,
    requestCount: 0
  })

  // Limpiar requests activos al desmontar
  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort()
      }
    }
  }, [])

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

      // Verificar cache inteligente
      const cachedResult = cache.getSearchResult(params)
      
      if (cachedResult) {
        const dataNode = cachedResult.data || cachedResult
        setOffers(dataNode.offers || [])
        setRequestId(dataNode.id || null)
        setSearchMetadata({ cached: true })
        setIsLoading(false)
        return dataNode
      }

      // Crear nuevo AbortController para esta request
      const abortController = new AbortController()
      activeRequestRef.current = abortController

      // Preparar datos de búsqueda con mejores prácticas
      const searchData = {
        origin: params.origin.toUpperCase(),
        destination: params.destination.toUpperCase(),
        departure_date: params.departureDate,
        return_date: params.returnDate,
        passengers: { adults: params.passengers },
        cabin_class: params.cabinClass as any,
        loyalty_programmes: params.loyaltyProgrammes || [],
        filters: {
          max_connections: 2,
          direct_only: true,
        },
        sort_by: 'price' as const,
        currency: 'USD',
      }

      const response = await fetch("/api/flights/duffel/flight-search", {
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

      // Guardar en cache inteligente
      cache.setSearchResult(params, data, 'flight')

      // Actualizar estado
      const dataNode = data.data || data
      setOffers(dataNode.offers || [])
      setRequestId(dataNode.id || null)
      setSearchMetadata({})

      return dataNode

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
  }, [cache])

  // Debounced version to avoid hammering the API when inputs change quickly
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const searchDebounced = useCallback((params: SearchParams, delayMs = 300) => {
    return new Promise<any>((resolve) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        const result = await search(params)
        resolve(result)
      }, delayMs)
    })
  }, [search])

  const clearCache = useCallback(() => {
    clearSmartCache()
  }, [clearSmartCache])

  const getCacheStats = useCallback(() => {
    return getStats()
  }, [getStats])

  return {
    search,
    searchDebounced,
    isLoading,
    error,
    offers,
    requestId,
    searchMetadata,
    clearCache,
    getCacheStats,
    prefetchPopularRoutes
  }
}
