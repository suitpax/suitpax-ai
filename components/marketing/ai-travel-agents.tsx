"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiPlayBold,
  PiPauseBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
  PiStarFill,
  PiChatCircleBold,
  PiGlobeBold,
  PiCheckCircleBold,
} from "react-icons/pi"

interface Agent {
  id: string
  name: string
  avatar: string
  specialty: string
  rating: number
  completedBookings: number
  languages: string[]
  status: "online" | "busy" | "offline"
  description: string
  expertise: string[]
}

export default function AITravelAgents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const agents: Agent[] = [
    {
      id: "1",
      name: "Sofia Martinez",
      avatar: "/agents/agent-sophia.jpeg",
      specialty: "Corporate Travel Specialist",
      rating: 4.9,
      completedBookings: 2847,
      languages: ["English", "Spanish", "Portuguese"],
      status: "online",
      description: "Expert in complex multi-city business itineraries and corporate travel policies.",
      expertise: ["Business Class Upgrades", "Group Bookings", "Travel Policy Compliance"],
    },
    {
      id: "2",
      name: "Marcus Chen",
      avatar: "/agents/agent-marcus.jpeg",
      specialty: "Luxury Travel Curator",
      rating: 4.8,
      completedBookings: 1923,
      languages: ["English", "Mandarin", "Japanese"],
      status: "online",
      description: "Specializes in premium accommodations and exclusive travel experiences.",
      expertise: ["First Class Travel", "Luxury Hotels", "VIP Services"],
    },
    {
      id: "3",
      name: "Emma Thompson",
      avatar: "/agents/agent-emma.jpeg",
      specialty: "International Routes Expert",
      rating: 4.9,
      completedBookings: 3156,
      languages: ["English", "French", "German"],
      status: "busy",
      description: "Master of complex international routing and visa requirements.",
      expertise: ["Visa Processing", "Multi-Stop Routes", "Travel Documentation"],
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      avatar: "/agents/agent-alex.jpeg",
      specialty: "Emergency Travel Solutions",
      rating: 4.7,
      completedBookings: 1654,
      languages: ["English", "Spanish"],
      status: "online",
      description: "Available 24/7 for urgent travel changes and emergency bookings.",
      expertise: ["Last-Minute Bookings", "24/7 Support", "Travel Disruptions"],
    },
  ]

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const handleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted
      setIsVideoMuted(!isVideoMuted)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
            <Image
              src="/logo/suitpax-symbol.webp"
              alt="Suitpax"
              width={12}
              height={12}
              className="mr-1.5 w-3 h-3 brightness-0 invert"
            />
            AI Travel Agents
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
            Meet your dedicated
            <br />
            <span className="text-gray-600">travel specialists</span>
          </h2>
          <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
            Our AI-powered travel agents combine human expertise with artificial intelligence to deliver personalized
            travel solutions 24/7.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Agent Showcase Video */}
            <div className="lg:col-span-1">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
                <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-4">
                  Expert Specialists
                </div>

                <div className="relative rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    className="w-full h-48 object-cover"
                    loop
                    muted={isVideoMuted}
                    playsInline
                    poster="/agents/agent-sophia.jpeg"
                  >
                    <source src="/videos/ai-agent-demo.mp4" type="video/mp4" />
                  </video>

                  {/* Video Controls */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleVideoToggle}
                        className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        {isVideoPlaying ? (
                          <PiPauseBold className="w-5 h-5 text-gray-800" />
                        ) : (
                          <PiPlayBold className="w-5 h-5 text-gray-800 ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={handleVideoMute}
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        {isVideoMuted ? (
                          <PiSpeakerSlashBold className="w-4 h-4 text-gray-800" />
                        ) : (
                          <PiSpeakerHighBold className="w-4 h-4 text-gray-800" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-medium tracking-tighter mb-2 text-black">AI-Enhanced Expertise</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Watch how our AI agents combine artificial intelligence with human-like understanding to solve complex
                  travel challenges.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium text-black">&lt; 30 seconds</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-black">99.2%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Languages</span>
                    <span className="font-medium text-black">12+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    className={`bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer transition-all ${
                      selectedAgent === agent.id ? "ring-2 ring-gray-800 shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <Image
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded-full object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-medium tracking-tighter text-black">{agent.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{agent.specialty}</p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <PiStarFill className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="font-medium text-black">{agent.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <PiCheckCircleBold className="w-3 h-3 text-green-500 mr-1" />
                            <span>{agent.completedBookings.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{agent.description}</p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Languages */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <PiGlobeBold className="w-3 h-3 mr-1" />
                        <span>{agent.languages.join(", ")}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-medium capitalize ${
                            agent.status === "online"
                              ? "text-green-600"
                              : agent.status === "busy"
                                ? "text-yellow-600"
                                : "text-gray-500"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedAgent === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-gray-500">Avg. Response</span>
                              <p className="font-medium text-black">&lt; 30 seconds</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Availability</span>
                              <p className="font-medium text-black">24/7</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Specialization</span>
                              <p className="font-medium text-black">Business Travel</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Experience</span>
                              <p className="font-medium text-black">5+ Years</p>
                            </div>
                          </div>

                          <button className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center">
                            <PiChatCircleBold className="w-4 h-4 mr-2" />
                            Start Conversation
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
