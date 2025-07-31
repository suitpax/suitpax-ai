"use client"

import { motion } from "framer-motion"
import { PiSparkle } from "react-icons/pi"
import {
  PaperAirplaneIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"

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

const features = [
  {
    icon: PaperAirplaneIcon,
    title: "Real-time Booking",
    description:
      "Direct airline API integration for instant flight booking, seat selection, and upgrade management with live inventory updates.",
  },
  {
    icon: BoltIcon,
    title: "Smart Rebooking",
    description:
      "Automatic rebooking during disruptions with policy compliance checks, alternative route suggestions, and compensation tracking.",
  },
  {
    icon: GlobeAltIcon,
    title: "Contextual Intelligence",
    description:
      "AI understands your preferences, budget constraints, travel patterns, and corporate policies for personalized recommendations.",
  },
  {
    icon: ClockIcon,
    title: "24/7 Monitoring",
    description:
      "Continuous flight status monitoring with proactive notifications for delays, gate changes, and weather-related disruptions.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Policy Compliance",
    description:
      "Automated policy enforcement with approval workflows, budget tracking, and compliance reporting for corporate travel.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Cost Optimization",
    description:
      "Dynamic pricing analysis, fare prediction, and cost-saving recommendations based on historical data and market trends.",
  },
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-4">
            AI Agents with <em className="font-serif italic text-emerald-950">Flight Superpowers</em>
          </h2>
          <p className="text-xs font-medium text-gray-500 max-w-3xl mx-auto">
            Our MCP-enhanced AI agents connect directly with airline systems, providing real-time booking, instant
            rebooking, and contextual travel intelligence across 200+ airlines worldwide.
          </p>
        </div>

        {/* Airlines Slider */}
        <div className="relative overflow-hidden mb-12">
          <motion.div
            animate={{ x: [0, -2400] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            className="flex space-x-6 whitespace-nowrap"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter text-black mb-2">{feature.title}</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">200+</div>
              <div className="text-xs font-medium text-gray-500">Airlines Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">99.9%</div>
              <div className="text-xs font-medium text-gray-500">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">{"<"}3s</div>
              <div className="text-xs font-medium text-gray-500">Booking Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">24/7</div>
              <div className="text-xs font-medium text-gray-500">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
