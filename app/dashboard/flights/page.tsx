"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  FunnelIcon,
  StarIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface DuffelAirport {
  id: string
  name: string
  iata_code: string
  city_name: string
  country_name: string
}

interface DuffelOffer {
  id: string
  slices: Array<{
    segments: Array<{
      aircraft: { name: string }
      airline: { name: string; iata_code: string }
      flight_number: string
      origin: { city_name: string; iata_code: string; name: string }
      destination: { city_name: string; iata_code: string; name: string }
      departing_at: string
      arriving_at: string
      duration: string
    }>
    duration: string
  }>
  total_amount: string
  total_currency: string
  cabin_class: string
  owner: { name: string }
  conditions: {
    change_before_departure?: any
    refund_before_departure?: any
  }
}
// Popular airports for quick selection
const popularAirports = [
  { code: "JFK", name: "New York JFK", city: "New York" },
  { code: "LHR", name: "London Heathrow", city: "London" },
  { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris" },
  { code: "DXB", name: "Dubai International", city: "Dubai" },
  { code: "LAX", name: "Los Angeles", city: "Los Angeles" },
  { code: "SFO", name: "San Francisco", city: "San Francisco" },
  { code: "NRT", name: "Tokyo Narita", city: "Tokyo" },
  { code: "SIN", name: "Singapore Changi", city: "Singapore" },
  { code: "FRA", name: "Frankfurt", city: "Frankfurt" },
  { code: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam" },
]

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState({
    origin: "JFK",
    destination: "LHR", 
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "one_way"
  })
  
  const [offers, setOffers] = useState<DuffelOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)

const [searchResults, setSearchResults] = useState({
    origin: [] as DuffelAirport[],
    destination: [] as DuffelAirport[]
  })
  const [searchQuery, setSearchQuery] = useState({
    origin: "",
    destination: ""
  })
  const [filters, setFilters] = useState({
    maxPrice: 5000,
    airlines: [] as string[],
    maxStops: "any",
    departureTime: "any"
  })
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)

// Toast functionality
  const showToast = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message })
    setTimeout(() => setToastMessage(null), 5000)
  }

// Search airports function
  const searchAirports = async (query: string, type: 'origin' | 'destination') => {
    if (query.length < 2) {
      setSearchResults(prev => ({ ...prev, [type]: [] }))
      return
    }

    try {
      const response = await fetch(`/api/duffel/airports?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(prev => ({ ...prev, [type]: data.airports }))
      }
    } catch (error) {
      console.error('Airport search error:', error)
    }
  }

// Debounce airport search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.origin) searchAirports(searchQuery.origin, 'origin')
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery.origin])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.destination) searchAirports(searchQuery.destination, 'destination')
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery.destination])

const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      showToast('error', "Please fill in all required fields")
      return
    }

    if (searchParams.tripType === "round_trip" && !searchParams.returnDate) {
      showToast('error', "Please select a return date for round trip")
      return
    }

    setSearching(true)
    setOffers([])

    try {
      const searchData = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.tripType === "round_trip" ? searchParams.returnDate : undefined,
        passengers: searchParams.passengers,
        cabinClass: searchParams.cabinClass
      }

      const response = await fetch("/api/duffel/flight-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })

      const data = await response.json()

      if (data.success && data.offers) {
        setOffers(data.offers)
        showToast('success', `Found ${data.offers.length} flight options`)
      } else {
        showToast('error', data.error || "No flights found")
      }
    } catch (error) {
      console.error("Search error:", error)
      showToast('error', "Error searching flights. Please try again.")
    } finally {
      setSearching(false)
    }
  }

const handleBookFlight = async (offerId: string) => {
    if (!user) {
      showToast('error', "Please log in to book flights")
      return
    }

    setSelectedOffer(offerId)
    const offer = offers.find(o => o.id === offerId)
    
    if (!offer) return

    try {
      // Simulate booking process
      showToast('success', "Flight booking initiated! Processing...")
      
      setTimeout(() => {
        showToast('success', "Flight booked successfully!")
        setSelectedOffer(null)
      }, 3000)

    } catch (error) {
      console.error("Booking error:", error)
      showToast('error', "Error booking flight. Please try again.")
      setSelectedOffer(null)
    }
  }

const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }))
  }
const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return duration
    
    const hours = match[1] || "0"
    const minutes = match[2] || "0"
    
    if (hours === "0") return `${minutes}m`
    if (minutes === "0") return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const formatPrice = (amount: string, currency: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const getAirportOption = (code: string) => {
    return popularAirports.find(airport => airport.code === code) || 
           { code, name: code, city: code }
  }

return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toastMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {toastMessage.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5" />
            )}
            <span>{toastMessage.message}</span>
            <button onClick={() => setToastMessage(null)}>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

{/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Flights</h1>
          <p className="text-gray-600 font-light">Search and book business travel flights</p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="rounded-xl border-gray-200 hover:bg-gray-50"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </motion.div>
{/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {/* Trip Type */}
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="one_way"
                  checked={searchParams.tripType === "one_way"}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, tripType: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium">One way</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="round_trip"
                  checked={searchParams.tripType === "round_trip"}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, tripType: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Round trip</span>
              </label>
            </div>
{/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Origin */}
              <div className="relative">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">From</Label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select 
                    value={searchParams.origin} 
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, origin: value }))}
                  >
                    <SelectTrigger className="pl-10 rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {popularAirports.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          <div>
                            <div className="font-medium">{airport.city}</div>
                            <div className="text-sm text-gray-500">{airport.name} ({airport.code})</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-end pb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={swapLocations}
                  className="rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <ArrowsRightLeftIcon className="h-4 w-4" />
                </Button>
              </div>
{/* Destination */}
              <div className="relative">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">To</Label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select 
                    value={searchParams.destination} 
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, destination: value }))}
                  >
                    <SelectTrigger className="pl-10 rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {popularAirports.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          <div>
                            <div className="font-medium">{airport.city}</div>
                            <div className="text-sm text-gray-500">{airport.name} ({airport.code})</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Departure</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={searchParams.departureDate}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="pl-10 rounded-xl border-gray-200"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Return Date */}
              {searchParams.tripType === "round_trip" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Return</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      value={searchParams.returnDate}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                      className="pl-10 rounded-xl border-gray-200"
                      min={searchParams.departureDate}
                    />
                  </div>
                </div>
              )}
            </div>
{/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Passengers</Label>
                <Select 
                  value={searchParams.passengers.toString()} 
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, passengers: parseInt(value) }))}
                >
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Cabin Class</Label>
                <Select 
                  value={searchParams.cabinClass} 
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, cabinClass: value }))}
                >
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium_economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-xl"
                >
                  {searching ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  )}
                  {searching ? "Searching..." : "Search Flights"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

{/* Search Results */}
      {offers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tighter">Available Flights</h2>
            <Badge className="bg-gray-200 text-gray-700 border-gray-200">
              {offers.length} flight{offers.length !== 1 ? 's' : ''} found
            </Badge>
          </div>

          <div className="space-y-4">
            {offers.map((offer, index) => {
              const segment = offer.slices[0]?.segments[0]
              if (!segment) return null

              const departureTime = new Date(segment.departing_at)
              const arrivalTime = new Date(segment.arriving_at)
              
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

{/* Flight Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-2">
                            <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">{segment.airline.name}</span>
                            <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
                              {segment.flight_number}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-lg font-medium">
                                {departureTime.toLocaleTimeString('en-GB', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              <div className="text-sm text-gray-600">
                                {segment.origin.city_name} ({segment.origin.iata_code})
                              </div>
                              <div className="text-xs text-gray-500">
                                {segment.origin.name}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <ClockIcon className="h-4 w-4" />
                                <span>{formatDuration(segment.duration)}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
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