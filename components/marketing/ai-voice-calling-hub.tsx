"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { PiPhoneFill, PiStarFill, PiGlobeFill, PiMicrophoneFill } from "react-icons/pi"

const voiceAgents = [
  {
    id: 1,
    name: "Luna",
    role: "Travel Specialist",
    image: "/agents/agent-luna.jpeg",
    rating: 4.9,
    callsToday: 127,
    languages: ["English", "Spanish", "French"],
    specialty: "Corporate travel coordination and team logistics",
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
    languages: ["English", "German", "Italian"],
    specialty: "Executive travel planning and luxury experiences",
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
    languages: ["English", "Portuguese", "Japanese"],
    specialty: "Travel policy compliance and expense management",
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
    languages: ["English", "Mandarin", "Korean"],
    specialty: "AI-powered travel optimization and tech integration",
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
    languages: ["English", "Arabic", "Hindi"],
    specialty: "International business travel and cultural guidance",
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
    languages: ["English", "Dutch", "Swedish"],
    specialty: "Eco-friendly travel solutions and carbon offset planning",
    accent: "Scandinavian",
    voice: "Thoughtful, inspiring",
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
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleCall = () => {
    setIsCallActive(!isCallActive)
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
              <PiMicrophoneFill className="w-2.5 h-2.5 mr-1" />
              Voice AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Live Demo
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-black leading-none mb-3">
            Talk to our AI agents
          </h2>
          <p className="text-xs font-medium text-gray-500 max-w-lg mx-auto">
            Experience natural conversations with AI travel specialists powered by advanced voice technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Agent Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Choose your specialist</h3>
              <div className="grid grid-cols-2 gap-2">
                {voiceAgents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedAgent.id === agent.id
                        ? "bg-gray-50 border-gray-300 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="relative">
                        <Image
                          src={agent.image || "/placeholder.svg"}
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="rounded-lg object-cover"
                        />
                        <div
                          className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${getStatusColor(
                            agent.status,
                          )} rounded-full border border-white`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-gray-900 truncate">{agent.name}</h4>
                        <p className="text-[10px] text-gray-600 truncate">{agent.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500">
                      <div className="flex items-center gap-0.5">
                        <PiStarFill className="w-2 h-2 text-yellow-500" />
                        <span>{agent.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{agent.callsToday} calls</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Agent Details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <Image
                    src={selectedAgent.image || "/placeholder.svg"}
                    alt={selectedAgent.name}
                    width={48}
                    height={48}
                    className="rounded-xl object-cover"
                  />
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(
                      selectedAgent.status,
                    )} rounded-full border-2 border-white`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{selectedAgent.role}</p>
                  <span
                    className={`inline-flex items-center rounded-lg px-1.5 py-0.5 text-[9px] font-medium ${
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

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-[10px] font-medium text-gray-700 mb-1">Specialty</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedAgent.specialty}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-700 mb-1">Voice</p>
                    <p className="text-xs text-gray-600">{selectedAgent.voice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-700 mb-1">Accent</p>
                    <p className="text-xs text-gray-600">{selectedAgent.accent}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-gray-700 mb-1">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgent.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center rounded-lg bg-gray-200 px-1.5 py-0.5 text-[9px] font-medium text-gray-700"
                      >
                        <PiGlobeFill className="w-2 h-2 mr-0.5" />
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
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
                  selectedAgent.status === "available"
                    ? isCallActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-black hover:bg-gray-800 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={selectedAgent.status === "available" ? { scale: 1.02 } : {}}
                whileTap={selectedAgent.status === "available" ? { scale: 0.98 } : {}}
              >
                <PiPhoneFill className="w-3 h-3" />
                {isCallActive ? "End Call" : selectedAgent.status === "available" ? "Start Call" : "Agent Busy"}
              </motion.button>

              {isCallActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-medium text-gray-700">Connected to {selectedAgent.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    "Hello! I'm {selectedAgent.name}, your {selectedAgent.role.toLowerCase()}. How can I help you with
                    your business travel today?"
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
