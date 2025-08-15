"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Search, Globe, Clock } from "lucide-react"
import type { Airport } from "@/lib/airlabs/client"

interface AirportInfoProps {
  className?: string
}

export function AirportInfo({ className }: AirportInfoProps) {
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchAirports = async (params: Record<string, any> = {}) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`/api/airlabs/airports?${queryParams}`)
      const data = await response.json()

      if (data.response) {
        setAirports(data.response.slice(0, 20)) // Limit to 20 airports
      }
    } catch (error) {
      console.error("Error fetching airports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Try different search parameters
      if (searchQuery.length === 3 && searchQuery.match(/^[A-Z]+$/)) {
        // IATA code
        fetchAirports({ iata_code: searchQuery })
      } else if (searchQuery.length === 4 && searchQuery.match(/^[A-Z]+$/)) {
        // ICAO code
        fetchAirports({ icao_code: searchQuery })
      } else {
        // Name search
        fetchAirports({ name: searchQuery })
      }
    } else {
      fetchAirports()
    }
  }

  useEffect(() => {
    fetchAirports()
  }, [])

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          Airport Information
        </CardTitle>
        <CardDescription className="text-gray-600">Search and explore airport details worldwide</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="airport-search" className="sr-only">
              Search airports
            </Label>
            <Input
              id="airport-search"
              placeholder="Search by name, IATA (JFK) or ICAO (KJFK) code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="rounded-xl border-gray-300"
            />
          </div>
          <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-96">
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
              </div>
            ) : airports.length > 0 ? (
              airports.map((airport, index) => (
                <div
                  key={`${airport.icao_code}-${index}`}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 rounded-lg">
                        {airport.iata_code || "N/A"}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 rounded-lg">
                        {airport.icao_code || "N/A"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{airport.country_code || "N/A"}</div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{airport.name || "Unknown Airport"}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{airport.city || "Unknown City"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Globe className="h-3 w-3" />
                        <span className="font-medium">Coordinates:</span>
                      </div>
                      <div className="text-gray-900">
                        {airport.lat && airport.lng ? `${airport.lat.toFixed(4)}, ${airport.lng.toFixed(4)}` : "N/A"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">Timezone:</span>
                      </div>
                      <div className="text-gray-900">{airport.timezone || "N/A"}</div>
                    </div>
                  </div>

                  {airport.alt && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500">Elevation: {Math.round(airport.alt)} ft</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No airports found. Try searching for a specific airport name or code.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
