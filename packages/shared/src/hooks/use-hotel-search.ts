"use client"

import { useState } from "react"

interface HotelSearchParams {
  location: {
    latitude: number
    longitude: number
    radius: number
  }
  check_in_date: string
  check_out_date: string
  guests: Array<{
    type: "adult" | "child"
    age?: number
  }>
  rooms: number
}

export function useHotelSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const searchHotels = async (params: HotelSearchParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/hotels/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Search failed")
      }

      setResults(data.results)
      return data.results
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getHotelRates = async (searchResultId: string) => {
    try {
      const response = await fetch(`/api/hotels/rates/${searchResultId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get rates")
      }

      return data.rates
    } catch (err) {
      throw err
    }
  }

  const createQuote = async (rateId: string) => {
    try {
      const response = await fetch("/api/hotels/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate_id: rateId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create quote")
      }

      return data.quote
    } catch (err) {
      throw err
    }
  }

  return {
    searchHotels,
    getHotelRates,
    createQuote,
    isLoading,
    results,
    error,
  }
}
