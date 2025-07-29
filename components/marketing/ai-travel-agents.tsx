"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiStarFill,
  PiChatCircleBold,
  PiGlobeBold,
  PiCheckCircleBold,
  PiLightningBold,
  PiClockBold,
  PiShieldCheckBold,
} from "react-icons/pi"

interface Agent {
  id: string
  name: string
  avatar: string
  tagline: string
  rating: number
  completedTasks: number
  languages: string[]
  status: "online" | "busy" | "offline"
  capabilities: string[]
  expertise: string[]
}

export default function AITravelAgents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const agents: Agent[] = [
    {
      id: "1",
      name: "Sofia",
      avatar: "/agents/agent-sophia.jpeg",
      tagline: "Instant flight bookings with smart price optimization",
      rating: 4.9,
      completedTasks: 2847,
      languages: ["English", "Spanish", "Portuguese"],
      status: "online",
      capabilities: ["Flight Booking", "Price Alerts", "Route Planning"],
      expertise: ["Business Class", "Group Travel", "Last-minute"],
    },
    {
      id: "2",
      name: "Marcus",
      avatar: "/agents/agent-marcus.jpeg",
      tagline: "Real-time expense tracking and policy compliance",
      rating: 4.8,
      completedTasks: 1923,
      languages: ["English", "Mandarin", "Japanese"],
      status: "online",
      capabilities: ["Expense Reports", "Receipt Scanning", "Budget Control"],
      expertise: ["Corporate Cards", "Tax Reports", "Approvals"],
    },
    {
      id: "3",
      name: "Emma",
      avatar: "/agents/agent-emma.jpeg",
      tagline: "24/7 travel support with voice and chat assistance",
      rating: 4.9,
      completedTasks: 3156,
      languages: ["English", "French", "German"],
      status: "busy",
      capabilities: ["Voice Support", "Live Chat", "Emergency Help"],
      expertise: ["Disruptions", "Rebooking", "Concierge"],
    },
    {
      id: "4",
      name: "Zara",
      avatar: "/agents/agent-zara.jpeg",
      tagline: "Smart hotel recommendations with exclusive rates",
      rating: 4.7,
      completedTasks: 1654,
      languages: ["English", "Spanish"],
      status: "online",
      capabilities: ["Hotel Search", "Rate Comparison", "Loyalty Points"],
      expertise: ["Business Hotels", "Amenities", "Location"],
    },
  ]

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, which is expected in some browsers
      })
    }
  }, [])

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
          <div className="inline-flex items-center rounded-xl bg-gray-800 px-2 py-0.5 text-[9px] font-medium text-white mb-6">
            <Image
              src="/logo/suitpax-symbol.webp"
              alt="Suitpax"
              width={10}
              height={10}
              className="mr-1 w-2.5 h-2.5 brightness-0 invert"
            />
            AI Agents
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
            Your intelligent
            <br />
            <span className="text-gray-600">travel assistants</span>
          </h2>
          <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
            Meet our AI-powered specialists who handle every aspect of your business travel with precision and speed.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* AI Showcase Video */}
            <div className="lg:col-span-1">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4 sticky top-8">
                <div className="inline-flex items-center rounded-xl bg-gray-800 px-2 py-0.5 text-[9px] font-medium text-white mb-3">
                  Live Demo
                </div>

                <div className="relative rounded-xl overflow-hidden mb-3">
                  <video
                    ref={videoRef}
                    className="w-full h-40 object-cover"
                    loop
                    muted
                    autoPlay
                    playsInline
                    poster="/agents/agent-sophia.jpeg"
                  >
                    <source src="/videos/ai-agent-demo.mp4" type="video/mp4" />
                  </video>
                </div>

                <h3 className="text-lg font-medium tracking-tighter mb-2 text-black">AI in Action</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Watch our AI agents process complex travel requests in real-time with human-like understanding.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Processing Speed</span>
                    <span className="font-medium text-black">&lt; 2 seconds</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Accuracy Rate</span>
                    <span className="font-medium text-black">99.7%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Active 24/7</span>
                    <span className="font-medium text-black">Always On</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    className={`bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4 cursor-pointer transition-all ${
                      selectedAgent === agent.id ? "ring-2 ring-gray-800 shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="relative">
                        <Image
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-medium tracking-tighter text-black">{agent.name}</h3>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">{agent.tagline}</p>

                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <PiStarFill className="w-2.5 h-2.5 text-yellow-500 mr-1" />
                            <span className="font-medium text-black">{agent.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <PiCheckCircleBold className="w-2.5 h-2.5 text-green-500 mr-1" />
                            <span>{agent.completedTasks.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {agent.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>

                    {/* Languages & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <PiGlobeBold className="w-2.5 h-2.5 mr-1" />
                        <span>{agent.languages.slice(0, 2).join(", ")}</span>
                      </div>

                      <div className="flex items-center space-x-1">
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
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <div className="space-y-2 mb-3">
                            <h4 className="text-xs font-medium text-black">Specialized In:</h4>
                            <div className="flex flex-wrap gap-1">
                              {agent.expertise.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-lg bg-gray-800 px-2 py-0.5 text-[9px] font-medium text-white"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                            <div className="text-center">
                              <PiLightningBold className="w-3 h-3 mx-auto mb-1 text-yellow-500" />
                              <span className="text-gray-500">Fast</span>
                            </div>
                            <div className="text-center">
                              <PiClockBold className="w-3 h-3 mx-auto mb-1 text-blue-500" />
                              <span className="text-gray-500">24/7</span>
                            </div>
                            <div className="text-center">
                              <PiShieldCheckBold className="w-3 h-3 mx-auto mb-1 text-green-500" />
                              <span className="text-gray-500">Secure</span>
                            </div>
                          </div>

                          <button className="w-full px-3 py-2 bg-gray-800 text-white rounded-xl text-xs font-medium hover:bg-gray-900 transition-colors flex items-center justify-center">
                            <PiChatCircleBold className="w-3 h-3 mr-1.5" />
                            Start Working
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
