"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiMapPinFill,
  PiStarFill,
  PiWifiFill,
  PiSwimmingPoolFill,
  PiCarFill,
  PiCoffeeFill,
  PiCheckCircleFill,
  PiSparkle,
  PiBuildingOfficeFill,
} from "react-icons/pi"

const cities = [
  {
    id: "nyc",
    name: "New York",
    country: "USA",
    image: "/images/urban-life-in-motion-new.png",
    hotels: 847,
    avgPrice: 320,
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    image: "/images/nighttime-airport-scene.jpeg",
    hotels: 623,
    avgPrice: 280,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "/images/future-city.png",
    hotels: 512,
    avgPrice: 250,
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "/images/stylish-traveler-awaiting.jpeg",
    hotels: 445,
    avgPrice: 290,
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    image: "/images/airport-vip-lounge.jpeg",
    hotels: 298,
    avgPrice: 220,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    image: "/images/hilton-san-francisco.png",
    hotels: 356,
    avgPrice: 350,
  },
]

const sampleHotels = [
  {
    id: 1,
    name: "The Peninsula New York",
    rating: 4.8,
    price: 485,
    originalPrice: 620,
    image: "/images/hilton-san-francisco.png",
    amenities: ["wifi", "pool", "parking", "coffee"],
    status: "available",
    badges: ["AI Pick", "Business"],
    location: "Midtown Manhattan",
    distance: "0.3 miles from Central Park",
  },
  {
    id: 2,
    name: "Hilton Manhattan East",
    rating: 4.6,
    price: 320,
    originalPrice: 380,
    image: "/images/vip-lounge-1.png",
    amenities: ["wifi", "coffee", "parking"],
    status: "limited",
    badges: ["Business Friendly"],
    location: "Murray Hill",
    distance: "0.5 miles from Grand Central",
  },
  {
    id: 3,
    name: "The Standard High Line",
    rating: 4.7,
    price: 395,
    originalPrice: 450,
    image: "/images/vip-lounge-2.png",
    amenities: ["wifi", "pool", "coffee"],
    status: "available",
    badges: ["Trendy", "AI Pick"],
    location: "Meatpacking District",
    distance: "0.2 miles from High Line Park",
  },
]

const searchSteps = [
  "Analyzing your travel preferences...",
  "Scanning 847 hotels in New York...",
  "Checking corporate policies...",
  "Optimizing for location & amenities...",
  "Found 3 perfect matches!",
]

const amenityIcons = {
  wifi: PiWifiFill,
  pool: PiSwimmingPoolFill,
  parking: PiCarFill,
  coffee: PiCoffeeFill,
}

const statusColors = {
  available: "text-green-600",
  limited: "text-orange-600",
  soldout: "text-red-600",
}

const statusLabels = {
  available: "Available",
  limited: "Limited",
  soldout: "Sold Out",
}

export default function AIHotelBooking() {
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStep, setSearchStep] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleCitySelect = (city: (typeof cities)[0]) => {
    setSelectedCity(city)
    setShowResults(false)
  }

  const handleSearch = async () => {
    setIsSearching(true)
    setShowResults(false)
    setSearchStep(0)

    for (let i = 0; i < searchSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setSearchStep(i)
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSearching(false)
    setShowResults(true)
  }

  return (
    <section className="pt-12 pb-6 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <PiSparkle className="h-3 w-3 mr-1" />
            AI-Powered Hotel Discovery
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none mb-6">
            Smart Hotel Booking
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Let our AI agents find the perfect hotels that match your business travel policies, preferences, and budget
            automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - City Selection */}
          <div className="lg:col-span-3">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
              <h3 className="text-lg font-medium tracking-tighter text-black mb-4">Select Destination</h3>
              <div className="space-y-3">
                {cities.map((city) => (
                  <motion.button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full p-3 rounded-xl border transition-all text-left ${
                      selectedCity.id === city.id
                        ? "bg-gray-50 border-gray-300 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={city.image || "/placeholder.svg"}
                        alt={city.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{city.name}</h4>
                        <p className="text-xs text-gray-500 font-light">{city.country}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600 font-medium">{city.hotels} hotels</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600 font-medium">${city.avgPrice}/night</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full mt-6 bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Find Hotels with AI"}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              {/* Selected City Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <Image
                  src={selectedCity.image || "/placeholder.svg"}
                  alt={selectedCity.name}
                  width={60}
                  height={60}
                  className="rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-2xl font-medium tracking-tighter text-black">
                    {selectedCity.name}, {selectedCity.country}
                  </h3>
                  <p className="text-gray-600 font-light">
                    {selectedCity.hotels} hotels available • Average ${selectedCity.avgPrice}/night
                  </p>
                </div>
              </div>

              {/* Search Progress */}
              <AnimatePresence mode="wait">
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <PiSparkle className="w-8 h-8 text-gray-600" />
                      </motion.div>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2 tracking-tighter">AI Agent Working</h4>
                    <p className="text-gray-600 font-light mb-6">{searchSteps[searchStep]}</p>
                    <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-black h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((searchStep + 1) / searchSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Search Results */}
                {showResults && !isSearching && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-medium tracking-tighter text-black">AI Recommendations</h4>
                      <div className="flex items-center gap-2">
                        <PiCheckCircleFill className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Policy Compliant</span>
                      </div>
                    </div>

                    {sampleHotels.map((hotel, index) => (
                      <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                      >
                        <div className="flex gap-4">
                          <Image
                            src={hotel.image || "/placeholder.svg"}
                            alt={hotel.name}
                            width={120}
                            height={90}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-medium text-gray-900 tracking-tighter">{hotel.name}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    <PiStarFill className="w-3 h-3 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">{hotel.rating}</span>
                                  </div>
                                  <span className="text-sm text-gray-400">•</span>
                                  <span className="text-sm text-gray-600 font-light">{hotel.location}</span>
                                </div>
                                <p className="text-xs text-gray-500 font-light mt-1">
                                  <PiMapPinFill className="w-3 h-3 inline mr-1" />
                                  {hotel.distance}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg font-medium text-gray-900">${hotel.price}</span>
                                  <span className="text-sm text-gray-500 line-through font-light">
                                    ${hotel.originalPrice}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 font-light">per night</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {hotel.amenities.map((amenity) => {
                                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                                    return <Icon key={amenity} className="w-4 h-4 text-gray-400" title={amenity} />
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  {hotel.badges.map((badge) => (
                                    <span
                                      key={badge}
                                      className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium ${
                                        badge === "AI Pick" ? "bg-emerald-950 text-white" : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {badge === "AI Pick" && <PiSparkle className="w-2.5 h-2.5 mr-1" />}
                                      {badge === "Business" && <PiBuildingOfficeFill className="w-2.5 h-2.5 mr-1" />}
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-xs font-medium ${
                                    statusColors[hotel.status as keyof typeof statusColors]
                                  }`}
                                >
                                  {statusLabels[hotel.status as keyof typeof statusLabels]}
                                </span>
                                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Default State */}
                {!isSearching && !showResults && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <PiBuildingOfficeFill className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2 tracking-tighter">Ready to Find Hotels</h4>
                    <p className="text-gray-600 font-light mb-6">
                      Select a destination and let our AI find the perfect hotels for your business trip
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                      {["Policy Check", "Price Compare", "Location Score", "Amenity Match"].map((feature) => (
                        <div key={feature} className="text-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <PiCheckCircleFill className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-xs text-gray-600 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-medium tracking-tighter text-black">2.3M+</div>
            <div className="text-sm text-gray-600 font-light">Hotels Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium tracking-tighter text-black">98%</div>
            <div className="text-sm text-gray-600 font-light">Policy Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium tracking-tighter text-black">$247</div>
            <div className="text-sm text-gray-600 font-light">Avg. Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium tracking-tighter text-black">4.8★</div>
            <div className="text-sm text-gray-600 font-light">Avg. Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
