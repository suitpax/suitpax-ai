"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PaperAirplaneIcon, MagnifyingGlassIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const mockFlights = [
  {
    id: 1,
    airline: "Delta",
    flightNumber: "DL 123",
    departure: { city: "New York", code: "JFK", time: "08:30" },
    arrival: { city: "London", code: "LHR", time: "20:45" },
    date: "March 15, 2024",
    price: "$1,245",
    duration: "7h 15m",
    status: "On time",
  },
  {
    id: 2,
    airline: "American",
    flightNumber: "AA 456",
    departure: { city: "Los Angeles", code: "LAX", time: "14:20" },
    arrival: { city: "Tokyo", code: "NRT", time: "18:45+1" },
    date: "April 2, 2024",
    price: "$1,890",
    duration: "11h 25m",
    status: "Delayed 30min",
  },
]

export default function FlightsPage() {
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")
  const [searchDate, setSearchDate] = useState("")

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Flights</h1>
        <p className="text-gray-600 font-light">Search and manage your business flights</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Departure city"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Destination city"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search Flights
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Flight Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-medium tracking-tighter">Your Flights</h2>

        {mockFlights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <PaperAirplaneIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{flight.airline}</span>
                        <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                      </div>
                      <div className="text-sm text-gray-600">{flight.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{flight.departure.time}</div>
                      <div className="text-sm text-gray-500">{flight.departure.code}</div>
                      <div className="text-xs text-gray-400">{flight.departure.city}</div>
                    </div>

                    <div className="flex-1 text-center">
                      <div className="text-sm text-gray-500">{flight.duration}</div>
                      <div className="w-16 h-px bg-gray-300 mx-auto my-1"></div>
                      <div className="text-xs text-gray-400">Direct</div>
                    </div>

                    <div className="text-center">
                      <div className="font-medium text-gray-900">{flight.arrival.time}</div>
                      <div className="text-sm text-gray-500">{flight.arrival.code}</div>
                      <div className="text-xs text-gray-400">{flight.arrival.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-900">{flight.price}</div>
                      <div
                        className={`text-xs ${flight.status.includes("Delayed") ? "text-red-600" : "text-gray-600"}`}
                      >
                        {flight.status}
                      </div>
                    </div>
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
