"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiPaperPlaneTiltBold, PiSparkle } from "react-icons/pi"

const agents = [
  { name: "Luna", avatar: "/agents/agent-luna-new.png" },
  { name: "Kahn", avatar: "/agents/kahn-avatar.png" },
  { name: "Winter", avatar: "/agents/agent-52.png" },
  { name: "Sophia", avatar: "/agents/agent-17.png" },
  { name: "Alex", avatar: "/agents/agent-8.png" },
  { name: "Jasmine", avatar: "/agents/agent-38.png" },
]

const airlines = [
  {
    name: "American Airlines",
    logo: "https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  { name: "KLM", logo: "https://cdn.brandfetch.io/klm.com/w/512/h/69/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "Japan Airlines",
    logo: "https://cdn.brandfetch.io/jal.com/w/512/h/49/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Qatar Airways",
    logo: "https://cdn.brandfetch.io/qatarairways.com/w/512/h/144/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "British Airways",
    logo: "https://cdn.brandfetch.io/britishairways.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci",
  },
  { name: "Southwest", logo: "https://cdn.brandfetch.io/southwest.com/w/512/h/78/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Iberia", logo: "https://cdn.brandfetch.io/iberia.com/w/512/h/114/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "Air Canada",
    logo: "https://cdn.brandfetch.io/aircanada.com/w/512/h/67/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Emirates",
    logo: "https://cdn.brandfetch.io/emirates.com/w/512/h/95/theme/light/logo?c=1idU-l8vdm7C5__3dci",
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
            className="text-lg font-light text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Our AI agents, powered by the Model Context Protocol, understand your travel preferences and company
            policies to find the perfect flight options for you and your team.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8 mb-12"
        >
          <div className="flex items-center gap-6 mb-6">
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
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                  )}
                </motion.div>
              ))}
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Your AI Agents are ready to assist</p>
              <p className="text-xs text-gray-600">Specialized in business travel and corporate policies</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="e.g., 'Find me a business class flight from JFK to LHR for next Monday'"
              className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all font-light"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
              <PiPaperPlaneTiltBold className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
              "Business class to London"
            </button>
            <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
              "Cheapest flight to Tokyo"
            </button>
            <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
              "Direct flights only"
            </button>
          </div>
        </motion.div>

        {/* Airlines Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="w-full overflow-hidden"
        >
          <div className="relative h-16">
            <motion.div
              className="absolute left-0 flex items-center"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Number.POSITIVE_INFINITY }}
            >
              {duplicatedAirlines.map((airline, index) => (
                <div key={`airline-${index}`} className="flex-shrink-0 mx-8" style={{ width: "120px" }}>
                  <Image
                    src={airline.logo || "/placeholder.svg"}
                    alt={airline.name}
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
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
