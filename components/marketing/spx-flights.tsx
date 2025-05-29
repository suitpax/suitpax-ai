"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Clock, MapPin, Calendar, Users, Wifi, Coffee, Star, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

const airlines = [
  {
    code: "AA",
    name: "American Airlines",
    logo: "🇺🇸",
    color: "bg-red-500",
    rating: 4.2,
  },
  {
    code: "DL",
    name: "Delta Air Lines",
    logo: "🔺",
    color: "bg-blue-500",
    rating: 4.5,
  },
  {
    code: "UA",
    name: "United Airlines",
    logo: "🌐",
    color: "bg-blue-600",
    rating: 4.1,
  },
  {
    code: "LH",
    name: "Lufthansa",
    logo: "🇩🇪",
    color: "bg-yellow-500",
    rating: 4.3,
  },
  {
    code: "BA",
    name: "British Airways",
    logo: "🇬🇧",
    color: "bg-blue-700",
    rating: 4.4,
  },
  {
    code: "AF",
    name: "Air France",
    logo: "🇫🇷",
    color: "bg-blue-400",
    rating: 4.2,
  },
]

const flightBookings = [
  {
    id: 1,
    route: "NYC → LON",
    airline: "British Airways",
    flight: "BA 178",
    departure: "14:30",
    arrival: "02:15+1",
    duration: "7h 45m",
    class: "Business",
    price: "$3,247",
    status: "confirmed",
    passenger: "Sarah Chen",
    date: "Dec 15, 2024",
  },
  {
    id: 2,
    route: "SFO → FRA",
    airline: "Lufthansa",
    flight: "LH 441",
    departure: "16:20",
    arrival: "12:05+1",
    duration: "11h 45m",
    class: "Economy Plus",
    price: "$1,892",
    status: "pending",
    passenger: "Michael Torres",
    date: "Dec 18, 2024",
  },
  {
    id: 3,
    route: "LAX → CDG",
    airline: "Air France",
    flight: "AF 66",
    departure: "23:15",
    arrival: "18:25+1",
    duration: "10h 10m",
    class: "Premium Economy",
    price: "$2,156",
    status: "confirmed",
    passenger: "Emma Rodriguez",
    date: "Dec 20, 2024",
  },
]

export default function SPXFlights() {
  const [currentBooking, setCurrentBooking] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentBooking((prev) => (prev + 1) % flightBookings.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const booking = flightBookings[currentBooking]

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <Badge className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
              Next-Generation TMS
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
              Reimagining flight booking
              <br />
              <span className="text-gray-500">with AI intelligence</span>
            </h2>

            <p className="text-lg text-gray-600 font-light mb-8 leading-relaxed">
              Uncover and activate high-intent flight options across 500+ airlines. Transform complex travel booking
              into seamless automated workflows that delight your team.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-light">Real-time price comparison across 500+ airlines</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-light">Automated policy compliance checking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-light">Instant booking confirmations and updates</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 py-3 font-medium" size="lg">
                Try booking AI
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-3 font-medium"
                size="lg"
              >
                Watch demo
              </Button>
            </div>
          </div>

          {/* Right Content - Flight Booking Interface */}
          <div className="relative">
            {/* Airlines Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {airlines.map((airline, index) => (
                <motion.div
                  key={airline.code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{airline.logo}</div>
                    <div className="text-xs font-medium text-gray-900 mb-1">{airline.code}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{airline.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Booking Card */}
            <motion.div
              key={currentBooking}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0.7 : 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{booking.airline}</div>
                    <div className="text-sm text-gray-600">{booking.flight}</div>
                  </div>
                </div>
                <Badge
                  className={`${
                    booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                  } rounded-xl px-2.5 py-0.5 text-[10px] font-medium`}
                >
                  {booking.status}
                </Badge>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900 mb-1">{booking.departure}</div>
                  <div className="text-sm text-gray-600">{booking.route.split(" → ")[0]}</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-16 h-px bg-gray-300"></div>
                    <Plane className="h-4 w-4 text-gray-400" />
                    <div className="w-16 h-px bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900 mb-1">{booking.arrival}</div>
                  <div className="text-sm text-gray-600">{booking.route.split(" → ")[1]}</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.class}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.passenger}</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-medium text-gray-900">{booking.price}</div>
                  <div className="text-sm text-gray-600">per person</div>
                </div>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-4 py-2 font-medium"
                  size="sm"
                >
                  {booking.status === "confirmed" ? "View Details" : "Approve Booking"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Amenities */}
            <div className="flex justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200">
                <Wifi className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-600">WiFi</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200">
                <Coffee className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-600">Meals</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200">
                <Users className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-gray-600">Lounge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
