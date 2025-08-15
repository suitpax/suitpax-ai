"use client"

import { useState } from "react"

interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passengers: Array<{
    type: "adult" | "child" | "infant_without_seat"
    age?: number
  }>
  cabin_class?: "economy" | "premium_economy" | "business" | "first"
}

export function useFlightSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const searchFlights = async (params: FlightSearchParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/flights/search", {
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

      setResults(data.offers || [])
      return data.offers || []
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    searchFlights,
    isLoading,
    results,
    error,
  }
}
