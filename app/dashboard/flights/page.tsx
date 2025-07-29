"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, CalendarIcon, Search, Filter, Star, Wifi, Coffee, Utensils, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface FlightSearchParams {
  from: string
  to: string
  departureDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  class: string
}

interface FlightResult {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
  }
  arrival: {
    airport: string
    city: string
    time: string
  }
  duration: string
  price: number
  class: string
  amenities: string[]
  stops: number
}

const SAMPLE_FLIGHTS: FlightResult[] = [
  {
    id: "1",
    airline: "Iberia",
    flightNumber: "IB3201",
    departure: { airport: "MAD", city: "Madrid", time: "08:30" },
    arrival: { airport: "LHR", city: "London", time: "10:15" },
    duration: "2h 45m",
    price: 245,
    class: "economy",
    amenities: ["wifi", "meal", "entertainment"],
    stops: 0,
  },
  {
    id: "2",
    airline: "British Airways",
    flightNumber: "BA461",
    departure: { airport: "MAD", city: "Madrid", time: "14:20" },
    arrival: { airport: "LHR", city: "London", time: "16:05" },
    duration: "2h 45m",
    price: 289,
    class: "economy",
    amenities: ["wifi", "meal", "lounge"],
    stops: 0,
  },
  {
    id: "3",
    airline: "Lufthansa",
    flightNumber: "LH1110",
    departure: { airport: "MAD", city: "Madrid", time: "11:15" },
    arrival: { airport: "LHR", city: "London", time: "15:30" },
    duration: "4h 15m",
    price: 198,
    class: "economy",
    amenities: ["wifi", "snack"],
    stops: 1,
  },
]

const POPULAR_DESTINATIONS = [
  { code: "LHR", city: "London", country: "United Kingdom" },
  { code: "CDG", city: "Paris", country: "France" },
  { code: "FRA", city: "Frankfurt", country: "Germany" },
  { code: "AMS", city: "Amsterdam", country: "Netherlands" },
  { code: "ZUR", city: "Zurich", country: "Switzerland" },
  { code: "MXP", city: "Milan", country: "Italy" },
]

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: "",
    to: "",
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    class: "economy",
  })
  const [flights, setFlights] = useState<FlightResult[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [bookingFlight, setBookingFlight] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
        setUser(userData)
      }
    }
    fetchUser()
  }, [supabase])

  const searchFlights = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
      toast.error("Please complete all required fields.")
      return
    }

    setLoading(true)
    const toastId = toast.loading("Searching for flights...")

    // Simulate flight search
    setTimeout(() => {
      setFlights(SAMPLE_FLIGHTS)
      setLoading(false)
      toast.success(`${SAMPLE_FLIGHTS.length} flights found!`, { id: toastId })
    }, 2000)
  }

  const bookFlight = async (flight: FlightResult) => {
    if (!user) return

    setBookingFlight(flight.id)
    const toastId = toast.loading("Booking flight...")

    try {
      const { error } = await supabase.from("flight_bookings").insert({
        user_id: user.id,
        departure_city: flight.departure.city,
        arrival_city: flight.arrival.city,
        departure_date: searchParams.departureDate?.toISOString().split("T")[0],
        return_date: searchParams.returnDate?.toISOString().split("T")[0],
        passenger_name: user.full_name,
        passenger_email: user.email,
        airline: flight.airline,
        flight_number: flight.flightNumber,
        seat_class: flight.class,
        total_price: flight.price,
        status: "pending",
        booking_data: flight,
      })

      if (error) throw error

      toast.success("Flight booked successfully! A confirmation email will be sent.", { id: toastId })

      // Automatically create an expense
      await supabase.from("expenses").insert({
        user_id: user.id,
        title: `Flight ${flight.departure.city} - ${flight.arrival.city}`,
        description: `${flight.airline} ${flight.flightNumber}`,
        amount: flight.price,
        category: "Transport",
        expense_date: searchParams.departureDate?.toISOString().split("T")[0],
        status: "submitted",
      })
    } catch (error) {
      console.error("Error booking flight:", error)
      toast.error("Failed to book flight. Please try again.", { id: toastId })
    } finally {
      setBookingFlight(null)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "meal":
        return <Utensils className="h-4 w-4" />
      case "entertainment":
        return <Star className="h-4 w-4" />
      case "lounge":
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">Flight Booking</h1>
          <p className="text-gray-500 mt-1">Find and book flights for your business trips.</p>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Flights</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Flights
              </CardTitle>
              <CardDescription>Find the best flights for your business trip.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Select
                    value={searchParams.from}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, from: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">Madrid (MAD)</SelectItem>
                      <SelectItem value="BCN">Barcelona (BCN)</SelectItem>
                      <SelectItem value="SVQ">Seville (SVQ)</SelectItem>
                      <SelectItem value="VLC">Valencia (VLC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Select
                    value={searchParams.to}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, to: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_DESTINATIONS.map((dest) => (
                        <SelectItem key={dest.code} value={dest.code}>
                          {dest.city} ({dest.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.departureDate ? (
                          format(searchParams.departureDate, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.departureDate}
                        onSelect={(date) => setSearchParams((prev) => ({ ...prev, departureDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Return Date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.returnDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.returnDate ? format(searchParams.returnDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.returnDate}
                        onSelect={(date) => setSearchParams((prev) => ({ ...prev, returnDate: date }))}
                        disabled={(date) => date < (searchParams.departureDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={searchParams.class}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, class: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={searchFlights} className="w-full bg-black hover:bg-gray-800" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Flights
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {flights.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tighter">Search Results ({flights.length} flights)</h2>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              {flights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-3 items-center">
                          <div className="text-left">
                            <p className="text-xl font-bold">{flight.departure.time}</p>
                            <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-600">{flight.duration}</p>
                            <div className="flex items-center justify-center space-x-2 text-gray-400">
                              <div className="h-px bg-gray-300 flex-1"></div>
                              <Plane className="h-4 w-4" />
                              <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                            {flight.stops > 0 && <p className="text-xs text-orange-600">{flight.stops} stop(s)</p>}
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold">{flight.arrival.time}</p>
                            <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <p className="text-sm text-gray-600">{flight.airline}</p>
                              <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                            </div>
                            <Badge variant="outline" className="text-xs capitalize">
                              {flight.class}
                            </Badge>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <p className="text-xl font-bold text-gray-800">€{flight.price}</p>
                            <Button
                              onClick={() => bookFlight(flight)}
                              disabled={bookingFlight === flight.id}
                              className="bg-black hover:bg-gray-800"
                              size="sm"
                            >
                              {bookingFlight === flight.id ? "Booking..." : "Book"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>History of your flight bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You have no flight bookings yet</p>
                <p className="text-sm text-gray-500 mt-1">Your bookings will appear here once you book a flight</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
