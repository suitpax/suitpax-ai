"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plane,
  Sparkles,
  TrendingUp,
  Globe,
  Calendar,
  ArrowRight,
  Users,
  Filter,
  Zap,
  Shield,
  ArrowUpDown,
} from "lucide-react"
import { AirportSearch } from "@/components/flights/airport-search"
import { FlightCard } from "@/components/flights/flight-card"

// Mock flight data for demonstration
const mockFlights = [
  {
    id: "1",
    total_amount: "1250",
    total_currency: "USD",
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    slices: [
      {
        id: "slice1",
        origin: { iata_code: "JFK", name: "John F. Kennedy International", city_name: "New York" },
        destination: { iata_code: "LHR", name: "Heathrow Airport", city_name: "London" },
        duration: "PT7H30M",
        segments: [
          {
            id: "seg1",
            origin: { iata_code: "JFK", name: "John F. Kennedy International" },
            destination: { iata_code: "LHR", name: "Heathrow Airport" },
            departing_at: "2024-03-15T14:30:00Z",
            arriving_at: "2024-03-16T02:00:00Z",
            marketing_carrier: { iata_code: "BA", name: "British Airways" },
            flight_number: "117",
            aircraft: { name: "Boeing 777-300ER" },
            airline: { name: "British Airways", logo_symbol_url: null },
          },
        ],
      },
    ],
    passengers: [{ type: "adult" }],
  },
  {
    id: "2",
    total_amount: "980",
    total_currency: "USD",
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    slices: [
      {
        id: "slice2",
        origin: { iata_code: "JFK", name: "John F. Kennedy International", city_name: "New York" },
        destination: { iata_code: "LHR", name: "Heathrow Airport", city_name: "London" },
        duration: "PT9H15M",
        segments: [
          {
            id: "seg2a",
            origin: { iata_code: "JFK", name: "John F. Kennedy International" },
            destination: { iata_code: "DUB", name: "Dublin Airport" },
            departing_at: "2024-03-15T16:45:00Z",
            arriving_at: "2024-03-16T04:30:00Z",
            marketing_carrier: { iata_code: "EI", name: "Aer Lingus" },
            flight_number: "104",
            aircraft: { name: "Airbus A330-300" },
            airline: { name: "Aer Lingus", logo_symbol_url: null },
          },
          {
            id: "seg2b",
            origin: { iata_code: "DUB", name: "Dublin Airport" },
            destination: { iata_code: "LHR", name: "Heathrow Airport" },
            departing_at: "2024-03-16T06:15:00Z",
            arriving_at: "2024-03-16T07:30:00Z",
            marketing_carrier: { iata_code: "EI", name: "Aer Lingus" },
            flight_number: "158",
            aircraft: { name: "Airbus A320" },
            airline: { name: "Aer Lingus", logo_symbol_url: null },
          },
        ],
      },
    ],
    passengers: [{ type: "adult" }],
  },
]

export default function FlightsPage() {
  const [searchType, setSearchType] = useState("roundtrip")
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [flights, setFlights] = useState(mockFlights)
  const [sortBy, setSortBy] = useState("price")
  const [filterBy, setFilterBy] = useState("all")

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSearching(false)
    setShowResults(true)
  }

  const handleSelectFlight = (flightId: string) => {
    console.log("Selected flight:", flightId)
    // Handle flight selection
  }

  const stats = [
    { label: "Airlines", value: "500+", icon: Plane, color: "text-blue-600" },
    { label: "Routes", value: "10K+", icon: Globe, color: "text-green-600" },
    { label: "Avg Savings", value: "30%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Bookings", value: "50K+", icon: Users, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-black p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-gray-600/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-white/80">AI-Powered Business Travel</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-none mb-4">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Smart Business
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Flight Solutions
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed font-light">
              Revolutionize your corporate travel with AI-driven insights, real-time pricing, and seamless booking
              experiences.
              <span className="text-blue-400 font-medium"> Powered by advanced algorithms</span> that understand your
              business needs.
            </p>

            <div className="flex flex-wrap gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm text-white font-medium">
                    {stat.value} {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-green-100">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-lg font-medium tracking-tight">Real-Time Pricing</span>
              <Badge className="bg-green-500 text-white rounded-lg text-[10px] px-2 py-0.5">Live</Badge>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Updated every minute with the latest fares and availability from 500+ airlines worldwide
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-lg font-medium tracking-tight">Premium Routes</span>
              <Badge variant="outline" className="border-blue-200 text-blue-800 rounded-lg text-[10px] px-2 py-0.5">
                Enterprise
              </Badge>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Access to exclusive business class deals and corporate rates with preferred airline partners
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-purple-100">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-lg font-medium tracking-tight">AI Insights</span>
              <Badge className="bg-gray-200 text-gray-700 rounded-lg text-[10px] px-2 py-0.5">AI</Badge>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Smart recommendations based on your travel patterns, preferences, and company policies
            </p>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-medium tracking-tighter">Search Business Flights</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 animate-pulse rounded-lg text-xs px-3 py-1">
                    Live Pricing
                  </Badge>
                  <Badge className="bg-gray-200 text-gray-700 rounded-lg text-xs px-3 py-1">AI Powered</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-gray-100">
                  <TabsTrigger value="roundtrip" className="rounded-lg font-medium">
                    Round Trip
                  </TabsTrigger>
                  <TabsTrigger value="oneway" className="rounded-lg font-medium">
                    One Way
                  </TabsTrigger>
                  <TabsTrigger value="multicity" className="rounded-lg font-medium">
                    Multi-City
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={searchType} className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from" className="text-sm font-medium text-gray-700">
                        From
                      </Label>
                      <AirportSearch placeholder="Departure city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to" className="text-sm font-medium text-gray-700">
                        To
                      </Label>
                      <AirportSearch placeholder="Destination city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departure" className="text-sm font-medium text-gray-700">
                        Departure
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {searchType === "roundtrip" && (
                      <div className="space-y-2">
                        <Label htmlFor="return" className="text-sm font-medium text-gray-700">
                          Return
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Passengers</Label>
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                          <SelectItem value="4">4+ Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Class</Label>
                      <Select value={travelClass} onValueChange={setTravelClass}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900">
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
                    <div className="flex items-end">
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium tracking-tight transition-colors h-11"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search Flights
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium tracking-tighter text-gray-900">Flight Results</h2>
                <p className="text-gray-600 font-light">Found {flights.length} flights for your search</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 rounded-xl border-gray-200">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="departure">Departure Time</SelectItem>
                    <SelectItem value="arrival">Arrival Time</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-xl border-gray-200 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {flights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <FlightCard offer={flight} onSelect={handleSelectFlight} />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-6">
              <Button variant="outline" className="rounded-xl border-gray-200 px-8 bg-transparent">
                Load More Flights
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600 font-light">Support</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-sm text-gray-600 font-light">Uptime</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">2min</div>
              <div className="text-sm text-gray-600 font-light">Avg Search</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">4.9★</div>
              <div className="text-sm text-gray-600 font-light">Rating</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
