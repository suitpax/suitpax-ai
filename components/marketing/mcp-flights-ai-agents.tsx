"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiPaperPlaneTiltBold } from "react-icons/pi"

const agents = [
  { name: "Luna", avatar: "/agents/agent-luna-new.png" },
  { name: "Kahn", avatar: "/agents/kahn-avatar.png" },
  { name: "Winter", avatar: "/agents/agent-52.png" },
  { name: "Sophia", avatar: "/agents/agent-sophia.jpeg" },
  { name: "Alex", avatar: "/agents/agent-alex.jpeg" },
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

const duplicatedAirlines = [...airlines, ...airlines, ...airlines, ...airlines]

const MCPFlightsAIAgents = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="w-full bg-black py-20 relative overflow-hidden">
      {/* Background effects from Hyperspeed */}
      <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        className="container mx-auto px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center rounded-xl bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-gray-300 mb-4"
          >
            MCP-Powered Flights
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-medium tracking-tighter leading-tight mb-4 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text"
          >
            Search flights with your personal AI Agent
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base text-gray-400 max-w-2xl mx-auto mb-10">
            Our AI agents, powered by the Model Context Protocol, understand your travel needs to find the perfect
            flight options for you and your team.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="bg-black/30 backdrop-blur-lg rounded-2xl border border-gray-500/20 shadow-xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
              <div className="flex -space-x-3">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-800/50 overflow-hidden"
                  >
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-300 text-center sm:text-left">
                Your AI Agents are ready to assist.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g., 'Find me a business class flight from JFK to LHR for next Monday'"
                className="w-full pl-5 pr-14 py-4 rounded-xl border border-gray-700 bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                <PiPaperPlaneTiltBold className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-16 w-full overflow-hidden">
          <div className="relative h-12 flex items-center [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <motion.div
              className="absolute left-0 flex items-center"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Number.POSITIVE_INFINITY }}
            >
              {duplicatedAirlines.map((airline, index) => (
                <div key={`top-${index}`} className="flex-shrink-0 mx-8" style={{ width: "120px" }}>
                  <Image
                    src={airline.logo || "/placeholder.svg"}
                    alt={airline.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain invert brightness-0 filter"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default MCPFlightsAIAgents
