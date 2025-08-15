"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaneIcon, MapPinIcon } from "lucide-react"

interface Airport {
  iata_code: string
  name: string
  city: string
  country: string
}

interface AirportSearchProps {
  placeholder?: string
  value?: string
  onSelect: (airport: Airport) => void
  className?: string
}

export function AirportSearch({ placeholder = "Search airports...", value, onSelect, className }: AirportSearchProps) {
  const [query, setQuery] = useState(value || "")
  const [results, setResults] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const searchAirports = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.airports || [])
        setShowResults(true)
      } catch (error) {
        console.error("Airport search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAirports, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (airport: Airport) => {
    setQuery(`${airport.iata_code} - ${airport.name}`)
    setShowResults(false)
    onSelect(airport)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <PlaneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No airports found</div>
            ) : (
              results.map((airport) => (
                <Button
                  key={airport.iata_code}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto hover:bg-gray-50"
                  onClick={() => handleSelect(airport)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPinIcon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {airport.iata_code} - {airport.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {airport.city}, {airport.country}
                      </div>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
