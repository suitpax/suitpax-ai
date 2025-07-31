"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  UsersIcon,
  AirplaneIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline"
import { PiSparkle } from "react-icons/pi"

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
    departDate: "",
    returnDate: "",
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
            <div className="inline-flex items-center rounded-xl bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/30">
              <AirplaneIcon className="w-3 h-3 mr-1" />
              Business Travel
            </div>
            <div className="inline-flex items-center rounded-xl bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/30">
              <PiSparkle className="w-3 h-3 mr-1" />
              AI-Powered
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-xl font-light opacity-90 max-w-2xl">
            <em className="font-serif italic">
              Search and book flights with our AI-powered platform. Get the best deals for your business travel.
            </em>
          </p>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-medium tracking-tighter mb-6">
          <em className="font-serif italic">Search Flights</em>
        </h3>

        <div className="space-y-6">
          {/* Trip Type */}
          <div className="flex space-x-4">
            <button
              onClick={() => setSearchData({ ...searchData, tripType: "roundtrip" })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                searchData.tripType === "roundtrip"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Round Trip
            </button>
            <button
              onClick={() => setSearchData({ ...searchData, tripType: "oneway" })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                searchData.tripType === "oneway" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              One Way
            </button>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">From</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="New York (JFK)"
                  value={searchData.from}
                  onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">To</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Los Angeles (LAX)"
                  value={searchData.to}
                  onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Departure Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={searchData.departDate}
                  onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>
            </div>

            {searchData.tripType === "roundtrip" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Return Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Passengers</label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={searchData.passengers}
                  onChange={(e) => setSearchData({ ...searchData, passengers: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                value={searchData.class}
                onChange={(e) => setSearchData({ ...searchData, class: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-tight flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching Flights...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                Search Flights
              </>
            )}
          </button>
        </div>
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
                <div
                  key={i}
                  className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : flights.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium tracking-tighter">
                  <em className="font-serif italic">Available Flights</em>
                </h2>
              </div>

              <div className="space-y-4">
                {flights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <AirplaneIcon className="h-6 w-6 text-gray-600" />
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
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                              <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                            <p className="text-sm font-medium">{flight.duration}</p>
                            <p className="text-xs text-gray-500">
                              {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
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
                        <button className="px-6 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight">
                          Book Flight
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <AirplaneIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">No flights found</h3>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Try adjusting your search criteria to find more options.</em>
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!searched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm p-16 rounded-2xl border border-gray-200 shadow-sm text-center"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-2">Ready to find your next flight?</h3>
          <p className="text-gray-600 font-light max-w-md mx-auto">
            <em className="font-serif italic">
              Use our advanced search to find the perfect flights for your business travel needs.
            </em>
          </p>
        </motion.div>
      )}
    </div>
  )
}
