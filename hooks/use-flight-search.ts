import { useState, useCallback } from 'react'

interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: string
  loyaltyProgrammes?: any[]
  corporateDiscounts?: boolean
  directOnly?: boolean
  airlines?: string // Comma-separated IATA codes, e.g. "IB,BA,AA"
  currency?: string
}

export function useFlightSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (params: SearchParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const body: any = {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate,
        return_date: params.returnDate,
        passengers: { adults: params.passengers },
        cabin_class: params.cabinClass,
        currency: params.currency,
      }

      if (params.directOnly) {
        body.max_connections = 0
      }

      const res = await fetch('/api/flights/duffel/optimized-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Error buscando vuelos')
      }

      const data = await res.json()

      // Normalizar ofertas
      const offers: any[] = Array.isArray(data?.data) ? data.data : (data?.offers || data?.data?.offers || [])

      // Filtrado por aerolíneas (client-side) si se solicitó
      if (params.airlines && offers.length > 0) {
        const allow = params.airlines.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
        const filtered = offers.filter((offer: any) => {
          const segments = offer?.slices?.flatMap((s: any) => s?.segments || []) || []
          return segments.some((seg: any) => allow.includes(seg?.marketing_carrier?.iata_code))
        })
        return { ...data, offers: filtered }
      }

      return data
    } catch (err: any) {
      setError(err?.message || 'Unexpected error')
      return { error: err?.message || 'Unexpected error' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { search, isLoading, error }
}