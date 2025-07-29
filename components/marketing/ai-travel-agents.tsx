"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Play, Pause, Volume2, Star, Award, Globe, Zap } from "lucide-react"

const agents = [
  {
    id: 1,
    name: "Sophia",
    role: "Senior Travel Specialist",
    thumbnail: "/agents/agent-sophia.jpeg",
    description: "Expert in complex international itineraries and luxury business travel arrangements.",
    specialties: ["International Travel", "Luxury Bookings", "VIP Services"],
    rating: 4.9,
    completedBookings: 2847,
  },
  {
    id: 2,
    name: "Marcus",
    role: "Expense & Policy Manager",
    thumbnail: "/agents/agent-marcus.jpeg",
    description: "Specialized in corporate expense optimization and travel policy compliance.",
    specialties: ["Expense Management", "Policy Compliance", "Cost Optimization"],
    rating: 4.8,
    completedBookings: 3156,
  },
  {
    id: 3,
    name: "Emma",
    role: "Voice & Chat Assistant",
    thumbnail: "/agents/agent-emma.jpeg",
    description: "Advanced conversational AI for real-time travel support and instant bookings.",
    specialties: ["Voice Recognition", "Real-time Support", "Multi-language"],
    rating: 4.9,
    completedBookings: 4523,
  },
  {
    id: 4,
    name: "Alex",
    role: "Booking Automation Expert",
    thumbnail: "/agents/agent-alex.jpeg",
    description: "Lightning-fast booking processing with intelligent price optimization.",
    specialties: ["Automated Bookings", "Price Optimization", "Speed Processing"],
    rating: 4.7,
    completedBookings: 1892,
  },
]

export default function AITravelAgents() {
  const [activeAgent, setActiveAgent] = useState(agents[0])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((currentAgent) => {
        const currentIndex = agents.findIndex((a) => a.id === currentAgent.id)
        return agents[(currentIndex + 1) % agents.length]
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoMuted
      setVideoMuted(!videoMuted)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-3 py-1 text-xs font-medium text-white">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1.5 filter brightness-0 invert"
              />
              AI Travel Agents
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-3 py-1 text-xs font-medium text-white">
              <Star className="w-3 h-3 mr-1" />
              Expert Specialists
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none mb-4">
            Meet Your <em className="font-serif italic">AI Travel Team</em>
          </h2>

          <p className="text-gray-600 font-light max-w-3xl mx-auto mb-2">
            Our specialized AI agents work around the clock to handle every aspect of your business travel with
            human-like intelligence and unmatched efficiency.
          </p>

          <p className="text-xs font-light text-gray-500 max-w-2xl mx-auto">
            Advanced AI • Real-time processing • 24/7 availability • Multi-language support
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Agent List */}
          <div className="lg:col-span-2 space-y-4">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                onClick={() => setActiveAgent(agent)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeAgent.id === agent.id
                    ? "border-black bg-gray-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
                whileHover={{ scale: activeAgent.id === agent.id ? 1.02 : 1.01 }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Image
                      src={agent.thumbnail || "/placeholder.svg"}
                      alt={agent.name}
                      width={64}
                      height={64}
                      className="rounded-xl object-cover border-2 border-gray-200"
                    />
                    {activeAgent.id === agent.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-black">{agent.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{agent.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{agent.role}</p>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {agent.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Award className="w-3 h-3" />
                      <span>{agent.completedBookings.toLocaleString()} bookings completed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Agent Display */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeAgent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
            >
              {/* Video Background */}
              <div className="relative aspect-[16/10]">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted={videoMuted}
                  loop
                  playsInline
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleVideo}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                  >
                    <Volume2 className={`w-4 h-4 ${videoMuted ? "opacity-50" : ""}`} />
                  </button>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Agent Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-3xl font-medium tracking-tight">{activeAgent.name}</h3>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">{activeAgent.rating}</span>
                        </div>
                      </div>

                      <p className="text-lg text-gray-200 mb-4">{activeAgent.role}</p>
                      <p className="text-sm text-gray-300 max-w-md mb-4">{activeAgent.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {activeAgent.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span>Global Coverage</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          <span>Instant Response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Agent Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-medium text-black mb-1">
                  {activeAgent.completedBookings.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Bookings Completed</div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-medium text-black mb-1">{activeAgent.rating}</div>
                <div className="text-xs text-gray-600">Average Rating</div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-medium text-black mb-1">24/7</div>
                <div className="text-xs text-gray-600">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
