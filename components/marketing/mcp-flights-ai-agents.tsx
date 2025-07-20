"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { PiGlobeBold, PiLightningBold, PiShieldCheckBold, PiArrowRightBold, PiPaperPlaneTiltBold } from "react-icons/pi"

const agents = [
  { name: "Luna", avatar: "/agents/agent-luna-new.png", specialty: "Flight Expert" },
  { name: "Kahn", avatar: "/agents/kahn-avatar.png", specialty: "Hotel Specialist" },
  { name: "Winter", avatar: "/agents/agent-52.png", specialty: "Travel Coordinator" },
  { name: "Sophia", avatar: "/agents/agent-sophia.jpeg", specialty: "Expense Manager" },
  { name: "Alex", avatar: "/agents/agent-alex.jpeg", specialty: "Policy Advisor" },
  { name: "Jasmine", avatar: "/agents/agent-38.png", specialty: "Trip Planner" },
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

const flightExamples = [
  {
    query: "Find me a business class flight from JFK to LHR for next Monday",
    response: "Found 12 business class options. Best: BA 183 departing 8:45 PM, $3,247",
    agent: agents[0],
  },
  {
    query: "Book round trip SFO to NRT, economy plus, under $1200",
    response: "3 options found under budget. JAL 2 departing Thu 2:15 PM, $1,089",
    agent: agents[1],
  },
  {
    query: "Team of 8 needs flights LAX to CDG, flexible dates",
    response: "Group booking available. Air France 66, multiple dates, from $847/person",
    agent: agents[2],
  },
]

// Componente MiniChat mejorado
const MCPMiniChat = ({
  query,
  response,
  agent,
  isActive,
}: {
  query: string
  response: string
  agent: (typeof agents)[0]
  isActive: boolean
}) => {
  return (
    <motion.div
      className={`relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300 ${
        isActive
          ? "bg-white border-gray-200 shadow-md"
          : "bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm"
      }`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* User Query */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">You</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-black">{query}</p>
        </div>
      </div>

      {/* Agent Response */}
      <div className="flex items-start gap-3">
        <div className="relative w-8 h-8 overflow-hidden rounded-xl border border-gray-200">
          <Image
            src={agent.avatar || "/placeholder.svg"}
            alt={agent.name}
            width={32}
            height={32}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-black">{agent.name}</span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              {agent.specialty}
            </span>
          </div>
          <p className="text-sm text-gray-600">{response}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-medium text-black transition-colors">
          <span>Book Flight</span>
          <PiArrowRightBold className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )
}

const MCPFlightsAIAgents = () => {
  const [currentExample, setCurrentExample] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const startCycle = () => {
      intervalRef.current = setInterval(() => {
        setIsTyping(true)
        setTimeout(() => {
          setCurrentExample((prev) => (prev + 1) % flightExamples.length)
          setIsTyping(false)
        }, 1000)
      }, 5000)
    }

    startCycle()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1"
              />
              MCP
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              AI Agents
            </span>
          </div>
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-black leading-none mb-4">
            Search flights with your personal AI Agent
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            Our AI agents, powered by the Model Context Protocol, understand your travel needs to find the perfect
            flight options for you and your team.
          </p>
        </div>

        {/* Main Demo Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Agents Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden"
                  >
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-black">Your AI Agents are ready to assist</p>
                <p className="text-xs text-gray-600">Powered by Model Context Protocol</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="e.g., 'Find me a business class flight from JFK to LHR for next Monday'"
                className="w-full pl-5 pr-14 py-4 rounded-xl border border-gray-200 bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all text-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-black transition-colors">
                <PiPaperPlaneTiltBold className="w-5 h-5" />
              </button>
            </div>

            {/* Live Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {flightExamples.map((example, index) => (
                <MCPMiniChat
                  key={index}
                  query={example.query}
                  response={example.response}
                  agent={example.agent}
                  isActive={currentExample === index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: PiGlobeBold,
              title: "500+ Airlines",
              description: "Access to global airline inventory through NDC connections",
              badge: "Global",
            },
            {
              icon: PiLightningBold,
              title: "Real-time Pricing",
              description: "Live pricing updates and availability across all carriers",
              badge: "Live",
            },
            {
              icon: PiShieldCheckBold,
              title: "Smart Policies",
              description: "Automatic compliance with your company travel policies",
              badge: "Smart",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-black" />
                </div>
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-medium tracking-tighter text-black mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Airlines Slider */}
        <div className="w-full overflow-hidden">
          <div className="relative h-12 flex items-center [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
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
                    className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
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
