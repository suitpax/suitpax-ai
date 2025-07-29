"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"

// Video agents data - smaller and more focused
const videoAgents = [
  {
    id: 1,
    name: "Sophia",
    role: "Travel Specialist",
    video: "/videos/agent-sophia.mp4", // Placeholder - you'll need to add actual videos
    thumbnail: "/agents/agent-sophia.jpeg",
  },
  {
    id: 2,
    name: "Marcus",
    role: "Expense Manager",
    video: "/videos/agent-marcus.mp4",
    thumbnail: "/agents/agent-marcus.jpeg",
  },
  {
    id: 3,
    name: "Emma",
    role: "Policy Advisor",
    video: "/videos/agent-emma.mp4",
    thumbnail: "/agents/agent-emma.jpeg",
  },
  {
    id: 4,
    name: "Alex",
    role: "Booking Assistant",
    video: "/videos/agent-alex.mp4",
    thumbnail: "/agents/agent-alex.jpeg",
  },
  {
    id: 5,
    name: "Zara",
    role: "Analytics Expert",
    video: "/videos/agent-zara.mp4",
    thumbnail: "/agents/agent-zara.jpeg",
  },
  {
    id: 6,
    name: "Luna",
    role: "Support Specialist",
    video: "/videos/agent-luna.mp4",
    thumbnail: "/agents/agent-luna.jpeg",
  },
]

export default function AITravelAgents() {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-rotate agents every 3 seconds
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentAgentIndex((prev) => (prev + 1) % videoAgents.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const currentAgent = videoAgents[currentAgentIndex]

  return (
    <section className="pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <em className="font-serif italic">AI Travel Agents</em>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
            <em className="font-serif italic">Meet Your</em>
            <br />
            <span className="text-gray-700">AI Travel Team</span>
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
            Our AI agents work 24/7 to handle your business travel needs with human-like intelligence and efficiency.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              {/* Video placeholder - replace with actual video when available */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                style={{
                  backgroundImage: `url(${currentAgent.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/20" />

                {/* Agent info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-xl font-medium tracking-tighter mb-1">{currentAgent.name}</h3>
                  <p className="text-white/80 text-sm font-light">{currentAgent.role}</p>
                </div>

                {/* Play/Pause control */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Agent Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium tracking-tighter mb-6">
              <em className="font-serif italic">Your AI Team</em>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {videoAgents.map((agent, index) => (
                <motion.button
                  key={agent.id}
                  onClick={() => setCurrentAgentIndex(index)}
                  className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                    currentAgentIndex === index
                      ? "border-black bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"
                      style={{
                        backgroundImage: `url(${agent.thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{agent.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{agent.role}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Current agent details */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-medium tracking-tighter mb-3">
                <em className="font-serif italic">Currently Featuring: {currentAgent.name}</em>
              </h4>
              <p className="text-gray-600 font-light mb-4">
                {currentAgent.role} - Specialized in providing intelligent assistance for your business travel needs.
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Available 24/7</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 font-light text-sm">
                  <strong className="font-medium">Instant Responses:</strong> Get immediate help with bookings,
                  policies, and expenses
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 font-light text-sm">
                  <strong className="font-medium">Smart Learning:</strong> AI agents learn from your preferences and
                  company policies
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 font-light text-sm">
                  <strong className="font-medium">Multi-language:</strong> Communicate in your preferred language
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
