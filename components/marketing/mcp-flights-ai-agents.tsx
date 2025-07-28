"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiPaperPlaneTiltBold } from "react-icons/pi"

const agents = [
  { name: "Luna", avatar: "/agents/agent-12.png" },
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

const MCPFlightsAIAgents = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-sm font-medium text-black mb-4">
            MCP-Powered Flights
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black leading-tight mb-4">
            Search flights with your personal AI Agent
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
            Our AI agents, powered by the Model Context Protocol, understand your travel needs to find the perfect
            flight options for you and your team.
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.name}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-700">Your AI Agents are ready to assist.</p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g., 'Find me a business class flight from JFK to LHR for next Monday'"
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
                <PiPaperPlaneTiltBold className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full overflow-hidden">
          <div className="relative h-12">
            <motion.div
              className="absolute left-0 flex items-center"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 20, repeat: Number.POSITIVE_INFINITY }}
            >
              {duplicatedAirlines.map((airline, index) => (
                <div key={`top-${index}`} className="flex-shrink-0 mx-6" style={{ width: "120px" }}>
                  <Image
                    src={airline.logo || "/placeholder.svg"}
                    alt={airline.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MCPFlightsAIAgents
