"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Search, Globe, Building, Plane, Star, Navigation, Heart, Plus, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const financialCities = [
  {
    id: 1,
    name: "New York City",
    country: "United States",
    region: "North America",
    description: "Global financial capital with Wall Street and major banks",
    image: "/nyc-financial-district.png",
    businessHotels: 847,
    avgFlightCost: 450,
    timeZone: "EST",
    businessRating: 4.8,
    tags: ["Finance", "Banking", "Trading"],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    description: "Leading European financial hub with the City of London",
    image: "/placeholder-q64is.png",
    businessHotels: 623,
    avgFlightCost: 680,
    timeZone: "GMT",
    businessRating: 4.7,
    tags: ["Banking", "Insurance", "Fintech"],
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    id: 3,
    name: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    description: "Asia's premier financial center and trading hub",
    image: "/singapore-marina-bay-financial-district.png",
    businessHotels: 412,
    avgFlightCost: 890,
    timeZone: "SGT",
    businessRating: 4.9,
    tags: ["Trading", "Wealth Management", "Fintech"],
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    id: 4,
    name: "Hong Kong",
    country: "Hong Kong SAR",
    region: "Asia Pacific",
    description: "Gateway to China and major Asian financial center",
    image: "/placeholder-ncqec.png",
    businessHotels: 389,
    avgFlightCost: 820,
    timeZone: "HKT",
    businessRating: 4.6,
    tags: ["Banking", "Trading", "Investment"],
    coordinates: { lat: 22.3193, lng: 114.1694 },
  },
  {
    id: 5,
    name: "Tokyo",
    country: "Japan",
    region: "Asia Pacific",
    description: "Japan's financial capital with major stock exchanges",
    image: "/placeholder-5ssdo.png",
    businessHotels: 567,
    avgFlightCost: 750,
    timeZone: "JST",
    businessRating: 4.5,
    tags: ["Banking", "Insurance", "Technology"],
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    id: 6,
    name: "Frankfurt",
    country: "Germany",
    region: "Europe",
    description: "European Central Bank headquarters and financial hub",
    image: "/frankfurt-financial-skyline.png",
    businessHotels: 298,
    avgFlightCost: 520,
    timeZone: "CET",
    businessRating: 4.4,
    tags: ["Central Banking", "Euro Trading", "Insurance"],
    coordinates: { lat: 50.1109, lng: 8.6821 },
  },
]

const savedLocations = [
  {
    id: 1,
    name: "The Plaza Hotel",
    type: "Hotel",
    city: "New York City",
    address: "768 5th Ave, New York, NY 10019",
    rating: 4.8,
    lastVisited: "2024-01-15",
    notes: "Preferred corporate rate available",
  },
  {
    id: 2,
    name: "Canary Wharf",
    type: "Business District",
    city: "London",
    address: "Canary Wharf, London E14",
    rating: 4.6,
    lastVisited: "2023-12-08",
    notes: "Multiple client offices in this area",
  },
]

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("explore")

  const filteredCities = financialCities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || city.region.toLowerCase().includes(selectedRegion.toLowerCase())
    return matchesSearch && matchesRegion
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2 text-gray-900">
              Business Locations
            </h1>
            <p className="text-gray-600 font-light">
              <em className="font-serif italic">
                Discover and manage global financial centers and business destinations
              </em>
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cities, countries, or business districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRegion === "all" ? "default" : "outline"}
                onClick={() => setSelectedRegion("all")}
                className="rounded-xl"
              >
                All Regions
              </Button>
              <Button
                variant={selectedRegion === "north america" ? "default" : "outline"}
                onClick={() => setSelectedRegion("north america")}
                className="rounded-xl"
              >
                Americas
              </Button>
              <Button
                variant={selectedRegion === "europe" ? "default" : "outline"}
                onClick={() => setSelectedRegion("europe")}
                className="rounded-xl"
              >
                Europe
              </Button>
              <Button
                variant={selectedRegion === "asia" ? "default" : "outline"}
                onClick={() => setSelectedRegion("asia")}
                className="rounded-xl"
              >
                Asia Pacific
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="explore" className="rounded-lg">
              Explore Cities
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-lg">
              Saved Locations
            </TabsTrigger>
            <TabsTrigger value="maps" className="rounded-lg">
              Interactive Maps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6 mt-6">
            {/* Financial Cities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCities.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div className="relative">
                      <img
                        src={city.image || "/placeholder.svg"}
                        alt={city.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm rounded-lg">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-blue-600 text-white rounded-lg">
                          <Star className="h-3 w-3 mr-1" />
                          {city.businessRating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight text-gray-900">{city.name}</h3>
                          <p className="text-sm text-gray-600">{city.country}</p>
                        </div>
                        <Badge variant="outline" className="text-xs rounded-lg">
                          {city.region}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{city.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600">{city.businessHotels} hotels</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600">${city.avgFlightCost} avg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600">{city.timeZone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600">Business Hub</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {city.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs rounded-lg">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                          <Navigation className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg bg-transparent">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {savedLocations.length > 0 ? (
                savedLocations.map((location) => (
                  <Card
                    key={location.id}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold tracking-tight text-gray-900">{location.name}</h3>
                            <Badge variant="outline" className="text-xs rounded-lg">
                              {location.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                          <p className="text-sm text-gray-600 mb-3">{location.city}</p>
                          <p className="text-xs text-gray-500 italic">{location.notes}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{location.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">Last visited: {location.lastVisited}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved locations yet</h3>
                  <p className="text-gray-600 mb-6">Save your favorite business destinations for quick access</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Location
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="maps" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">Interactive Maps</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Explore business locations with Google Maps and Atlas integration. Search for offices, hotels, and
                  meeting venues worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Search className="h-4 w-4 mr-2" />
                    Search Google Maps
                  </Button>
                  <Button variant="outline" className="rounded-xl border-gray-300 bg-transparent">
                    <Globe className="h-4 w-4 mr-2" />
                    Open Atlas View
                  </Button>
                </div>
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Coming Soon:</strong> Full Google Maps integration with:
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Real-time business location search</li>
                    <li>• Corporate hotel and venue recommendations</li>
                    <li>• Travel time and route optimization</li>
                    <li>• Integration with your saved locations</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
