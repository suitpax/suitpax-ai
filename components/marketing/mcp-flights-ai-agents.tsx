"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiSparkle } from "react-icons/pi"

const agents = [
  { name: "Luna", avatar: "/agents/agent-luna-new.png" },
  { name: "Kahn", avatar: "/agents/kahn-avatar.png" },
  { name: "Winter", avatar: "/agents/agent-52.png" },
  { name: "Sophia", avatar: "/agents/agent-17.png" },
]

const airlines = [
  {
    name: "American Airlines",
    logo: "/placeholder.svg?height=40&width=120&text=American+Airlines",
  },
  {
    name: "KLM",
    logo: "/placeholder.svg?height=40&width=120&text=KLM",
  },
  {
    name: "Japan Airlines",
    logo: "/placeholder.svg?height=40&width=120&text=JAL",
  },
  {
    name: "Qatar Airways",
    logo: "/placeholder.svg?height=40&width=120&text=Qatar+Airways",
  },
  {
    name: "British Airways",
    logo: "/placeholder.svg?height=40&width=120&text=British+Airways",
  },
  {
    name: "Southwest",
    logo: "/placeholder.svg?height=40&width=120&text=Southwest",
  },
  {
    name: "Iberia",
    logo: "/placeholder.svg?height=40&width=120&text=Iberia",
  },
  {
    name: "Air Canada",
    logo: "/placeholder.svg?height=40&width=120&text=Air+Canada",
  },
  {
    name: "Emirates",
    logo: "/placeholder.svg?height=40&width=120&text=Emirates",
  },
]

const duplicatedAirlines = [...airlines, ...airlines]

export default function MCPFlightsAIAgents() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6"
          >
            <PiSparkle className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">MCP-Powered Flights</em>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6"
          >
            <em className="font-serif italic">Search flights with your</em>
            <br />
            <span className="text-gray-600">Personal AI Agent</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg font-light text-gray-600 max-w-3xl mx-auto mb-6"
          >
            Our AI agents, powered by the Model Context Protocol, understand your travel preferences and company
            policies to find the perfect flight options for you and your team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div className="text-center">
              <div className="text-2xl font-medium tracking-tighter text-black mb-1">500+</div>
              <div className="text-xs font-medium text-gray-600">Airlines Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium tracking-tighter text-black mb-1">30%</div>
              <div className="text-xs font-medium text-gray-600">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium tracking-tighter text-black mb-1">24/7</div>
              <div className="text-xs font-medium text-gray-600">AI Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium tracking-tighter text-black mb-1">2.3s</div>
              <div className="text-xs font-medium text-gray-600">Average Response</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8 mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex -space-x-2">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <Image
                    src={agent.avatar || "/placeholder.svg"}
                    alt={agent.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-md border-2 border-white object-cover shadow-sm"
                  />
                </motion.div>
              ))}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm mb-1">Your AI Agents are ready</p>
              <p className="text-xs text-gray-600">Specialized in business travel</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              readOnly
              value="Find me a business class flight from JFK to LHR for next Monday"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all font-light text-sm"
            />
          </div>
        </motion.div>

        {/* Airlines Slider with Black Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="w-full overflow-hidden"
        >
          <div className="relative h-12">
            <motion.div
              className="absolute left-0 flex items-center"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Number.POSITIVE_INFINITY }}
            >
              {duplicatedAirlines.map((airline, index) => (
                <div key={`airline-${index}`} className="flex-shrink-0 mx-8" style={{ width: "120px" }}>
                  <Image
                    src={airline.logo || "/placeholder.svg"}
                    alt={airline.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain filter brightness-0"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
