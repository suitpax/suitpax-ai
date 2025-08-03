"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockFlights = [
  {
    id: 1,
    airline: "Delta Air Lines",
    flightNumber: "DL 123",
    departure: { city: "New York", code: "JFK", time: "08:30" },
    arrival: { city: "London", code: "LHR", time: "20:45" },
    duration: "7h 15m",
    price: "$1,245",
    stops: "Non-stop",
    date: "Mar 15, 2024",
  },
  {
    id: 2,
    airline: "American Airlines",
    flightNumber: "AA 456",
    departure: { city: "New York", code: "JFK", time: "14:20" },
    arrival: { city: "London", code: "LHR", time: "02:35+1" },
    duration: "7h 15m",
    price: "$1,189",
    stops: "Non-stop",
    date: "Mar 15, 2024",
  },
  {
    id: 3,
    airline: "United Airlines",
    flightNumber: "UA 789",
    departure: { city: "New York", code: "JFK", time: "22:10" },
    arrival: { city: "London", code: "LHR", time: "10:25+1" },
    duration: "7h 15m",
    price: "$1,356",
    stops: "Non-stop",
    date: "Mar 15, 2024",
  },
]

export default function FlightsPage() {
  const [searchFrom, setSearchFrom] = useState("New York (JFK)")
  const [searchTo, setSearchTo] = useState("London (LHR)")
  const [departDate, setDepartDate] = useState("2024-03-15")
  const [returnDate, setReturnDate] = useState("2024-03-22")
  const [tripType, setTripType] = useState("roundtrip")

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Flights</h1>
        <p className="text-gray-600 font-light">Search and book business travel flights</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Trip Type */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    value="roundtrip"
                    checked={tripType === "roundtrip"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Round trip</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    value="oneway"
                    checked={tripType === "oneway"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">One way</span>
                </label>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      className="pl-10"
                      placeholder="Departure city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      className="pl-10"
                      placeholder="Destination city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {tripType === "roundtrip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button className="w-full md:w-auto bg-black text-white hover:bg-gray-800">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Flights
              </Button>
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-tighter">Available Flights</h2>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">{mockFlights.length} flights found</Badge>
        </div>

        <div className="space-y-4">
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
                    {/* Flight Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{flight.airline}</span>
                        <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
                          {flight.flightNumber}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-lg font-medium">{flight.departure.time}</div>
                          <div className="text-sm text-gray-600">
                            {flight.departure.city} ({flight.departure.code})
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4" />
                            <span>{flight.duration}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{flight.stops}</div>
                        </div>

                        <div className="text-right md:text-left">
                          <div className="text-lg font-medium">{flight.arrival.time}</div>
                          <div className="text-sm text-gray-600">
                            {flight.arrival.city} ({flight.arrival.code})
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Book */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-2">
                      <div className="text-right">
                        <div className="flex items-center text-2xl font-medium">
                          <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                          {flight.price.replace("$", "")}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                      <Button className="bg-black text-white hover:bg-gray-800 px-6">Select Flight</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

{offer.slices[0].segments.length > 1 ? 
                                  `${offer.slices[0].segments.length - 1} stop${offer.slices[0].segments.length > 2 ? 's' : ''}` : 
                                  'Non-stop'
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                {segment.aircraft.name}
                              </div>
                            </div>

                            <div className="text-right md:text-left">
                              <div className="text-lg font-medium">
                                {arrivalTime.toLocaleTimeString('en-GB', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                                {arrivalTime.getDate() !== departureTime.getDate() && (
                                  <span className="text-xs text-red-500 ml-1">+1</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {segment.destination.city_name} ({segment.destination.iata_code})
                              </div>
                              <div className="text-xs text-gray-500">
                                {segment.destination.name}
                              </div>
                            </div>
                          </div>

                          {/* Flight Details */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {offer.cabin_class.replace('_', ' ')}
                            </Badge>
                            {offer.conditions?.refund_before_departure && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Refundable
                              </Badge>
                            )}
                            {offer.conditions?.change_before_departure && (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                Changeable
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                              {segment.airline.iata_code} {segment.flight_number}
                            </Badge>
                          </div>
                        </div>

                        {/* Price and Book */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                          <div className="text-right">
                            <div className="text-2xl font-medium tracking-tighter">
                              {formatPrice(offer.total_amount, offer.total_currency)}
                            </div>
                            <div className="text-xs text-gray-500">per person</div>
                            <div className="text-xs text-gray-500 capitalize mt-1">
                              {offer.cabin_class.replace('_', ' ')} class
                            </div>
                            
                            {/* Savings indicator */}
                            {index === 0 && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                Best price
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Button 
                              onClick={() => handleBookFlight(offer.id)}
                              disabled={selectedOffer === offer.id}
                              className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 min-w-[120px]"
                            >
                              {selectedOffer === offer.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Select Flight"
                              )}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-xs rounded-xl border-gray-200 hover:bg-gray-50"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Aircraft:</span>
                            <div>{segment.aircraft.name}</div>
                          </div>
                          <div>
                            <span className="font-medium">Operated by:</span>
                            <div>{segment.airline.name}</div>
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>
                            <div>{formatDuration(segment.duration)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Distance:</span>
                            <div>~{Math.round(Math.random() * 3000 + 1000)} km</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!searching && offers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PaperAirplaneIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">Ready to find your next flight?</h3>
          <p className="text-gray-600 max-w-md mx-auto font-light">
            Search for flights using our real-time booking system powered by Duffel's global inventory.
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {searching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">Searching flights...</h3>
          <p className="text-gray-600 font-light mb-4">
            We're searching hundreds of airlines for the best deals
          </p>
        </motion.div>
      )}
    </div>
  )
}
