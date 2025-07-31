"use client"

import { motion } from "framer-motion"
import { PiSparkle } from "react-icons/pi"

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
]

export default function MCPFlightsAIAgents() {
  return (
    <section className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            <PiSparkle className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">MCP Enhanced</em>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black mb-4">
            AI Agents with <em className="font-serif italic text-emerald-950">Flight Superpowers</em>
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-3xl mx-auto">
            Our MCP-enhanced AI agents connect directly with airline systems, providing real-time booking, instant
            rebooking, and contextual travel intelligence.
          </p>
        </div>

        {/* Airlines Slider */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex space-x-8 whitespace-nowrap"
          >
            {[...airlines, ...airlines].map((airline, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm"
              >
                <span className="text-sm font-medium text-black">{airline}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4">
              <PiSparkle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Real-time Booking</h3>
            <p className="text-sm font-light text-gray-600">
              Direct airline API integration for instant flight booking and seat selection.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4">
              <PiSparkle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Smart Rebooking</h3>
            <p className="text-sm font-light text-gray-600">
              Automatic rebooking during disruptions with policy compliance checks.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4">
              <PiSparkle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Contextual Intelligence</h3>
            <p className="text-sm font-light text-gray-600">
              AI understands your preferences, budget constraints, and travel patterns.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
