"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  PiUserCircleBold,
  PiClockBold,
  PiMapPinBold,
  PiSuitcaseRollingBold,
  PiIdentificationBadgeBold,
  PiCurrencyDollarBold,
  PiLightningBold,
} from "react-icons/pi"
import Image from "next/image"

// Datos de vuelos reales con códigos IATA y aerolíneas
const flightBookings = [
  {
    id: 1,
    flightNumber: "AA456",
    departure: {
      code: "LHR",
      city: "London",
      time: "08:45",
      date: "May 12, 2025",
      terminal: "T5",
      gate: "A22",
    },
    arrival: {
      code: "JFK",
      city: "New York",
      time: "11:35",
      date: "May 12, 2025",
      terminal: "T4",
      gate: "B12",
    },
    duration: "7h 50m",
    passenger: "Emma Thompson",
    status: "Confirmed",
    class: "Business",
    seat: "12A",
    bookingRef: "XYZABC",
    agent: {
      name: "Maya",
      role: "Business Travel Specialist",
      image: "/agents/agent-1.png",
      recommendation: "Booked based on your meeting schedule and preferred airline",
    },
    airline: {
      name: "American Airlines",
      logo: "https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    amenities: ["Wi-Fi", "Power Outlets", "Premium Meal", "Priority Boarding"],
    price: "$1,450",
    savings: "$320",
  },
  {
    id: 2,
    flightNumber: "KL1234",
    departure: {
      code: "AMS",
      city: "Amsterdam",
      time: "14:20",
      date: "June 3, 2025",
      terminal: "T1",
      gate: "C45",
    },
    arrival: {
      code: "SFO",
      city: "San Francisco",
      time: "17:05",
      date: "June 3, 2025",
      terminal: "Int",
      gate: "G8",
    },
    duration: "11h 45m",
    passenger: "Michael Chen",
    status: "Confirmed",
    class: "First",
    seat: "2F",
    bookingRef: "KL7890",
    agent: {
      name: "Marcus",
      role: "Corporate Travel Manager",
      image: "/agents/agent-6.png",
      recommendation: "Selected optimal flight time based on your sleep preferences",
    },
    airline: {
      name: "KLM Royal Dutch Airlines",
      logo: "https://cdn.brandfetch.io/klm.com/w/512/h/69/logo?c=1idU-l8vdm7C5__3dci",
    },
    amenities: ["Lie-flat Seat", "Lounge Access", "Chauffeur Service", "Premium Wi-Fi"],
    price: "$3,200",
    savings: "$750",
  },
  {
    id: 3,
    flightNumber: "JL203",
    departure: {
      code: "NRT",
      city: "Tokyo",
      time: "02:30",
      date: "July 18, 2025",
      terminal: "T3",
      gate: "D10",
    },
    arrival: {
      code: "SYD",
      city: "Sydney",
      time: "22:15",
      date: "July 18, 2025",
      terminal: "T1",
      gate: "A7",
    },
    duration: "9h 45m",
    passenger: "Sarah Johnson",
    status: "Confirmed",
    class: "Economy",
    seat: "34K",
    bookingRef: "JL4567",
    agent: {
      name: "Olivia",
      role: "Premium Membership Advisor",
      image: "/agents/agent-5.png",
      recommendation: "Added fast-track security and lounge access for your layover",
    },
    airline: {
      name: "Japan Airlines",
      logo: "https://cdn.brandfetch.io/jal.com/w/512/h/49/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    amenities: ["Extra Legroom", "Priority Boarding", "Meal Selection", "Lounge Access"],
    price: "$980",
    savings: "$145",
  },
  {
    id: 4,
    flightNumber: "QR321",
    departure: {
      code: "DOH",
      city: "Doha",
      time: "23:45",
      date: "August 5, 2025",
      terminal: "T2",
      gate: "E15",
    },
    arrival: {
      code: "MEL",
      city: "Melbourne",
      time: "07:30",
      date: "August 6, 2025",
      terminal: "T3",
      gate: "C22",
    },
    duration: "14h 45m",
    passenger: "David Kim",
    status: "Confirmed",
    class: "Premium Economy",
    seat: "23C",
    bookingRef: "QR9876",
    agent: {
      name: "Emma",
      role: "Expense Management Expert",
      image: "/agents/agent-4.png",
      recommendation: "Automatically categorized as client meeting expense",
    },
    airline: {
      name: "Qatar Airways",
      logo: "https://cdn.brandfetch.io/qatarairways.com/w/512/h/144/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    amenities: ["Premium Meal", "Noise-cancelling Headphones", "Amenity Kit", "Priority Check-in"],
    price: "$1,850",
    savings: "$420",
  },
]

// Logos adicionales de aerolíneas para mostrar en la sección de partners
const additionalAirlineLogos = [
  {
    name: "British Airways",
    logo: "https://cdn.brandfetch.io/britishairways.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "SAS Scandinavian Airlines",
    logo: "https://cdn.brandfetch.io/flysas.com/w/512/h/180/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Southwest Airlines",
    logo: "https://cdn.brandfetch.io/southwest.com/w/512/h/78/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Iberia",
    logo: "https://cdn.brandfetch.io/iberia.com/w/512/h/114/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Air Canada",
    logo: "https://cdn.brandfetch.io/aircanada.com/w/512/h/67/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "JetBlue",
    logo: "https://cdn.brandfetch.io/jetblue.com/w/512/h/169/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
]

export const FlightBookingShowcase = () => {
  const [currentBooking, setCurrentBooking] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAmenities, setShowAmenities] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentBooking((prev) => (prev + 1) % flightBookings.length)
        setIsAnimating(false)
        setShowAmenities(false)
      }, 500)
    }, 8000)

    // Alternar entre mostrar detalles y amenities
    const amenitiesInterval = setInterval(() => {
      setShowAmenities((prev) => !prev)
    }, 4000)

    return () => {
      clearInterval(interval)
      clearInterval(amenitiesInterval)
    }
  }, [])

  const booking = flightBookings[currentBooking]

  // Combinar los logos de las aerolíneas de las reservas con los logos adicionales
  const allAirlineLogos = [
    ...flightBookings.map((booking) => ({
      name: booking.airline.name,
      logo: booking.airline.logo,
    })),
    ...additionalAirlineLogos,
  ]

  // Eliminar duplicados si los hubiera
  const uniqueAirlineLogos = allAirlineLogos.filter(
    (logo, index, self) => index === self.findIndex((l) => l.logo === logo.logo),
  )

  return (
    <section className="pt-24 pb-12 relative w-full overflow-hidden bg-gradient-to-b from-black via-black/95 to-emerald-950/40">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">
              Global Flight Network
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none max-w-4xl">
            Connecting you with the world's premier airlines
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-white/70 max-w-2xl mb-12">
            Our powerful booking system integrates directly with the most prestigious carriers worldwide, ensuring you
            always have access to the best routes, exclusive rates, and premium services.
          </p>

          <div className="relative max-w-md mx-auto mb-16 w-full">
            <div className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-xl">
              {/* Flight booking card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-black/60 rounded-lg border border-white/10 overflow-hidden"
                >
                  {/* Header with airline logo */}
                  <div className="bg-black/80 p-3 flex justify-between items-center border-b border-white/10">
                    <div className="h-6 relative flex-1 flex items-center justify-start">
                      <Image
                        src={booking.airline.logo || "/placeholder.svg"}
                        alt={booking.airline.name}
                        width={80}
                        height={24}
                        className="h-5 w-auto object-contain invert brightness-0 filter"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/70">{booking.flightNumber}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Flight details */}
                  <div className="p-5">
                    {/* Status badge */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <PiIdentificationBadgeBold className="h-3.5 w-3.5 text-white/60" />
                        <span className="text-[10px] text-white/70">Ref: {booking.bookingRef}</span>
                      </div>
                      <div className="px-2.5 py-0.25 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center h-4">
                        <span className="text-[8px] font-medium text-emerald-400 tracking-wider uppercase">
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Flight route */}
                    <div className="flex items-center justify-between mb-5">
                      {/* Departure */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{booking.departure.code}</div>
                        <div className="text-[10px] text-white/60">{booking.departure.city}</div>
                      </div>

                      {/* Flight path visualization - Ajustado según las instrucciones */}
                      <div className="flex-1 flex flex-col items-center justify-center px-3 relative py-2">
                        {/* Tiempo de trayecto - más pequeño y más separado */}
                        <div className="mb-3">
                          <span className="text-[10px] text-white/80 font-medium bg-black/70 px-2 py-0.5 rounded-full border border-white/10 shadow-sm">
                            {booking.duration}
                          </span>
                        </div>

                        {/* Barra de progreso - más fina y con easeInOut */}
                        <motion.div className="relative w-full h-[0.3px] rounded-full overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 h-[0.3px] rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
                          />
                        </motion.div>
                      </div>

                      {/* Arrival */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{booking.arrival.code}</div>
                        <div className="text-[10px] text-white/60">{booking.arrival.city}</div>
                      </div>
                    </div>

                    {/* Time details */}
                    <div className="flex justify-between text-xs mb-5">
                      <div>
                        <div className="font-medium text-white">{booking.departure.time}</div>
                        <div className="text-[10px] text-white/60">{booking.departure.date}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <PiMapPinBold className="h-3 w-3 text-white/40" />
                          <span className="text-[9px] text-white/50">
                            Terminal {booking.departure.terminal}, Gate {booking.departure.gate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{booking.arrival.time}</div>
                        <div className="text-[10px] text-white/60">{booking.arrival.date}</div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <PiMapPinBold className="h-3 w-3 text-white/40" />
                          <span className="text-[9px] text-white/50">
                            Terminal {booking.arrival.terminal}, Gate {booking.arrival.gate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Passenger and seat info / Amenities (toggled) */}
                    <AnimatePresence mode="wait">
                      {!showAmenities ? (
                        <motion.div
                          key="passenger-info"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="flex justify-between items-center text-xs border-t border-white/10 pt-4 mb-4"
                        >
                          <div>
                            <div className="flex items-center gap-1">
                              <PiUserCircleBold className="h-3 w-3 text-white/40" />
                              <span className="text-[10px] text-white/60">Passenger</span>
                            </div>
                            <div className="font-medium text-white">{booking.passenger}</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <PiSuitcaseRollingBold className="h-3 w-3 text-white/40" />
                              <span className="text-[10px] text-white/60">Class</span>
                            </div>
                            <div className="font-medium text-white">{booking.class}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <PiClockBold className="h-3 w-3 text-white/40" />
                              <span className="text-[10px] text-white/60">Seat</span>
                            </div>
                            <div className="font-medium text-white">{booking.seat}</div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="amenities-info"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/10 pt-4 mb-4"
                        >
                          <div className="flex items-center gap-1 mb-2">
                            <PiLightningBold className="h-3 w-3 text-emerald-400" />
                            <span className="text-[10px] text-white/80 font-medium">Flight Amenities</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {booking.amenities.map((amenity, index) => (
                              <div
                                key={index}
                                className="bg-white/5 rounded-full px-2 py-0.5 text-[9px] text-white/80 border border-white/10"
                              >
                                {amenity}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-1">
                              <PiCurrencyDollarBold className="h-3 w-3 text-emerald-400" />
                              <span className="text-[10px] text-white/60">Price</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/60">Savings</span>
                              <span className="text-[10px] font-medium text-emerald-400">{booking.savings}</span>
                            </div>
                            <div className="font-medium text-white text-sm">{booking.price}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Agent recommendation */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
                          <Image
                            src={booking.agent.image || "/placeholder.svg"}
                            alt={booking.agent.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-medium text-white">{booking.agent.name}</span>
                            <span className="text-[9px] text-white/60">{booking.agent.role}</span>
                          </div>
                          <p className="text-[10px] text-white/80 mt-1 text-left">{booking.agent.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Booking indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {flightBookings.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBooking(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      currentBooking === index ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Airline partners logos - Ahora incluye los nuevos logos */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-3xl mx-auto">
            {uniqueAirlineLogos.map((airline, index) => (
              <div key={index} className="h-6 relative">
                <Image
                  src={airline.logo || "/placeholder.svg"}
                  alt={airline.name}
                  width={80}
                  height={24}
                  className="h-4 w-auto object-contain invert brightness-0 filter opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-black/60 border border-white/20 text-white text-xs font-medium rounded-xl shadow-sm backdrop-blur-sm hover:bg-black/70 transition-colors">
              +50 airlines API connected
            </div>
          </div>

          <p className="mt-8 text-xs text-white/60 max-w-lg">
            Suitpax maintains direct partnerships with over 350 airlines worldwide, ensuring seamless booking
            experiences and exclusive corporate rates.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FlightBookingShowcase
