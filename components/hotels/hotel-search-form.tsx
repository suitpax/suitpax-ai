"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, MinusIcon, MapPinIcon } from "lucide-react"
import { useHotelSearch } from "@/hooks/use-hotel-search"

interface HotelSearchFormProps {
  onResults?: (results: any) => void
}

export function HotelSearchForm({ onResults }: HotelSearchFormProps) {
  const [location, setLocation] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)

  const { searchHotels, isLoading, results, error } = useHotelSearch()

  const handleLocationSearch = async () => {
    if (!location) return

    try {
      // Use a geocoding service to get coordinates
      // For demo purposes, using hardcoded coordinates for major cities
      const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        london: { lat: 51.5074, lng: -0.1278 },
        paris: { lat: 48.8566, lng: 2.3522 },
        "new york": { lat: 40.7128, lng: -74.006 },
        tokyo: { lat: 35.6762, lng: 139.6503 },
        madrid: { lat: 40.4168, lng: -3.7038 },
        barcelona: { lat: 41.3851, lng: 2.1734 },
      }

      const coords = cityCoordinates[location.toLowerCase()]
      if (coords) {
        setLatitude(coords.lat)
        setLongitude(coords.lng)
      } else {
        // Fallback to browser geolocation or show error
        alert("City not found. Please try: London, Paris, New York, Tokyo, Madrid, or Barcelona")
      }
    } catch (err) {
      console.error("Location search error:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!latitude || !longitude) {
      alert("Please search for a location first")
      return
    }

    const guests = [...Array(adults).fill({ type: "adult" }), ...Array(children).fill({ type: "child", age: 10 })]

    await searchHotels({
      location: {
        latitude,
        longitude,
        radius: 5, // 5km radius
      },
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      guests,
      rooms,
    })

    if (results && onResults) {
      onResults(results)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-medium tracking-tighter text-center">Search Hotels</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter city name (e.g., London, Paris)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Button type="button" variant="outline" onClick={handleLocationSearch}>
                <MapPinIcon className="h-4 w-4" />
              </Button>
            </div>
            {latitude && longitude && (
              <p className="text-xs text-gray-600">
                Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkin">Check-in Date</Label>
              <Input
                id="checkin"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout">Check-out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
                min={checkInDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Guests and Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label>Guests</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adults</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{adults}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      disabled={adults >= 10}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Children</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{children}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setChildren(Math.min(10, children + 1))}
                      disabled={children >= 10}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Rooms</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Number of Rooms</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    disabled={rooms <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{rooms}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRooms(Math.min(5, rooms + 1))}
                    disabled={rooms >= 5}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading || !latitude || !longitude}>
            {isLoading ? "Searching..." : "Search Hotels"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
