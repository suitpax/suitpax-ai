"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Search,
  Globe,
  Building,
  Plane,
  Star,
  Navigation,
  Heart,
  Plus,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { businessCities } from "@/data/cities"
import Image from "next/image"

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

  const filteredCities = businessCities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || city.region.toLowerCase().includes(selectedRegion.toLowerCase())
    return matchesSearch && matchesRegion
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Updated to match dashboard style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-2 text-gray-900">
              Business Locations
            </h1>
            <p className="text-gray-600 font-light">
              Discover and manage global business destinations with AI-powered insights
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview - Added dashboard-style stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">GLOBAL</span>
            </div>
            <div className="text-2xl font-medium tracking-tighter text-gray-900 mb-1">{businessCities.length}</div>
            <div className="text-xs text-gray-500">Cities Available</div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">HOTELS</span>
            </div>
            <div className="text-2xl font-medium tracking-tighter text-gray-900 mb-1">2.4K+</div>
            <div className="text-xs text-gray-500">Business Hotels</div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">SAVED</span>
            </div>
            <div className="text-2xl font-medium tracking-tighter text-gray-900 mb-1">{savedLocations.length}</div>
            <div className="text-xs text-gray-500">Your Locations</div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">INSIGHTS</span>
            </div>
            <div className="text-2xl font-medium tracking-tighter text-gray-900 mb-1">AI</div>
            <div className="text-xs text-gray-500">Powered Analytics</div>
          </div>
        </motion.div>

        {/* Search and Filters - Updated styling to match dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cities, countries, or business districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl border-gray-200 bg-white/80"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRegion === "all" ? "default" : "outline"}
                onClick={() => setSelectedRegion("all")}
                className="rounded-2xl bg-gray-900 hover:bg-gray-800"
              >
                All Regions
              </Button>
              <Button
                variant={selectedRegion === "north america" ? "default" : "outline"}
                onClick={() => setSelectedRegion("north america")}
                className="rounded-2xl"
              >
                Americas
              </Button>
              <Button
                variant={selectedRegion === "europe" ? "default" : "outline"}
                onClick={() => setSelectedRegion("europe")}
                className="rounded-2xl"
              >
                Europe
              </Button>
              <Button
                variant={selectedRegion === "asia" ? "default" : "outline"}
                onClick={() => setSelectedRegion("asia")}
                className="rounded-2xl"
              >
                Asia Pacific
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs - Updated tab styling */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gray-100">
            <TabsTrigger value="explore" className="rounded-xl">
              Explore Cities
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-xl">
              Saved Locations
            </TabsTrigger>
            <TabsTrigger value="maps" className="rounded-xl">
              Global Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6 mt-6">
            {/* Cities Grid - Updated to use businessCities data and dashboard styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCities.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={city.imageUrl || "/placeholder.svg"}
                        alt={`${city.name}, ${city.country}`}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm rounded-xl border-gray-200"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-gray-900 text-white rounded-xl">
                          <Star className="h-3 w-3 mr-1" />
                          {city.businessImportance === "high" ? "4.8" : "4.5"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium tracking-tighter text-gray-900">{city.name}</h3>
                          <p className="text-sm text-gray-500 font-light">{city.country}</p>
                        </div>
                        <Badge variant="outline" className="text-xs rounded-xl border-gray-200">
                          {city.region}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-light">{city.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">250+ hotels</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">$650 avg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{city.timezone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Business Hub</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="secondary" className="text-xs rounded-xl bg-gray-100 text-gray-600">
                          Finance
                        </Badge>
                        <Badge variant="secondary" className="text-xs rounded-xl bg-gray-100 text-gray-600">
                          Business
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
                          <Navigation className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl border-gray-200 bg-transparent">
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
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              {savedLocations.length > 0 ? (
                savedLocations.map((location) => (
                  <Card
                    key={location.id}
                    className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium tracking-tighter text-gray-900">{location.name}</h3>
                            <Badge variant="outline" className="text-xs rounded-xl border-gray-200">
                              {location.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 font-light mb-1">{location.address}</p>
                          <p className="text-sm text-gray-500 font-light mb-3">{location.city}</p>
                          <p className="text-xs text-gray-400 italic">{location.notes}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{location.rating}</span>
                          </div>
                          <p className="text-xs text-gray-400">Last visited: {location.lastVisited}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved locations yet</h3>
                  <p className="text-gray-500 font-light mb-6">
                    Save your favorite business destinations for quick access
                  </p>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl">
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
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium tracking-tighter text-gray-900 mb-2">Global Business Map</h3>
                <p className="text-gray-500 font-light mb-6 max-w-md mx-auto">
                  Interactive world map showing all business locations with real-time data and AI-powered
                  recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl">
                    <Search className="h-4 w-4 mr-2" />
                    Launch Map View
                  </Button>
                  <Button variant="outline" className="rounded-2xl border-gray-200 bg-transparent">
                    <Globe className="h-4 w-4 mr-2" />
                    Satellite View
                  </Button>
                </div>
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Map Integration Features:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Real-time location data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Business venue recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Travel time optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Synchronized with saved locations</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
