"use client"

import { motion } from "framer-motion"
import { PiSparkle, PiAirplane, PiClock, PiBrain, PiShield, PiLightning, PiGlobe } from "react-icons/pi"

const airlines = [
  "American Airlines",
  "Delta Air Lines",
  "United Airlines",
  "Southwest Airlines",
  "JetBlue Airways",
  "Alaska Airlines",
  "Spirit Airlines",
  "Frontier Airlines",
  "Hawaiian Airlines",
  "Allegiant Air",
  "British Airways",
  "Lufthansa",
  "Air France",
  "Emirates",
  "Qatar Airways",
]

const capabilities = [
  {
    icon: PiAirplane,
    title: "Real-time Booking",
    description: "Direct airline API integration for instant flight booking and seat selection with live pricing.",
  },
  {
    icon: PiClock,
    title: "Smart Rebooking",
    description: "Automatic rebooking during disruptions with policy compliance checks and alternative routing.",
  },
  {
    icon: PiBrain,
    title: "Contextual Intelligence",
    description: "AI understands your preferences, budget constraints, travel patterns, and corporate policies.",
  },
  {
    icon: PiShield,
    title: "Policy Compliance",
    description: "Automatic validation against company travel policies with real-time approval workflows.",
  },
  {
    icon: PiLightning,
    title: "Instant Processing",
    description: "Sub-second response times for flight searches, bookings, and modifications across all airlines.",
  },
  {
    icon: PiGlobe,
    title: "Global Coverage",
    description: "Access to 500+ airlines worldwide with unified booking experience and local payment methods.",
  },
]

const stats = [
  { value: "500+", label: "Airlines Connected" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "<1s", label: "Response Time" },
  { value: "24/7", label: "AI Availability" },
]

export default function MCPFlightsAIAgents() {
  return (
    <section className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            <PiSparkle className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">MCP Enhanced</em>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none mb-4">
            AI Agents with <em className="font-serif italic text-emerald-950">Flight Superpowers</em>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mx-auto">
            Our MCP-enhanced AI agents connect directly with airline systems, providing real-time booking, instant
            rebooking, and contextual travel intelligence across 500+ airlines worldwide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Airlines Slider */}
        <div className="relative overflow-hidden mb-12">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
            className="flex space-x-6 whitespace-nowrap"
          >
            {[...airlines, ...airlines].map((airline, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-black">{airline}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-950 transition-colors">
                <capability.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter text-black mb-2">{capability.title}</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed">{capability.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Integration Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-sm"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium tracking-tighter text-black mb-2">
              <em className="font-serif italic">Seamless Integration</em>
            </h3>
            <p className="text-sm font-medium text-gray-500">Connect with your existing tools and workflows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PiSparkle className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-medium text-black mb-2">AI-First Approach</h4>
              <p className="text-sm text-gray-600">Natural language processing for intuitive travel requests</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PiLightning className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-medium text-black mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Sub-second response times for all flight operations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PiShield className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-medium text-black mb-2">Enterprise Ready</h4>
              <p className="text-sm text-gray-600">Bank-grade security with SOC 2 Type II compliance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
