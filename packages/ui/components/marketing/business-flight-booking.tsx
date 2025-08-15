"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  PiAirplaneTakeoff,
  PiAirplaneLanding,
  PiCalendarCheck,
  PiUsers,
  PiArrowRight,
  PiPlus,
  PiDotsThreeOutlineVertical,
  PiMagnifyingGlass,
  PiFunnelSimple,
  PiSortAscending,
} from "react-icons/pi"
import { SiAmericanairlines, SiDelta, SiUnitedairlines, SiLufthansa, SiQatarairways, SiEmirates } from "react-icons/si"
import { SiExpensify } from "react-icons/si"

// Datos de usuarios para los badges
const users = [
  { id: 1, name: "Alex Chen", role: "CEO", avatar: "/community/jordan-burgess.webp" },
  { id: 2, name: "Sarah Kim", role: "CFO", avatar: "/community/brianna-ware.webp" },
  { id: 3, name: "Michael Lee", role: "CTO", avatar: "/community/byron-robertson.webp" },
  { id: 4, name: "Jessica Wang", role: "COO", avatar: "/community/bec-ferguson.webp" },
]

// Datos de agentes AI para los badges
const aiAgents = [
  { id: 1, name: "Luna", avatar: "/agents/agent-50.png" },
  { id: 2, name: "Kahn", avatar: "/agents/agent-51.png" },
  { id: 3, name: "Winter", avatar: "/agents/agent-52.png" },
]

// Datos de aerolíneas
const airlines = [
  { id: 1, name: "American Airlines", icon: <SiAmericanairlines className="w-4 h-4" /> },
  { id: 2, name: "Delta", icon: <SiDelta className="w-4 h-4" /> },
  { id: 3, name: "United Airlines", icon: <SiUnitedairlines className="w-4 h-4" /> },
  { id: 4, name: "Lufthansa", icon: <SiLufthansa className="w-4 h-4" /> },
  { id: 5, name: "Qatar Airways", icon: <SiQatarairways className="w-4 h-4" /> },
  { id: 6, name: "Emirates", icon: <SiEmirates className="w-4 h-4" /> },
]

// Datos de vuelos de ejemplo
const flightExamples = [
  {
    id: 1,
    origin: "SFO",
    destination: "JFK",
    departureDate: "May 15, 2025",
    returnDate: "May 20, 2025",
    airline: "American Airlines",
    airlineIcon: <SiAmericanairlines className="w-3.5 h-3.5" />,
    price: "$1,250",
    traveler: users[0],
    agent: aiAgents[0],
    status: "Confirmed",
    priority: "High",
    team: "Executive",
  },
  {
    id: 2,
    origin: "LAX",
    destination: "LHR",
    departureDate: "June 3, 2025",
    returnDate: "June 10, 2025",
    airline: "British Airways",
    airlineIcon: <SiLufthansa className="w-3.5 h-3.5" />,
    price: "$2,780",
    traveler: users[1],
    agent: aiAgents[1],
    status: "Pending Approval",
    priority: "Medium",
    team: "Finance",
  },
  {
    id: 3,
    origin: "SEA",
    destination: "NRT",
    departureDate: "July 8, 2025",
    returnDate: "July 15, 2025",
    airline: "ANA",
    airlineIcon: <SiUnitedairlines className="w-3.5 h-3.5" />,
    price: "$3,450",
    traveler: users[2],
    agent: aiAgents[2],
    status: "Searching Options",
    priority: "Low",
    team: "Engineering",
  },
  {
    id: 4,
    origin: "BOS",
    destination: "CDG",
    departureDate: "August 12, 2025",
    returnDate: "August 19, 2025",
    airline: "Air France",
    airlineIcon: <SiDelta className="w-3.5 h-3.5" />,
    price: "$2,100",
    traveler: users[3],
    agent: aiAgents[0],
    status: "Confirmed",
    priority: "Medium",
    team: "Operations",
  },
]

// Componente principal
export default function BusinessFlightBooking() {
  const [activeView, setActiveView] = useState("upcoming")

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              Suitpax Business Travel
            </span>
            <span className="inline-flex items-center bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              AI-Powered Booking
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none">
            Team Travel Management
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-600 max-w-2xl mb-6">
            Streamline your company's travel with our AI-powered booking platform
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header con navegación */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex space-x-4">
              <button
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeView === "upcoming" ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActiveView("upcoming")}
              >
                Upcoming Trips
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeView === "book" ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActiveView("book")}
              >
                Book New Trip
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeView === "policy" ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActiveView("policy")}
              >
                Travel Policy
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md">
                <PiMagnifyingGlass className="w-5 h-5" />
              </button>
              <button className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md">
                <PiFunnelSimple className="w-5 h-5" />
              </button>
              <button className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md">
                <PiSortAscending className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-4">
            {activeView === "upcoming" && (
              <div className="space-y-4">
                {/* Barra de búsqueda y filtros */}
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search trips..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <PiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-black text-white rounded-md">
                      <PiPlus className="w-4 h-4 mr-1" />
                      New Trip
                    </button>
                  </div>
                </div>

                {/* Encabezados de tabla */}
                <div className="grid grid-cols-12 gap-4 py-2 px-4 bg-gray-50 text-xs font-medium text-gray-500 rounded-md">
                  <div className="col-span-3">Trip Details</div>
                  <div className="col-span-2">Dates</div>
                  <div className="col-span-2">Traveler</div>
                  <div className="col-span-2">Team</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Filas de viajes */}
                {flightExamples.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: flight.id * 0.1 }}
                    className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    {/* Trip Details */}
                    <div className="col-span-3 flex items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{flight.origin}</span>
                          <PiArrowRight className="mx-1 text-gray-400" />
                          <span className="font-medium text-sm">{flight.destination}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            {flight.airlineIcon}
                            <span className="ml-1">{flight.airline}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="col-span-2 flex flex-col justify-center">
                      <div className="text-xs">
                        <span className="text-gray-500">Depart: </span>
                        <span className="font-medium">{flight.departureDate}</span>
                      </div>
                      <div className="text-xs mt-1">
                        <span className="text-gray-500">Return: </span>
                        <span className="font-medium">{flight.returnDate}</span>
                      </div>
                    </div>

                    {/* Traveler */}
                    <div className="col-span-2 flex items-center">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <Image
                          src={flight.traveler.avatar || "/placeholder.svg"}
                          alt={flight.traveler.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{flight.traveler.name}</span>
                        <span className="text-xs text-gray-500">{flight.traveler.role}</span>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{flight.team}</span>
                        <div className="flex items-center mt-1">
                          <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                            <Image
                              src={flight.agent.avatar || "/placeholder.svg"}
                              alt={flight.agent.name}
                              width={16}
                              height={16}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-500">AI: {flight.agent.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-medium">{flight.price}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-md ${
                          flight.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : flight.status === "Pending Approval"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {flight.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <PiDotsThreeOutlineVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeView === "book" && (
              <div className="p-4">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-medium mb-6">Book a New Business Trip</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PiAirplaneTakeoff className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                          placeholder="City or airport"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PiAirplaneLanding className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                          placeholder="City or airport"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PiCalendarCheck className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                          placeholder="Select date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PiCalendarCheck className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                          placeholder="Select date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PiUsers className="h-5 w-5 text-gray-400" />
                        </div>
                        <select className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm">
                          <option>1 Traveler</option>
                          <option>2 Travelers</option>
                          <option>3 Travelers</option>
                          <option>4+ Travelers</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                    <select className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm">
                      <option>Executive</option>
                      <option>Finance</option>
                      <option>Engineering</option>
                      <option>Operations</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                        <Image
                          src={aiAgents[0].avatar || "/placeholder.svg"}
                          alt={aiAgents[0].avatar}
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      Luna will help you book
                    </span>
                    <span className="inline-flex items-center bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      <SiDelta className="w-3 h-3 mr-1" />
                      Delta preferred
                    </span>
                    <span className="inline-flex items-center bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      <SiUnitedairlines className="w-3 h-3 mr-1" />
                      United status
                    </span>
                    <span className="inline-flex items-center bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                      Within policy
                    </span>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      Save Draft
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/90 transition-colors">
                      Search Flights
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === "policy" && (
              <div className="p-4">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-medium mb-6">Company Travel Policy</h3>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium mb-3">Flight Booking Guidelines</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Economy class for domestic flights under 5 hours</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Premium Economy or Business class for international flights over 5 hours</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Bookings should be made at least 14 days in advance when possible</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>All travel must be approved by department head before booking</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium mb-3">Preferred Airlines</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {airlines.map((airline) => (
                          <div
                            key={airline.id}
                            className="flex items-center p-2 bg-white rounded-md border border-gray-100"
                          >
                            <div className="mr-2 text-gray-600">{airline.icon}</div>
                            <span className="text-sm">{airline.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium mb-3">Approval Process</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        All business travel requires approval from your department head. Trips exceeding $3,000 require
                        additional approval from the CFO.
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                          AI-assisted compliance
                        </span>
                        <span className="inline-flex items-center bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                            <Image
                              src={aiAgents[2].avatar || "/placeholder.svg"}
                              alt={aiAgents[2].avatar}
                              width={16}
                              height={16}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          Winter monitors policy
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium mb-3">Expense Reporting</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        All travel expenses must be submitted within 7 days of trip completion with appropriate
                        receipts. Suitpax integrates with your expense management system for automatic reconciliation.
                      </p>
                      <div className="flex items-center">
                        <SiExpensify className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm">Automatic sync with Expensify</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer con logos de aerolíneas */}
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-3 text-center">Integrated with major airlines worldwide</p>
            <div className="flex flex-wrap justify-center gap-6">
              {airlines.map((airline) => (
                <div key={airline.id} className="flex items-center">
                  <span className="text-gray-400 hover:text-gray-600 transition-colors">{airline.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
