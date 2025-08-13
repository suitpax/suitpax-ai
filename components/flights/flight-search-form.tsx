"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, MinusIcon } from "lucide-react"
import { useFlightSearch } from "@/hooks/use-flight-search"

interface FlightSearchFormProps {
  onResults?: (results: any) => void
}

export function FlightSearchForm({ onResults }: FlightSearchFormProps) {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("round-trip")
  const [cabinClass, setCabinClass] = useState<"economy" | "premium_economy" | "business" | "first">("economy")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const { searchFlights, isLoading, results, error } = useFlightSearch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const passengers = [
      ...Array(adults).fill({ type: "adult" }),
      ...Array(children).fill({ type: "child", age: 10 }),
      ...Array(infants).fill({ type: "infant_without_seat", age: 1 }),
    ]

    await searchFlights({
      origin,
      destination,
      departure_date: departureDate,
      return_date: tripType === "round-trip" ? returnDate : undefined,
      passengers,
      cabin_class: cabinClass,
    })

    if (results && onResults) {
      onResults(results)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-medium tracking-tighter text-center">Search Flights</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant={tripType === "round-trip" ? "default" : "outline"}
              onClick={() => setTripType("round-trip")}
              className="flex-1"
            >
              Round Trip
            </Button>
            <Button
              type="button"
              variant={tripType === "one-way" ? "default" : "outline"}
              onClick={() => setTripType("one-way")}
              className="flex-1"
            >
              One Way
            </Button>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <Input
                id="origin"
                placeholder="Origin airport (e.g., JFK)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                required
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="Destination airport (e.g., LAX)"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                required
                maxLength={3}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure">Departure Date</Label>
              <Input
                id="departure"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {tripType === "round-trip" && (
              <div className="space-y-2">
                <Label htmlFor="return">Return Date</Label>
                <Input
                  id="return"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  min={departureDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            )}
          </div>

          {/* Passengers and Cabin Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label>Passengers</Label>
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
                      onClick={() => setAdults(Math.min(9, adults + 1))}
                      disabled={adults >= 9}
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
                      onClick={() => setChildren(Math.min(9, children + 1))}
                      disabled={children >= 9}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Infants</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      disabled={infants <= 0}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{infants}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInfants(Math.min(adults, infants + 1))}
                      disabled={infants >= adults}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cabin">Cabin Class</Label>
              <Select value={cabinClass} onValueChange={(value: any) => setCabinClass(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search Flights"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
