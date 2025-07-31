"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Users, Plane, Clock, MapPin, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
  }
  duration: string
  price: number
  stops: number
  aircraft: string
}

const mockFlights: Flight[] = [
  {
    id: "1",
    airline: "American Airlines",
    flightNumber: "AA 1234",
    departure: {
      airport: "JFK",
      city: "New York",
      time: "08:30",
      date: "2024-02-15",
    },
    arrival: {
      airport: "LAX",
      city: "Los Angeles",
      time: "11:45",
      date: "2024-02-15",
    },
    duration: "6h 15m",
    price: 459,
    stops: 0,
    aircraft: "Boeing 737",
  },
  {
    id: "2",
    airline: "Delta Air Lines",
    flightNumber: "DL 5678",
    departure: {
      airport: "JFK",
      city: "New York",
      time: "14:20",
      date: "2024-02-15",
    },
    arrival: {
      airport: "LAX",
      city: "Los Angeles",
      time: "17:55",
      date: "2024-02-15",
    },
    duration: "6h 35m",
    price: 389,
    stops: 0,
    aircraft: "Airbus A320",
  },
]

export default function FlightsPage() {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    passengers: 1,
    class: "economy",
    tripType: "roundtrip",
  })
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)

    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlights)
      setLoading(false)
    }, 2000)
  }

  const handleBookFlight = async (flight: Flight) => {
    // Here you would integrate with your booking system
    console.log("Booking flight:", flight)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white"
        style={{
          backgroundImage: "url('/images/airplane-landing-sunset.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              <Plane className="w-3 h-3 mr-1" />
              Business Travel
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">AI-Powered</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-xl font-light opacity-90 max-w-2xl">
            Search and book flights with our AI-powered platform. Get the best deals for your business travel.
          </p>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-medium tracking-tighter">Search Flights</CardTitle>
            <CardDescription>Find and book your next business trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trip Type */}
            <div className="flex space-x-4">
              <Button
                variant={searchData.tripType === "roundtrip" ? "default" : "outline"}
                onClick={() => setSearchData({ ...searchData, tripType: "roundtrip" })}
                className="bg-black text-white hover:bg-gray-800"
              >
                Round Trip
              </Button>
              <Button
                variant={searchData.tripType === "oneway" ? "default" : "outline"}
                onClick={() => setSearchData({ ...searchData, tripType: "oneway" })}
                className="border-gray-200"
              >
                One Way
              </Button>
            </div>

            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="from"
                    placeholder="New York (JFK)"
                    value={searchData.from}
                    onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="to"
                    placeholder="Los Angeles (LAX)"
                    value={searchData.to}
                    onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !searchData.departDate && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {searchData.departDate ? format(searchData.departDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={searchData.departDate}
                      onSelect={(date) => setSearchData({ ...searchData, departDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {searchData.tripType === "roundtrip" && (
                <div className="space-y-2">
                  <Label>Return Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchData.returnDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {searchData.returnDate ? format(searchData.returnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={searchData.returnDate}
                        onSelect={(date) => setSearchData({ ...searchData, returnDate: date })}
                        disabled={(date) => date < (searchData.departDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Passengers</Label>
                <Select
                  value={searchData.passengers.toString()}
                  onValueChange={(value) => setSearchData({ ...searchData, passengers: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={searchData.class}
                  onValueChange={(value) => setSearchData({ ...searchData, class: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-medium tracking-tight"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching Flights...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Flights
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : flights.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium tracking-tighter">Available Flights</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {flights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Plane className="h-6 w-6 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-medium tracking-tight">{flight.airline}</h3>
                                <p className="text-sm text-gray-500">
                                  {flight.flightNumber} • {flight.aircraft}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                              <div className="text-center">
                                <p className="text-2xl font-medium tracking-tighter">{flight.departure.time}</p>
                                <p className="text-sm text-gray-500">{flight.departure.airport}</p>
                                <p className="text-xs text-gray-400">{flight.departure.city}</p>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                  <div className="h-px bg-gray-300 flex-1"></div>
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <div className="h-px bg-gray-300 flex-1"></div>
                                </div>
                                <p className="text-sm font-medium">{flight.duration}</p>
                                <p className="text-xs text-gray-500">
                                  {flight.stops === 0
                                    ? "Nonstop"
                                    : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                                </p>
                              </div>

                              <div className="text-center">
                                <p className="text-2xl font-medium tracking-tighter">{flight.arrival.time}</p>
                                <p className="text-sm text-gray-500">{flight.arrival.airport}</p>
                                <p className="text-xs text-gray-400">{flight.arrival.city}</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-right ml-6">
                            <p className="text-3xl font-medium tracking-tighter mb-2">${flight.price}</p>
                            <Button
                              onClick={() => handleBookFlight(flight)}
                              className="bg-black text-white hover:bg-gray-800 tracking-tight"
                            >
                              Book Flight
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-600 font-light">Try adjusting your search criteria to find more options.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!searched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="text-center py-16 bg-white/50 backdrop-blur-sm border-gray-200">
            <CardContent>
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-2">Ready to find your next flight?</h3>
              <p className="text-gray-600 font-light max-w-md mx-auto">
                Use our advanced search to find the perfect flights for your business travel needs.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
