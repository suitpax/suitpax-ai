"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  PiMapPinBold,
  PiCalendarCheckBold,
  PiAirplaneTakeoffBold,
  PiCreditCardBold,
  PiUsersBold,
  PiClockBold,
} from "react-icons/pi"
import { SiBritishairways, SiLufthansa } from "react-icons/si"

// Títulos alternativos
const titleVariations = [
  "Team travel management simplified.",
  "Business travel for modern teams",
  "Seamless corporate travel coordination",
  "Effortless team travel planning",
]

// Subtítulos
const subtitles = [
  "Streamline your corporate travel with powerful tools",
  "Manage team travel, track expenses, and optimize your business trips",
  "Coordinate business travel for your entire organization",
]

const FlightTeams = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [activeTrip, setActiveTrip] = useState(0)

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])
  }, [])

  // Business travel examples
  const businessTrips = [
    {
      id: 1,
      title: "Marketing Team Summit",
      date: "June 10-15, 2025",
      location: "London, United Kingdom",
      airline: "British Airways",
      airlineIcon: <SiBritishairways className="w-full h-full" />,
      flightNumber: "BA212",
      participants: 8,
      totalCost: "$32,450",
      savings: "$4,800",
      status: "Confirmed",
      bookingRef: "MKT25062510",
      teamMembers: [
        { image: "/agents/agent-5.png", name: "Alex M." },
        { image: "/agents/agent-6.png", name: "Sarah J." },
        { image: "/agents/agent-7.png", name: "Michael P." },
      ],
      departureTime: "08:45",
      arrivalTime: "11:20",
      departureAirport: "SFO",
      arrivalAirport: "LHR",
    },
    {
      id: 2,
      title: "Product Development Workshop",
      date: "July 5-9, 2025",
      location: "Berlin, Germany",
      airline: "Lufthansa",
      airlineIcon: <SiLufthansa className="w-full h-full" />,
      flightNumber: "LH1829",
      participants: 6,
      totalCost: "$28,750",
      savings: "$3,200",
      status: "Pending",
      bookingRef: "PDW25070509",
      teamMembers: [
        { image: "/agents/agent-8.png", name: "David R." },
        { image: "/agents/agent-9.png", name: "Emma L." },
        { image: "/agents/agent-10.png", name: "James K." },
      ],
      departureTime: "15:30",
      arrivalTime: "10:45",
      departureAirport: "JFK",
      arrivalAirport: "TXL",
    },
  ]

  return (
    <section className="pt-12 pb-6 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              Team Travel Management
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Q3 2025
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-6">{randomSubtitle}</p>
        </div>

        {/* Trip selection tabs */}
        <div className="flex justify-center mb-4 space-x-2">
          {businessTrips.map((trip, index) => (
            <button
              key={trip.id}
              onClick={() => setActiveTrip(index)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                activeTrip === index
                  ? "bg-emerald-950/10 text-emerald-950 border border-emerald-950/30"
                  : "bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {trip.title}
            </button>
          ))}
        </div>

        {/* Trip details */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Flow effect background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-1 bg-gray-200/40 blur-xl"></div>
              <motion.div
                className="absolute top-0 left-0 w-full h-60 bg-gray-200/30"
                animate={{
                  y: [0, 100, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-full h-40 bg-gray-200/20"
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 18,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </div>

            <div className="relative z-10">
              {/* Trip header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-900">{businessTrips[activeTrip].title}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium ${
                        businessTrips[activeTrip].status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {businessTrips[activeTrip].status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-500 text-[10px]">
                    <PiCalendarCheckBold className="w-3 h-3" />
                    <span>{businessTrips[activeTrip].date}</span>
                    <span>•</span>
                    <PiMapPinBold className="w-3 h-3" />
                    <span>{businessTrips[activeTrip].location}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center gap-2">
                  <div className="bg-gray-100 rounded-full h-5 px-2 flex items-center text-[9px] text-gray-700">
                    <PiUsersBold className="w-2.5 h-2.5 mr-1" />
                    {businessTrips[activeTrip].participants}
                  </div>
                  <div className="bg-gray-100 rounded-full h-5 px-2 flex items-center text-[9px] text-gray-700">
                    <PiCreditCardBold className="w-2.5 h-2.5 mr-1" />
                    {businessTrips[activeTrip].totalCost}
                  </div>
                </div>
              </div>

              {/* Flight details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-xl border border-gray-200 p-2">
                  <h4 className="text-[10px] font-medium text-gray-700 mb-2">Flight Details</h4>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 w-5 relative bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-gray-700">{businessTrips[activeTrip].airlineIcon}</div>
                    </div>
                    <span className="text-[9px] text-gray-600">{businessTrips[activeTrip].airline}</span>
                    <span className="text-[9px] text-gray-600">{businessTrips[activeTrip].flightNumber}</span>
                    <span className="text-[9px] text-gray-600">Ref: {businessTrips[activeTrip].bookingRef}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-900">{businessTrips[activeTrip].departureTime}</div>
                      <div className="text-[9px] text-gray-500">{businessTrips[activeTrip].departureAirport}</div>
                    </div>

                    <div className="flex-1 mx-2 flex items-center">
                      <div className="h-[1px] flex-1 bg-gray-200"></div>
                      <div className="mx-1">
                        <PiAirplaneTakeoffBold className="w-2.5 h-2.5 text-gray-400" />
                      </div>
                      <div className="h-[1px] flex-1 bg-gray-200"></div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-900">{businessTrips[activeTrip].arrivalTime}</div>
                      <div className="text-[9px] text-gray-500">{businessTrips[activeTrip].arrivalAirport}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-2">
                  <h4 className="text-[10px] font-medium text-gray-700 mb-2">Team Members</h4>
                  <div className="space-y-1.5">
                    {businessTrips[activeTrip].teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="relative h-6 w-6 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                          <Image
                            src={`/community/${["jordan-burgess", "bec-ferguson", "scott-clayton"][idx]}.webp`}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-medium text-gray-700">{member.name}</p>
                          <p className="text-[8px] text-gray-500">
                            {["Marketing Lead", "Design Director", "Product Manager"][idx]}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center rounded-full w-1.5 h-1.5 bg-emerald-500"></span>
                            <span className="text-[8px] text-gray-500">Confirmed</span>
                          </div>
                          <span className="text-[7px] text-gray-400 mt-0.5">Seat {["12A", "12B", "12C"][idx]}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-1 flex items-center justify-center gap-1 text-[10px] text-white bg-gray-800 hover:bg-gray-700 transition-colors p-1 rounded-md">
                      <span>View all travelers</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline with airline slider */}
              <div className="bg-white rounded-xl border border-gray-200 p-2">
                <h4 className="text-[10px] font-medium text-gray-700 mb-2">Trip Timeline</h4>

                {/* Simple timeline without dots */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-start p-1.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[10px] font-medium text-gray-700">Departure</p>
                      <p className="text-[8px] text-gray-500">
                        {businessTrips[activeTrip].departureTime} • {businessTrips[activeTrip].departureAirport}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiClockBold className="w-2 h-2 text-gray-400" />
                      <span className="text-[8px] text-gray-500">June 10, 2025</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start p-1.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[10px] font-medium text-gray-700">Arrival</p>
                      <p className="text-[8px] text-gray-500">
                        {businessTrips[activeTrip].arrivalTime} • {businessTrips[activeTrip].arrivalAirport}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiClockBold className="w-2 h-2 text-gray-400" />
                      <span className="text-[8px] text-gray-500">June 10, 2025</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start p-1.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[10px] font-medium text-gray-700">Team Meeting</p>
                      <p className="text-[8px] text-gray-500">The Shard, London • Conference Room A</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiClockBold className="w-2 h-2 text-gray-400" />
                      <span className="text-[8px] text-gray-500">June 11, 2025 • 09:00</span>
                    </div>
                  </div>
                </div>

                {/* Airline links section */}
                <div className="mt-2">
                  <h4 className="text-[10px] font-medium text-gray-700 mb-1.5">Preferred Airlines</h4>
                  <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                    <div className="h-6 px-3 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-medium text-gray-700">British Airways</span>
                    </div>
                    <div className="h-6 px-3 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-medium text-gray-700">Lufthansa</span>
                    </div>
                    <div className="h-6 px-3 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-medium text-gray-700">Delta</span>
                    </div>
                    <div className="h-6 px-3 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-medium text-gray-700">Emirates</span>
                    </div>
                    <div className="h-6 px-3 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-medium text-gray-700">Qantas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming soon feature card */}
              <div className="mt-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-medium text-white">Función exclusiva</h4>
                      <p className="text-[8px] text-gray-300 mt-0.5">
                        Nuevas características de gestión de viajes disponibles muy pronto
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-full px-2 py-0.5">
                      <span className="text-[8px] text-white">Q3 2025</span>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent grid with tech-style selection */}
        <div className="max-w-2xl mx-auto mt-6 bg-gradient-to-b from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-1">AI Travel Assistants</h3>
            <p className="text-xs text-gray-500 mb-2">Powered by advanced AI technology</p>
            <button className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition-colors">
              Connect with an assistant
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 6, 7, 3].map((agentId, index) => (
              <motion.div
                key={agentId}
                className="flex flex-col items-center cursor-pointer relative group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative mb-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-sm"></div>
                  <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <Image
                      src={`/agents/agent-${agentId}.png`}
                      alt={`Agent ${agentId}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <h3 className="text-[9px] font-medium mb-0 text-center w-full text-gray-700">
                  {["Alex", "Emma", "Michael", "Sarah", "David"][index]}
                </h3>
                <p className="text-[7px] text-gray-500 text-center w-full">
                  {["Business", "Flights", "Hotels", "Support", "Concierge"][index]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlightTeams
