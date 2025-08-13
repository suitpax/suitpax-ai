"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Train,
  MapPin,
  CalendarIcon,
  ArrowRight,
  Wifi,
  Coffee,
  Zap,
  Shield,
  Search,
  Filter,
  SortAsc,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TrainRoute {
  id: string
  operator: string
  departure: {
    station: string
    time: string
    platform?: string
  }
  arrival: {
    station: string
    time: string
    platform?: string
  }
  duration: string
  price: {
    economy: number
    business: number
    first?: number
  }
  amenities: string[]
  stops: number
  type: "high-speed" | "regional" | "intercity"
  availability: {
    economy: number
    business: number
    first?: number
  }
}

const mockTrainRoutes: TrainRoute[] = [
  {
    id: "1",
    operator: "Eurostar",
    departure: { station: "London St Pancras", time: "07:31", platform: "5" },
    arrival: { station: "Paris Gare du Nord", time: "10:47", platform: "3" },
    duration: "2h 16m",
    price: { economy: 89, business: 189, first: 299 },
    amenities: ["wifi", "food", "power", "quiet"],
    stops: 0,
    type: "high-speed",
    availability: { economy: 45, business: 12, first: 4 },
  },
  {
    id: "2",
    operator: "SNCF Connect",
    departure: { station: "Paris Gare de Lyon", time: "09:15", platform: "M" },
    arrival: { station: "Lyon Part-Dieu", time: "11:12", platform: "4" },
    duration: "1h 57m",
    price: { economy: 45, business: 95 },
    amenities: ["wifi", "food", "power"],
    stops: 0,
    type: "high-speed",
    availability: { economy: 78, business: 23 },
  },
  {
    id: "3",
    operator: "Deutsche Bahn",
    departure: { station: "Berlin Hauptbahnhof", time: "06:28", platform: "7" },
    arrival: { station: "Munich Central", time: "10:32", platform: "12" },
    duration: "4h 4m",
    price: { economy: 67, business: 134, first: 234 },
    amenities: ["wifi", "food", "power", "quiet"],
    stops: 2,
    type: "high-speed",
    availability: { economy: 156, business: 34, first: 8 },
  },
]

const popularRoutes = [
  { from: "London", to: "Paris", duration: "2h 16m", from_price: 89 },
  { from: "Paris", to: "Amsterdam", duration: "3h 20m", from_price: 65 },
  { from: "Berlin", to: "Munich", duration: "4h 4m", from_price: 67 },
  { from: "Madrid", to: "Barcelona", duration: "2h 30m", from_price: 45 },
  { from: "Rome", to: "Milan", duration: "2h 55m", from_price: 52 },
  { from: "Brussels", to: "London", duration: "2h 1m", from_price: 78 },
]

export default function TrainsPage() {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departureDate: new Date(),
    returnDate: new Date(),
    passengers: 1,
    class: "economy",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<TrainRoute[]>([])
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSearchResults(mockTrainRoutes)
    setIsSearching(false)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "food":
        return <Coffee className="h-4 w-4" />
      case "power":
        return <Zap className="h-4 w-4" />
      case "quiet":
        return <Shield className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "high-speed":
        return "bg-emerald-100 text-emerald-800"
      case "intercity":
        return "bg-blue-100 text-blue-800"
      case "regional":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-200 rounded-xl">
              <Train className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-gray-900">Train Booking</h1>
              <p className="text-sm text-gray-600">Book high-speed trains across Europe</p>
            </div>
          </div>

          {/* Search Form */}
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <Tabs
                value={tripType}
                onValueChange={(value) => setTripType(value as "one-way" | "round-trip")}
                className="mb-6"
              >
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="one-way">One Way</TabsTrigger>
                  <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Departure station"
                      value={searchParams.from}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, from: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Arrival station"
                      value={searchParams.to}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, to: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Departure</label>
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
                        {searchParams.departureDate ? format(searchParams.departureDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.departureDate}
                        onSelect={(date) => date && setSearchParams((prev) => ({ ...prev, departureDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Passengers</label>
                  <Select
                    value={searchParams.passengers.toString()}
                    onValueChange={(value) =>
                      setSearchParams((prev) => ({ ...prev, passengers: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchParams.from || !searchParams.to}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching trains...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search Trains
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchResults.length === 0 ? (
          <div className="space-y-8">
            {/* Popular Routes */}
            <div>
              <h2 className="text-xl font-medium tracking-tighter text-gray-900 mb-6">Popular Routes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularRoutes.map((route, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{route.from}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{route.to}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {route.duration}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">From</span>
                          <span className="font-medium text-gray-900">€{route.from_price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-medium tracking-tighter text-gray-900 mb-6">Why Choose Train Travel</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-2 bg-emerald-100 rounded-xl w-fit mb-4">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">High-Speed Travel</h3>
                    <p className="text-sm text-gray-600">
                      Reach your destination faster with high-speed rail networks across Europe.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-2 bg-blue-100 rounded-xl w-fit mb-4">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Eco-Friendly</h3>
                    <p className="text-sm text-gray-600">
                      Reduce your carbon footprint with sustainable train travel options.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-2 bg-purple-100 rounded-xl w-fit mb-4">
                      <Coffee className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Comfort & Amenities</h3>
                    <p className="text-sm text-gray-600">
                      Enjoy WiFi, dining, and comfortable seating throughout your journey.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium tracking-tighter text-gray-900">
                  {searchParams.from} → {searchParams.to}
                </h2>
                <p className="text-sm text-gray-600">
                  {format(searchParams.departureDate, "EEEE, MMMM d")} • {searchResults.length} trains found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {searchResults.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-200 rounded-xl">
                            <Train className="h-5 w-5 text-gray-700" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{route.operator}</div>
                            <Badge className={cn("text-xs", getTypeColor(route.type))}>
                              {route.type.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {route.amenities.map((amenity, i) => (
                            <div key={i} className="p-1 bg-gray-100 rounded text-gray-600">
                              {getAmenityIcon(amenity)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">Departure</div>
                          <div className="font-medium text-gray-900">{route.departure.time}</div>
                          <div className="text-sm text-gray-600">{route.departure.station}</div>
                          {route.departure.platform && (
                            <div className="text-xs text-gray-500">Platform {route.departure.platform}</div>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="text-xs font-medium text-gray-700 mb-1">Duration</div>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <div className="font-medium text-gray-900">{route.duration}</div>
                            <div className="h-px bg-gray-300 flex-1"></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {route.stops === 0 ? "Direct" : `${route.stops} stops`}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-medium text-gray-700 mb-1">Arrival</div>
                          <div className="font-medium text-gray-900">{route.arrival.time}</div>
                          <div className="text-sm text-gray-600">{route.arrival.station}</div>
                          {route.arrival.platform && (
                            <div className="text-xs text-gray-500">Platform {route.arrival.platform}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-600">Economy</div>
                            <div className="font-medium text-gray-900">€{route.price.economy}</div>
                            <div className="text-xs text-gray-500">{route.availability.economy} left</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600">Business</div>
                            <div className="font-medium text-gray-900">€{route.price.business}</div>
                            <div className="text-xs text-gray-500">{route.availability.business} left</div>
                          </div>
                          {route.price.first && (
                            <div className="text-center">
                              <div className="text-xs text-gray-600">First</div>
                              <div className="font-medium text-gray-900">€{route.price.first}</div>
                              <div className="text-xs text-gray-500">{route.availability.first} left</div>
                            </div>
                          )}
                        </div>
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white">Select</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
