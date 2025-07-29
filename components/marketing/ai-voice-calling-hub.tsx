"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { PiPhoneFill, PiStarFill, PiMicrophoneFill } from "react-icons/pi"

const voiceAgents = [
  {
    id: 1,
    name: "Luna",
    role: "Travel Specialist",
    image: "/agents/agent-luna.jpeg",
    rating: 4.9,
    callsToday: 127,
    languages: ["EN", "ES", "FR"],
    specialty: "Corporate travel coordination",
    accent: "American",
    voice: "Professional, warm",
    status: "available" as const,
  },
  {
    id: 2,
    name: "Marcus",
    role: "Business Advisor",
    image: "/agents/agent-marcus.jpeg",
    rating: 4.8,
    callsToday: 89,
    languages: ["EN", "DE", "IT"],
    specialty: "Executive travel planning",
    accent: "British",
    voice: "Sophisticated, clear",
    status: "available" as const,
  },
  {
    id: 3,
    name: "Sophia",
    role: "Policy Expert",
    image: "/agents/agent-sophia.jpeg",
    rating: 4.9,
    callsToday: 156,
    languages: ["EN", "PT", "JP"],
    specialty: "Travel policy compliance",
    accent: "Canadian",
    voice: "Friendly, efficient",
    status: "busy" as const,
  },
  {
    id: 4,
    name: "Alex",
    role: "Tech Specialist",
    image: "/agents/agent-alex.jpeg",
    rating: 4.7,
    callsToday: 203,
    languages: ["EN", "ZH", "KO"],
    specialty: "AI-powered optimization",
    accent: "Australian",
    voice: "Energetic, tech-savvy",
    status: "available" as const,
  },
  {
    id: 5,
    name: "Emma",
    role: "Global Coordinator",
    image: "/agents/agent-emma.jpeg",
    rating: 4.8,
    callsToday: 134,
    languages: ["EN", "AR", "HI"],
    specialty: "International business travel",
    accent: "Irish",
    voice: "Calm, knowledgeable",
    status: "available" as const,
  },
  {
    id: 6,
    name: "Zara",
    role: "Sustainability Expert",
    image: "/agents/agent-zara.jpeg",
    rating: 4.9,
    callsToday: 98,
    languages: ["EN", "NL", "SV"],
    specialty: "Eco-friendly travel solutions",
    accent: "Scandinavian",
    voice: "Thoughtful, inspiring",
    status: "available" as const,
  },
  {
    id: 7,
    name: "Kai",
    role: "Flight Specialist",
    image: "/agents/agent-kai.jpeg",
    rating: 4.8,
    callsToday: 145,
    languages: ["EN", "JA", "TH"],
    specialty: "Flight booking & upgrades",
    accent: "American",
    voice: "Quick, efficient",
    status: "available" as const,
  },
  {
    id: 8,
    name: "Maya",
    role: "Hotel Expert",
    image: "/agents/agent-maya.jpeg",
    rating: 4.9,
    callsToday: 112,
    languages: ["EN", "ES", "PT"],
    specialty: "Luxury accommodations",
    accent: "Latin American",
    voice: "Warm, detailed",
    status: "available" as const,
  },
  {
    id: 9,
    name: "Nova",
    role: "Emergency Support",
    image: "/agents/agent-nova.jpeg",
    rating: 4.7,
    callsToday: 67,
    languages: ["EN", "FR", "DE"],
    specialty: "24/7 travel assistance",
    accent: "Canadian",
    voice: "Calm, reassuring",
    status: "available" as const,
  },
  {
    id: 10,
    name: "Aria",
    role: "Expense Manager",
    image: "/agents/agent-aria.jpeg",
    rating: 4.8,
    callsToday: 89,
    languages: ["EN", "IT", "ES"],
    specialty: "Expense tracking & reports",
    accent: "European",
    voice: "Precise, helpful",
    status: "busy" as const,
  },
  {
    id: 11,
    name: "Sage",
    role: "Policy Advisor",
    image: "/agents/agent-sage.jpeg",
    rating: 4.9,
    callsToday: 156,
    languages: ["EN", "FR", "NL"],
    specialty: "Corporate travel policies",
    accent: "British",
    voice: "Authoritative, clear",
    status: "available" as const,
  },
  {
    id: 12,
    name: "Tyler",
    role: "Group Coordinator",
    image: "/agents/agent-tyler.png",
    rating: 4.6,
    callsToday: 78,
    languages: ["EN", "ES", "FR"],
    specialty: "Team travel coordination",
    accent: "American",
    voice: "Organized, friendly",
    status: "available" as const,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-400"
    case "busy":
      return "bg-orange-400"
    case "offline":
      return "bg-gray-400"
    default:
      return "bg-gray-300"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Available"
    case "busy":
      return "On Call"
    case "offline":
      return "Offline"
    default:
      return "Unknown"
  }
}

export const AIVoiceCallingHub = () => {
  const [selectedAgent, setSelectedAgent] = useState(voiceAgents[0])
  const [isCallActive, setIsCallActive] = useState(false)

  useEffect(() => {
    // Auto-rotate through agents for demo effect
    const interval = setInterval(() => {
      setSelectedAgent((prev) => {
        const currentIndex = voiceAgents.findIndex((agent) => agent.id === prev.id)
        const nextIndex = (currentIndex + 1) % voiceAgents.length
        return voiceAgents[nextIndex]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleCall = () => {
    setIsCallActive(!isCallActive)
  }

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[8px] font-medium text-gray-700">
              <PiMicrophoneFill className="w-2 h-2 mr-1" />
              Voice AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[7px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Live Demo
            </span>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tighter text-black leading-none mb-2">
            Talk to our AI agents
          </h2>
          <p className="text-[10px] font-medium text-gray-500 max-w-md mx-auto">
            Experience natural conversations with AI travel specialists
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Agent Selection - More Compact Grid */}
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Choose your specialist</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                {voiceAgents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedAgent.id === agent.id
                        ? "bg-gray-50 border-gray-300 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-1">
                        <Image
                          src={agent.image || "/placeholder.svg"}
                          alt={agent.name}
                          width={24}
                          height={24}
                          className="rounded-md object-cover"
                        />
                        <div
                          className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 ${getStatusColor(
                            agent.status,
                          )} rounded-full border border-white`}
                        />
                      </div>
                      <h4 className="text-[8px] font-medium text-gray-900 truncate w-full">{agent.name}</h4>
                      <p className="text-[7px] text-gray-600 truncate w-full">{agent.role.split(" ")[0]}</p>
                      <div className="flex items-center gap-0.5 text-[6px] text-gray-500 mt-0.5">
                        <PiStarFill className="w-1.5 h-1.5 text-yellow-500" />
                        <span>{agent.rating}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Agent Details - Compact */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2 mb-3">
                <div className="relative">
                  <Image
                    src={selectedAgent.image || "/placeholder.svg"}
                    alt={selectedAgent.name}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                  <div
                    className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${getStatusColor(
                      selectedAgent.status,
                    )} rounded-full border border-white`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-[9px] text-gray-600 mb-1">{selectedAgent.role}</p>
                  <span
                    className={`inline-flex items-center rounded-md px-1 py-0.5 text-[7px] font-medium ${
                      selectedAgent.status === "available"
                        ? "bg-green-100 text-green-700"
                        : selectedAgent.status === "busy"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {getStatusText(selectedAgent.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-[8px] font-medium text-gray-700 mb-0.5">Specialty</p>
                  <p className="text-[9px] text-gray-600 leading-tight">{selectedAgent.specialty}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[8px] font-medium text-gray-700 mb-0.5">Voice</p>
                    <p className="text-[8px] text-gray-600">{selectedAgent.voice.split(",")[0]}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-medium text-gray-700 mb-0.5">Accent</p>
                    <p className="text-[8px] text-gray-600">{selectedAgent.accent}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[8px] font-medium text-gray-700 mb-0.5">Languages</p>
                  <div className="flex flex-wrap gap-0.5">
                    {selectedAgent.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center rounded-md bg-gray-200 px-1 py-0.5 text-[7px] font-medium text-gray-700"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call Button */}
              <motion.button
                onClick={handleCall}
                disabled={selectedAgent.status !== "available"}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[9px] font-medium transition-all ${
                  selectedAgent.status === "available"
                    ? isCallActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-black hover:bg-gray-800 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={selectedAgent.status === "available" ? { scale: 1.02 } : {}}
                whileTap={selectedAgent.status === "available" ? { scale: 0.98 } : {}}
              >
                <PiPhoneFill className="w-2.5 h-2.5" />
                {isCallActive ? "End Call" : selectedAgent.status === "available" ? "Start Call" : "Agent Busy"}
              </motion.button>

              {isCallActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-2 bg-white rounded-md border border-gray-200"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-medium text-gray-700">Connected to {selectedAgent.name}</span>
                  </div>
                  <p className="text-[9px] text-gray-600 leading-tight">
                    "Hello! I'm {selectedAgent.name}. How can I help with your business travel today?"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIVoiceCallingHub
