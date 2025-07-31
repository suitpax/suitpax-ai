"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  HeartIcon,
  ArrowsRightLeftIcon,
  FunnelIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  aircraft: string
  departure: {
    city: string
    airport: string
    code: string
    time: string
    terminal?: string
  }
  arrival: {
    city: string
    airport: string
    code: string
    time: string
    terminal?: string
  }
  duration: string
  stops: number
  stopDetails?: string[]
  price: {
    economy: number
    premium: number
    business: number
    first?: number
  }
  availability: {
    economy: number
    premium: number
    business: number
    first?: number
  }
  amenities: string[]
  baggage: {
    carry: string
    checked: string
  }
  date: string
  carbonEmissions: number
  onTimePerformance: number
  rating: number
  isRefundable: boolean
  isFavorite?: boolean
}

const mockFlights: Flight[] = [
  {
    id: "1",
    airline: "Delta Air Lines",
    airlineCode: "DL",
    flightNumber: "DL 123",
    aircraft: "Boeing 777-300ER",
    departure: {
      city: "New York",
      airport: "John F. Kennedy International",
      code: "JFK",
      time: "08:30",
      terminal: "Terminal 4",
    },
    arrival: {
      city: "London",
      airport: "Heathrow Airport",
      code: "LHR",
      time: "20:45",
      terminal: "Terminal 3",
    },
    duration: "7h 15m",
    stops: 0,
    price: {
      economy: 1245,
      premium: 2890,
      business: 4560,
      first: 8900,
    },
    availability: {
      economy: 12,
      premium: 8,
      business: 4,
      first: 2,
    },
    amenities: ["WiFi", "Entertainment", "Meals", "Power Outlets", "Lie-flat Seats"],
    baggage: {
      carry: "1 x 22lbs",
      checked: "2 x 50lbs",
    },
    date: "2024-03-15",
    carbonEmissions: 1.2,
    onTimePerformance: 87,
    rating: 4.3,
    isRefundable: true,
    isFavorite: true,
  },
  {
    id: "2",
    airline: "American Airlines",
    airlineCode: "AA",
    flightNumber: "AA 456",
    aircraft: "Airbus A350-900",
    departure: {
      city: "New York",
      airport: "John F. Kennedy International",
      code: "JFK",
      time: "14:20",
      terminal: "Terminal 8",
    },
    arrival: {
      city: "London",
      airport: "Heathrow Airport",
      code: "LHR",
      time: "02:35+1",
      terminal: "Terminal 5",
    },
    duration: "7h 15m",
    stops: 0,
    price: {
      economy: 1189,
      premium: 2650,
      business: 4200,
    },
    availability: {
      economy: 18,
      premium: 6,
      business: 3,
    },
    amenities: ["WiFi", "Entertainment", "Meals", "Power Outlets"],
    baggage: {
      carry: "1 x 22lbs",
      checked: "1 x 50lbs",
    },
    date: "2024-03-15",
    carbonEmissions: 1.1,
    onTimePerformance: 82,
    rating: 4.1,
    isRefundable: false,
  },
  {
    id: "3",
    airline: "United Airlines",
    airlineCode: "UA",
    flightNumber: "UA 789",
    aircraft: "Boeing 787-9",
    departure: {
      city: "New York",
      airport: "Newark Liberty International",
      code: "EWR",
      time: "22:10",
      terminal: "Terminal C",
    },
    arrival: {
      city: "London",
      airport: "Heathrow Airport",
      code: "LHR",
      time: "10:25+1",
      terminal: "Terminal 2",
    },
    duration: "7h 15m",
    stops: 0,
    price: {
      economy: 1356,
      premium: 3100,
      business: 4890,
    },
    availability: {
      economy: 9,
      premium: 12,
      business: 6,
    },
    amenities: ["WiFi", "Entertainment", "Meals", "Power Outlets", "Premium Dining"],
    baggage: {
      carry: "1 x 22lbs",
      checked: "2 x 50lbs",
    },
    date: "2024-03-15",
    carbonEmissions: 1.0,
    onTimePerformance: 89,
    rating: 4.5,
    isRefundable: true,
  },
]

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>(mockFlights)
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(mockFlights)
  const [searchParams, setSearchParams] = useState({
    from: "New York (JFK)",
    to: "London (LHR)",
    departDate: "2024-03-15",
    returnDate: "2024-03-22",
    passengers: 1,
    class: "economy",
    tripType: "roundtrip",
  })
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    airlines: [] as string[],
    stops: "any",
    departureTime: "any",
    duration: "any",
    amenities: [] as string[],
  })
  const [sortBy, setSortBy] = useState("price")
  const [selectedClass, setSelectedClass] = useState<keyof Flight["price"]>("economy")
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    let filtered = [...flights]

    // Apply filters
    if (filters.priceRange) {
      filtered = filtered.filter(
        (flight) =>
          flight.price[selectedClass] >= filters.priceRange[0] && flight.price[selectedClass] <= filters.priceRange[1],
      )
    }

    if (filters.airlines.length > 0) {
      filtered = filtered.filter((flight) => filters.airlines.includes(flight.airlineCode))
    }

    if (filters.stops !== "any") {
      const maxStops = filters.stops === "nonstop" ? 0 : Number.parseInt(filters.stops)
      filtered = filtered.filter((flight) => flight.stops <= maxStops)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price[selectedClass] - b.price[selectedClass]
        case "duration":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        case "departure":
          return a.departure.time.localeCompare(b.departure.time)
        case "rating":
          return b.rating - a.rating
        case "emissions":
          return a.carbonEmissions - b.carbonEmissions
        default:
          return 0
      }
    })

    setFilteredFlights(filtered)
  }, [flights, filters, sortBy, selectedClass])

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSearching(false)
  }

  const toggleFavorite = (flightId: string) => {
    setFlights(
      flights.map((flight) => (flight.id === flightId ? { ...flight, isFavorite: !flight.isFavorite } : flight)),
    )
  }

  const getClassPrice = (flight: Flight, className: keyof Flight["price"]) => {
    return flight.price[className] || 0
  }

  const getClassAvailability = (flight: Flight, className: keyof Flight["price"]) => {
    return flight.availability[className] || 0
  }

  const airlines = Array.from(new Set(flights.map((f) => f.airlineCode)))
  const allAmenities = Array.from(new Set(flights.flatMap((f) => f.amenities)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">
              <em className="font-serif italic">Flights</em>
            </h1>
            <p className="text-gray-600 font-light">Find and book the perfect business travel flights</p>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            <SparklesIcon className="h-4 w-4 mr-2" />
            AI Recommendations
          </Button>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <Tabs
              value={searchParams.tripType}
              onValueChange={(value) => setSearchParams({ ...searchParams, tripType: value })}
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
                <TabsTrigger value="oneway">One Way</TabsTrigger>
                <TabsTrigger value="multicity">Multi-City</TabsTrigger>
              </TabsList>

              <TabsContent value="roundtrip" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="from">From</Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="from"
                        value={searchParams.from}
                        onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                        className="pl-10"
                        placeholder="Departure city"
                      />
                    </div>
                  </div>

                  <div className="flex items-end justify-center">
                    <Button variant="ghost" size="sm" className="p-2">
                      <ArrowsRightLeftIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="to">To</Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="to"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                        className="pl-10"
                        placeholder="Destination city"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="departure">Departure</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="departure"
                        type="date"
                        value={searchParams.departDate}
                        onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="return">Return</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="return"
                        type="date"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="passengers">Passengers</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Select
                        value={searchParams.passengers.toString()}
                        onValueChange={(value) =>
                          setSearchParams({ ...searchParams, passengers: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Passenger" : "Passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="class">Class</Label>
                    <Select
                      value={searchParams.class}
                      onValueChange={(value) => setSearchParams({ ...searchParams, class: value })}
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

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <Dialog open={showFilters} onOpenChange={setShowFilters}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="bg-transparent">
                          <FunnelIcon className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Flight Filters</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <Label>Price Range</Label>
                            <div className="mt-2">
                              <Slider
                                value={filters.priceRange}
                                onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                                max={5000}
                                min={0}
                                step={50}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>${filters.priceRange[0]}</span>
                                <span>${filters.priceRange[1]}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Airlines</Label>
                            <div className="mt-2 space-y-2">
                              {airlines.map((airline) => (
                                <div key={airline} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={airline}
                                    checked={filters.airlines.includes(airline)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setFilters({ ...filters, airlines: [...filters.airlines, airline] })
                                      } else {
                                        setFilters({
                                          ...filters,
                                          airlines: filters.airlines.filter((a) => a !== airline),
                                        })
                                      }
                                    }}
                                  />
                                  <Label htmlFor={airline}>{airline}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>Stops</Label>
                            <Select
                              value={filters.stops}
                              onValueChange={(value) => setFilters({ ...filters, stops: value })}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any number of stops</SelectItem>
                                <SelectItem value="nonstop">Non-stop only</SelectItem>
                                <SelectItem value="1">1 stop or fewer</SelectItem>
                                <SelectItem value="2">2 stops or fewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Amenities</Label>
                            <div className="mt-2 space-y-2">
                              {allAmenities.slice(0, 5).map((amenity) => (
                                <div key={amenity} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={amenity}
                                    checked={filters.amenities.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setFilters({ ...filters, amenities: [...filters.amenities, amenity] })
                                      } else {
                                        setFilters({
                                          ...filters,
                                          amenities: filters.amenities.filter((a) => a !== amenity),
                                        })
                                      }
                                    }}
                                  />
                                  <Label htmlFor={amenity}>{amenity}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price (Low to High)</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="departure">Departure Time</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="emissions">Carbon Emissions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                        Search Flights
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Class Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">View prices for:</span>
          <div className="flex items-center space-x-1">
            {(["economy", "premium", "business", "first"] as const).map((className) => (
              <Button
                key={className}
                variant={selectedClass === className ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedClass(className)}
                className={selectedClass === className ? "bg-black text-white" : "bg-transparent"}
              >
                {className === "economy" && "Economy"}
                {className === "premium" && "Premium"}
                {className === "business" && "Business"}
                {className === "first" && "First"}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-tighter">Available Flights</h2>
            <p className="text-sm text-gray-600 font-light">
              {filteredFlights.length} flights found • {searchParams.from} → {searchParams.to}
            </p>
          </div>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">{filteredFlights.length} results</Badge>
        </div>
      </motion.div>

      {/* Flight Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        {filteredFlights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Flight Info */}
                  <div className="flex-1 space-y-4">
                    {/* Airline Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{flight.airlineCode}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 tracking-tight">{flight.airline}</p>
                          <p className="text-sm text-gray-500">
                            {flight.flightNumber} • {flight.aircraft}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(flight.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {flight.isFavorite ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex items-center space-x-1">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium">{flight.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Route */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-medium tracking-tight">{flight.departure.time}</div>
                        <div className="text-sm text-gray-900 font-medium">{flight.departure.code}</div>
                        <div className="text-xs text-gray-500">{flight.departure.airport}</div>
                        {flight.departure.terminal && (
                          <div className="text-xs text-gray-500">{flight.departure.terminal}</div>
                        )}
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{flight.duration}</span>
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <PaperAirplaneIcon className="h-4 w-4 text-gray-400 mx-2" />
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </div>
                      </div>

                      <div className="text-right md:text-left">
                        <div className="text-2xl font-medium tracking-tight">{flight.arrival.time}</div>
                        <div className="text-sm text-gray-900 font-medium">{flight.arrival.code}</div>
                        <div className="text-xs text-gray-500">{flight.arrival.airport}</div>
                        {flight.arrival.terminal && (
                          <div className="text-xs text-gray-500">{flight.arrival.terminal}</div>
                        )}
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>🌱</span>
                        <span>{flight.carbonEmissions}t CO₂</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>{flight.onTimePerformance}% on-time</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🧳</span>
                        <span>{flight.baggage.carry} carry-on</span>
                      </div>
                      {flight.isRefundable && (
                        <div className="flex items-center space-x-1">
                          <span>✅</span>
                          <span>Refundable</span>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {flight.amenities.slice(0, 4).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs bg-gray-50">
                          {amenity}
                        </Badge>
                      ))}
                      {flight.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          +{flight.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price and Book */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-3 lg:min-w-[200px]">
                    <div className="text-right">
                      <div className="flex items-center text-3xl font-medium tracking-tight">
                        <CurrencyDollarIcon className="h-6 w-6 mr-1" />
                        {getClassPrice(flight, selectedClass).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getClassAvailability(flight, selectedClass)} seats left
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)} Class
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button className="bg-black text-white hover:bg-gray-800 px-8">Select Flight</Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredFlights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center"
        >
          <PaperAirplaneIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">No flights found</h3>
          <p className="text-gray-600 font-light mb-6">
            Try adjusting your search criteria or filters to find more flights.
          </p>
          <Button
            onClick={() =>
              setFilters({
                priceRange: [0, 5000],
                airlines: [],
                stops: "any",
                departureTime: "any",
                duration: "any",
                amenities: [],
              })
            }
            className="bg-black text-white hover:bg-gray-800"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}
