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
  Car,
  MapPin,
  CalendarIcon,
  Users,
  Fuel,
  Settings,
  Shield,
  Search,
  Filter,
  SortAsc,
  Star,
  Clock,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CarRental {
  id: string
  provider: string
  model: string
  category: "economy" | "compact" | "midsize" | "fullsize" | "luxury" | "suv"
  image: string
  rating: number
  reviews: number
  price: {
    daily: number
    total: number
  }
  features: string[]
  transmission: "automatic" | "manual"
  fuel: "petrol" | "diesel" | "electric" | "hybrid"
  seats: number
  doors: number
  luggage: number
  mileage: "unlimited" | number
  location: {
    pickup: string
    dropoff: string
  }
  availability: boolean
}

const mockCarRentals: CarRental[] = [
  {
    id: "1",
    provider: "Hertz",
    model: "Volkswagen Golf",
    category: "compact",
    image: "/silver-volkswagen-golf.png",
    rating: 4.5,
    reviews: 234,
    price: { daily: 45, total: 315 },
    features: ["gps", "bluetooth", "ac", "insurance"],
    transmission: "automatic",
    fuel: "petrol",
    seats: 5,
    doors: 4,
    luggage: 2,
    mileage: "unlimited",
    location: { pickup: "London Heathrow Airport", dropoff: "London Heathrow Airport" },
    availability: true,
  },
  {
    id: "2",
    provider: "Avis",
    model: "BMW 3 Series",
    category: "luxury",
    image: "/placeholder-h80zk.png",
    rating: 4.8,
    reviews: 156,
    price: { daily: 89, total: 623 },
    features: ["gps", "bluetooth", "ac", "insurance", "premium"],
    transmission: "automatic",
    fuel: "petrol",
    seats: 5,
    doors: 4,
    luggage: 3,
    mileage: "unlimited",
    location: { pickup: "London City Center", dropoff: "London City Center" },
    availability: true,
  },
  {
    id: "3",
    provider: "Enterprise",
    model: "Tesla Model 3",
    category: "luxury",
    image: "/white-tesla-model-3.png",
    rating: 4.9,
    reviews: 89,
    price: { daily: 95, total: 665 },
    features: ["gps", "bluetooth", "ac", "insurance", "electric", "autopilot"],
    transmission: "automatic",
    fuel: "electric",
    seats: 5,
    doors: 4,
    luggage: 2,
    mileage: "unlimited",
    location: { pickup: "London Gatwick Airport", dropoff: "London Gatwick Airport" },
    availability: true,
  },
]

const popularLocations = [
  { city: "London", country: "UK", cars: 245 },
  { city: "Paris", country: "France", cars: 189 },
  { city: "Berlin", country: "Germany", cars: 167 },
  { city: "Madrid", country: "Spain", cars: 134 },
  { city: "Rome", country: "Italy", cars: 156 },
  { city: "Amsterdam", country: "Netherlands", cars: 98 },
]

export default function RidePage() {
  const [searchParams, setSearchParams] = useState({
    pickup: "",
    dropoff: "",
    pickupDate: new Date(),
    dropoffDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
    pickupTime: "10:00",
    dropoffTime: "10:00",
    driverAge: "25-65",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<CarRental[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSearchResults(mockCarRentals)
    setIsSearching(false)
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "gps":
        return <MapPin className="h-4 w-4" />
      case "bluetooth":
        return <Settings className="h-4 w-4" />
      case "ac":
        return <Settings className="h-4 w-4" />
      case "insurance":
        return <Shield className="h-4 w-4" />
      case "electric":
        return <Fuel className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economy":
        return "bg-green-100 text-green-800"
      case "compact":
        return "bg-blue-100 text-blue-800"
      case "midsize":
        return "bg-purple-100 text-purple-800"
      case "fullsize":
        return "bg-orange-100 text-orange-800"
      case "luxury":
        return "bg-yellow-100 text-yellow-800"
      case "suv":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFuelIcon = (fuel: string) => {
    switch (fuel) {
      case "electric":
        return "⚡"
      case "hybrid":
        return "🔋"
      case "diesel":
        return "⛽"
      default:
        return "⛽"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-200 rounded-xl">
              <Car className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-gray-900">Car Rental</h1>
              <p className="text-sm text-gray-600">Rent cars from trusted providers worldwide</p>
            </div>
          </div>

          {/* Search Form */}
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Pick-up Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City, airport, or address"
                      value={searchParams.pickup}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, pickup: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Drop-off Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City, airport, or address"
                      value={searchParams.dropoff}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, dropoff: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Pick-up Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.pickupDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.pickupDate ? format(searchParams.pickupDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.pickupDate}
                        onSelect={(date) => date && setSearchParams((prev) => ({ ...prev, pickupDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Pick-up Time</label>
                  <Select
                    value={searchParams.pickupTime}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, pickupTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Drop-off Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.dropoffDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.dropoffDate ? format(searchParams.dropoffDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.dropoffDate}
                        onSelect={(date) => date && setSearchParams((prev) => ({ ...prev, dropoffDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Driver Age</label>
                  <Select
                    value={searchParams.driverAge}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, driverAge: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24 years</SelectItem>
                      <SelectItem value="25-65">25-65 years</SelectItem>
                      <SelectItem value="65+">65+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchParams.pickup || !searchParams.dropoff}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching cars...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search Cars
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
            {/* Popular Locations */}
            <div>
              <h2 className="text-xl font-medium tracking-tighter text-gray-900 mb-6">Popular Destinations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularLocations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{location.city}</div>
                            <div className="text-sm text-gray-600">{location.country}</div>
                          </div>
                          <div className="p-2 bg-gray-100 rounded-xl">
                            <Car className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{location.cars} cars available</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-medium tracking-tighter text-gray-900 mb-6">Why Choose Our Car Rental</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-2 bg-blue-100 rounded-xl w-fit mb-4">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Full Insurance</h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive coverage included with every rental for peace of mind.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-2 bg-green-100 rounded-xl w-fit mb-4">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">24/7 Support</h3>
                    <p className="text-sm text-gray-600">
                      Round-the-clock customer support for any assistance you need.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-2 bg-purple-100 rounded-xl w-fit mb-4">
                      <Fuel className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Flexible Options</h3>
                    <p className="text-sm text-gray-600">
                      Choose from economy to luxury vehicles with flexible rental periods.
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
                  {searchParams.pickup} → {searchParams.dropoff}
                </h2>
                <p className="text-sm text-gray-600">
                  {format(searchParams.pickupDate, "MMM d")} - {format(searchParams.dropoffDate, "MMM d")} •{" "}
                  {searchResults.length} cars found
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

            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="economy">Economy</TabsTrigger>
                <TabsTrigger value="compact">Compact</TabsTrigger>
                <TabsTrigger value="midsize">Midsize</TabsTrigger>
                <TabsTrigger value="fullsize">Fullsize</TabsTrigger>
                <TabsTrigger value="luxury">Luxury</TabsTrigger>
                <TabsTrigger value="suv">SUV</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Results */}
            <div className="space-y-4">
              {searchResults
                .filter((car) => selectedCategory === "all" || car.category === selectedCategory)
                .map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Car Image and Basic Info */}
                          <div className="lg:col-span-1">
                            <img
                              src={car.image || "/placeholder.svg"}
                              alt={car.model}
                              className="w-full h-32 object-cover rounded-xl mb-4"
                            />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={cn("text-xs", getCategoryColor(car.category))}>{car.category}</Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-gray-600">
                                    {car.rating} ({car.reviews})
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{car.model}</div>
                              <div className="text-xs text-gray-600">{car.provider}</div>
                            </div>
                          </div>

                          {/* Car Details */}
                          <div className="lg:col-span-2">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{car.seats} seats</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{car.transmission}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{getFuelIcon(car.fuel)}</span>
                                <span className="text-sm text-gray-600">{car.fuel}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">🧳</span>
                                <span className="text-sm text-gray-600">{car.luggage} bags</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {car.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                                  {getFeatureIcon(feature)}
                                  <span className="text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>

                            <div className="text-xs text-gray-600">
                              <div>Pick-up: {car.location.pickup}</div>
                              <div>Drop-off: {car.location.dropoff}</div>
                              <div>Mileage: {car.mileage === "unlimited" ? "Unlimited" : `${car.mileage} km`}</div>
                            </div>
                          </div>

                          {/* Pricing and Book */}
                          <div className="lg:col-span-1 flex flex-col justify-between">
                            <div className="text-right mb-4">
                              <div className="text-2xl font-medium text-gray-900">€{car.price.daily}</div>
                              <div className="text-xs text-gray-600">per day</div>
                              <div className="text-sm text-gray-600 mt-1">Total: €{car.price.total}</div>
                            </div>
                            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Book Now</Button>
                          </div>
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
