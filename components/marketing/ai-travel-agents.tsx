"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const agentVideos = [
  {
    id: 1,
    name: "Emma",
    role: "Executive Assistant",
    videoUrl: "/videos/agent-emma.mp4",
    specialty: "Luxury travel coordination",
  },
  {
    id: 2,
    name: "Marcus",
    role: "Corporate Specialist",
    videoUrl: "/videos/agent-marcus.mp4",
    specialty: "Policy compliance",
  },
  {
    id: 3,
    name: "Sophia",
    role: "VIP Concierge",
    videoUrl: "/videos/agent-sophia.mp4",
    specialty: "Premium experiences",
  },
  {
    id: 4,
    name: "Alex",
    role: "Tech Guide",
    videoUrl: "/videos/agent-alex.mp4",
    specialty: "Digital solutions",
  },
  {
    id: 5,
    name: "Luna",
    role: "Global Coordinator",
    videoUrl: "/videos/agent-luna.mp4",
    specialty: "International travel",
  },
  {
    id: 6,
    name: "Kai",
    role: "Flight Expert",
    videoUrl: "/videos/agent-kai.mp4",
    specialty: "Aviation logistics",
  },
]

export const AITravelAgents = () => {
  const [currentAgent, setCurrentAgent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAgent((prev) => (prev + 1) % agentVideos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              AI Agents
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse mr-1"></span>
              Live Preview
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none mb-4">
            Meet your AI travel team
          </h2>

          <p className="text-sm font-medium text-gray-500 max-w-2xl mx-auto">
            Specialized AI agents working 24/7 to handle every aspect of your business travel needs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {agentVideos.map((agent, index) => (
              <motion.div
                key={agent.id}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  currentAgent === index ? "border-black shadow-lg scale-105" : "border-gray-200 hover:border-gray-300"
                }`}
                whileHover={{ scale: currentAgent === index ? 1.05 : 1.02 }}
                onClick={() => setCurrentAgent(index)}
              >
                <div className="aspect-[3/4] bg-gray-100 relative cursor-pointer">
                  {/* Placeholder for video - in production you'd use actual video files */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                      <div className="w-12 h-2 bg-gray-400 rounded mx-auto animate-pulse"></div>
                    </div>
                  </div>

                  {/* Agent info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <h3 className="text-white text-xs font-medium">{agent.name}</h3>
                    <p className="text-white/80 text-[10px]">{agent.role}</p>
                  </div>

                  {/* Active indicator */}
                  {currentAgent === index && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current agent details */}
          <motion.div
            key={currentAgent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-medium tracking-tighter text-black mb-2">{agentVideos[currentAgent].name}</h3>
            <p className="text-sm text-gray-600 mb-3">{agentVideos[currentAgent].role}</p>
            <p className="text-xs font-medium text-gray-500">Specializing in {agentVideos[currentAgent].specialty}</p>

            <div className="flex justify-center mt-4">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                Available now
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AITravelAgents
