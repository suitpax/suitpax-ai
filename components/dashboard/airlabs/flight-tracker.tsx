"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plane, MapPin, Clock, Users, Search, RefreshCw } from "lucide-react"
import type { Flight } from "@/lib/airlabs/client"

interface FlightTrackerProps {
  className?: string
}

export function FlightTracker({ className }: FlightTrackerProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("global")

  const fetchFlights = async (params: Record<string, any> = {}) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`/api/airlabs/flights?${queryParams}`)
      const data = await response.json()

      if (data.response) {
        setFlights(data.response.slice(0, 50)) // Limit to 50 flights for performance
      }
    } catch (error) {
      console.error("Error fetching flights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights({ limit: 50 })
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchFlights({
        flight_number: searchQuery,
        limit: 50,
      })
    } else {
      fetchFlights({ limit: 50 })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "en-route":
        return "bg-green-100 text-green-800 border-green-200"
      case "landed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatAltitude = (alt: number) => {
    return alt ? `${Math.round(alt).toLocaleString()} ft` : "N/A"
  }

  const formatSpeed = (speed: number) => {
    return speed ? `${Math.round(speed)} kts` : "N/A"
  }

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              Live Flight Tracker
            </CardTitle>
            <CardDescription className="text-gray-600">Real-time flight positions and status updates</CardDescription>
          </div>
          <Button
            onClick={() => fetchFlights({ limit: 50 })}
            variant="outline"
            size="sm"
            disabled={loading}
            className="rounded-xl border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search flights
            </Label>
            <Input
              id="search"
              placeholder="Search by flight number (e.g., AA123, BA456)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="rounded-xl border-gray-300"
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl">
            <TabsTrigger value="list" className="rounded-lg">
              Flight List
            </TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg">
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : flights.length > 0 ? (
                  flights.map((flight, index) => (
                    <div
                      key={`${flight.hex}-${index}`}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg">
                            {flight.flight_iata || flight.flight_icao || "N/A"}
                          </Badge>
                          <Badge variant="outline" className={`rounded-lg ${getStatusColor(flight.status)}`}>
                            {flight.status || "Unknown"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">{flight.reg_number || "N/A"}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">Route:</span>
                          </div>
                          <div className="text-gray-900">
                            {flight.dep_iata || flight.dep_icao || "N/A"} →{" "}
                            {flight.arr_iata || flight.arr_icao || "N/A"}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="h-3 w-3" />
                            <span className="font-medium">Airline:</span>
                          </div>
                          <div className="text-gray-900">{flight.airline_iata || flight.airline_icao || "N/A"}</div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">Altitude:</span>
                          </div>
                          <div className="text-gray-900">{formatAltitude(flight.alt)}</div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Plane className="h-3 w-3" />
                            <span className="font-medium">Speed:</span>
                          </div>
                          <div className="text-gray-900">{formatSpeed(flight.speed)}</div>
                        </div>
                      </div>

                      {flight.lat && flight.lng && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            Position: {flight.lat.toFixed(4)}, {flight.lng.toFixed(4)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No flights found. Try adjusting your search criteria.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-50 border-gray-200 rounded-xl">
                <CardContent className="p-4">
                  <div className="text-2xl font-semibold text-gray-900">{flights.length}</div>
                  <div className="text-sm text-gray-600">Active Flights</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 rounded-xl">
                <CardContent className="p-4">
                  <div className="text-2xl font-semibold text-gray-900">
                    {new Set(flights.map((f) => f.airline_iata || f.airline_icao)).size}
                  </div>
                  <div className="text-sm text-gray-600">Airlines</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 rounded-xl">
                <CardContent className="p-4">
                  <div className="text-2xl font-semibold text-gray-900">
                    {flights.filter((f) => f.status === "en-route").length}
                  </div>
                  <div className="text-sm text-gray-600">En Route</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 rounded-xl">
                <CardContent className="p-4">
                  <div className="text-2xl font-semibold text-gray-900">
                    {flights.filter((f) => f.status === "landed").length}
                  </div>
                  <div className="text-sm text-gray-600">Landed</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
