"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  PiMapPinFill,
  PiStarFill,
  PiCalendarFill,
  PiUsersFill,
  PiSparklesFill,
  PiCheckCircleFill,
  PiClockFill,
  PiWifiFill,
  PiSwimmingPoolFill,
  PiCarFill,
  PiCoffeeFill,
} from "react-icons/pi"

interface Hotel {
  id: string
  name: string
  location: string
  city: string
  image: string
  rating: number
  price: number
  originalPrice?: number
  amenities: string[]
  distance: string
  availability: "available" | "limited" | "sold-out"
  aiRecommended?: boolean
  businessFriendly?: boolean
}

interface City {
  name: string
  country: string
  image: string
  hotels: number
  avgPrice: number
}

export default function AIHotelBooking() {
  const [selectedCity, setSelectedCity] = useState("New York")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Hotel[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  const cities: City[] = [
    {
      name: "New York",
      country: "USA",
      image: "/images/urban-life-in-motion-new.png",
      hotels: 847,
      avgPrice: 285,
    },
    {
      name: "London",
      country: "UK",
      image: "/images/nighttime-airport-scene.jpeg",
      hotels: 623,
      avgPrice: 195,
    },
    {
      name: "Tokyo",
      country: "Japan",
      image: "/images/future-city.png",
      hotels: 512,
      avgPrice: 165,
    },
    {
      name: "Paris",
      country: "France",
      image: "/images/stylish-traveler-awaiting.jpeg",
      hotels: 445,
      avgPrice: 225,
    },
    {
      name: "Dubai",
      country: "UAE",
      image: "/images/airport-vip-lounge.jpeg",
      hotels: 298,
      avgPrice: 315,
    },
    {
      name: "Singapore",
      country: "Singapore",
      image: "/images/traveler-in-motion-new.png",
      hotels: 187,
      avgPrice: 205,
    },
  ]

  const hotels: Hotel[] = [
    {
      id: "1",
      name: "The Peninsula New York",
      location: "Midtown Manhattan",
      city: "New York",
      image: "/images/hilton-san-francisco.png",
      rating: 4.8,
      price: 485,
      originalPrice: 620,
      amenities: ["WiFi", "Pool", "Parking", "Coffee"],
      distance: "0.3 mi from Times Square",
      availability: "available",
      aiRecommended: true,
      businessFriendly: true,
    },
    {
      id: "2",
      name: "Hilton Midtown",
      location: "Theater District",
      city: "New York",
      image: "/images/vip-lounge-1.png",
      rating: 4.6,
      price: 325,
      originalPrice: 425,
      amenities: ["WiFi", "Parking", "Coffee"],
      distance: "0.1 mi from Broadway",
      availability: "limited",
      aiRecommended: false,
      businessFriendly: true,
    },
    {
      id: "3",
      name: "The Standard High Line",
      location: "Meatpacking District",
      city: "New York",
      image: "/images/vip-lounge-2.png",
      rating: 4.7,
      price: 395,
      amenities: ["WiFi", "Pool", "Coffee"],
      distance: "0.5 mi from High Line Park",
      availability: "available",
      aiRecommended: true,
      businessFriendly: false,
    },
  ]

  const searchSteps = [
    "Analyzing your travel preferences...",
    "Scanning 847 hotels in New York...",
    "Applying business travel policies...",
    "Optimizing for location & amenities...",
    "Found 3 perfect matches!",
  ]

  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < searchSteps.length - 1) {
            return prev + 1
          } else {
            setIsSearching(false)
            setSearchResults(hotels.filter((hotel) => hotel.city === selectedCity))
            return prev
          }
        })
      }, 1200)

      return () => clearInterval(interval)
    }
  }, [isSearching, selectedCity])

  const handleSearch = () => {
    setIsSearching(true)
    setCurrentStep(0)
    setSearchResults([])
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <PiWifiFill className="h-3 w-3" />
      case "Pool":
        return <PiSwimmingPoolFill className="h-3 w-3" />
      case "Parking":
        return <PiCarFill className="h-3 w-3" />
      case "Coffee":
        return <PiCoffeeFill className="h-3 w-3" />
      default:
        return <PiCheckCircleFill className="h-3 w-3" />
    }
  }

  return (
    <section className="w-full py-20 md:py-28 bg-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              <PiSparklesFill className="h-3 w-3 mr-1" />
              AI Hotel Booking
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-emerald-950 mr-1"></span>
              Smart Reservations
            </span>
          </div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white leading-none max-w-4xl mx-auto mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Hotel Discovery
          </motion.h2>

          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto mb-12">
            Let our AI agents find the perfect accommodations for your business trips. Smart recommendations based on
            your preferences, company policies, and real-time availability.
          </p>

          <div className="max-w-6xl mx-auto w-full">
            <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="grid lg:grid-cols-3 h-full">
                {/* Left sidebar - Cities */}
                <div className="lg:col-span-1 bg-gray-50 border-r border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="bg-gray-200 rounded-full p-1.5">
                      <PiMapPinFill className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Popular Destinations</span>
                  </div>

                  <div className="space-y-3">
                    {cities.map((city) => (
                      <motion.div
                        key={city.name}
                        className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedCity === city.name
                            ? "ring-2 ring-gray-300 shadow-md"
                            : "hover:shadow-sm hover:scale-[1.02]"
                        }`}
                        onClick={() => setSelectedCity(city.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative h-20 w-full">
                          <Image
                            src={city.image || "/placeholder.svg"}
                            alt={city.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                          <div className="absolute inset-0 bg-black/40"></div>
                          <div className="absolute inset-0 p-3 flex flex-col justify-end">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white text-sm font-medium">{city.name}</p>
                                <p className="text-white/80 text-xs">{city.country}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white text-xs">{city.hotels} hotels</p>
                                <p className="text-white/80 text-xs">from ${city.avgPrice}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <PiSparklesFill className="h-4 w-4 text-emerald-950" />
                      <span className="text-sm font-medium text-gray-700">AI Insights</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Based on your travel history, {selectedCity} offers the best value for business travelers with an
                      average savings of 23% through our AI recommendations.
                    </p>
                  </div>
                </div>

                {/* Main content - Search & Results */}
                <div className="lg:col-span-2 flex flex-col h-full min-h-[600px]">
                  {/* Search Header */}
                  <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">Hotels in {selectedCity}</h3>
                        <p className="text-sm text-gray-600">AI-curated recommendations for your business trip</p>
                      </div>
                      <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <PiSparklesFill className="h-4 w-4" />
                            <span>Find Hotels</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <PiCalendarFill className="h-4 w-4" />
                        <span>Mar 15-18, 2024</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PiUsersFill className="h-4 w-4" />
                        <span>1 Guest</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PiClockFill className="h-4 w-4" />
                        <span>3 nights</span>
                      </div>
                    </div>
                  </div>

                  {/* Search Progress or Results */}
                  <div className="flex-1 p-6">
                    <AnimatePresence mode="wait">
                      {isSearching ? (
                        <motion.div
                          key="searching"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex flex-col items-center justify-center h-full text-center"
                        >
                          <div className="mb-8">
                            <div className="relative">
                              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PiSparklesFill className="h-6 w-6 text-black" />
                              </div>
                            </div>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Agent Working</h3>
                          <p className="text-sm text-gray-600 mb-6">{searchSteps[currentStep]}</p>
                          <div className="flex space-x-1">
                            {searchSteps.map((_, index) => (
                              <div
                                key={index}
                                className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                                  index <= currentStep ? "bg-black" : "bg-gray-200"
                                }`}
                              ></div>
                            ))}
                          </div>
                        </motion.div>
                      ) : searchResults.length > 0 ? (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          {searchResults.map((hotel, index) => (
                            <motion.div
                              key={hotel.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={hotel.image || "/placeholder.svg"}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="text-lg font-medium text-gray-900">{hotel.name}</h4>
                                        {hotel.aiRecommended && (
                                          <span className="inline-flex items-center rounded-xl bg-emerald-950 px-2 py-0.5 text-[8px] font-medium text-white">
                                            <PiSparklesFill className="h-2 w-2 mr-1" />
                                            AI Pick
                                          </span>
                                        )}
                                        {hotel.businessFriendly && (
                                          <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[8px] font-medium text-gray-700">
                                            Business
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600">{hotel.location}</p>
                                      <p className="text-xs text-gray-500">{hotel.distance}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center space-x-1 mb-1">
                                        <PiStarFill className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm font-medium text-gray-900">{hotel.rating}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        {hotel.originalPrice && (
                                          <span className="text-sm text-gray-500 line-through">
                                            ${hotel.originalPrice}
                                          </span>
                                        )}
                                        <span className="text-lg font-medium text-gray-900">${hotel.price}</span>
                                        <span className="text-sm text-gray-600">/night</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      {hotel.amenities.map((amenity) => (
                                        <div
                                          key={amenity}
                                          className="flex items-center space-x-1 text-xs text-gray-600"
                                        >
                                          {getAmenityIcon(amenity)}
                                          <span>{amenity}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span
                                        className={`inline-flex items-center rounded-xl px-2 py-0.5 text-[8px] font-medium ${
                                          hotel.availability === "available"
                                            ? "bg-green-100 text-green-700"
                                            : hotel.availability === "limited"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {hotel.availability === "available"
                                          ? "Available"
                                          : hotel.availability === "limited"
                                            ? "Few left"
                                            : "Sold out"}
                                      </span>
                                      <button className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-1.5 text-xs font-medium transition-colors">
                                        Book Now
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center h-full text-center"
                        >
                          <div className="mb-6">
                            <PiMapPinFill className="h-16 w-16 text-gray-300 mx-auto" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Find Hotels</h3>
                          <p className="text-sm text-gray-600 mb-6">
                            Click "Find Hotels" to let our AI agent discover the perfect accommodations for your trip to{" "}
                            {selectedCity}.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                            <div className="flex items-center space-x-2">
                              <PiCheckCircleFill className="h-4 w-4 text-green-500" />
                              <span>Policy compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <PiCheckCircleFill className="h-4 w-4 text-green-500" />
                              <span>Best rates guaranteed</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <PiCheckCircleFill className="h-4 w-4 text-green-500" />
                              <span>Business amenities</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <PiCheckCircleFill className="h-4 w-4 text-green-500" />
                              <span>Instant confirmation</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-950 mr-2"></div>
                  <span>Hotels Analyzed</span>
                </div>
                <span className="font-medium ml-2">2.3M+ Properties</span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-950 mr-2"></div>
                  <span>Average Savings</span>
                </div>
                <span className="font-medium ml-2">23% vs Direct</span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-950 mr-2"></div>
                  <span>Booking Speed</span>
                </div>
                <span className="font-medium ml-2">3x Faster</span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-950 mr-2"></div>
                  <span>Success Rate</span>
                </div>
                <span className="font-medium ml-2">99.7% Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
