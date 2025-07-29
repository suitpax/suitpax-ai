"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiStarFill,
  PiChatCircleBold,
  PiGlobeBold,
  PiCheckCircleBold,
  PiAirplaneTakeoffBold,
  PiBuildingsBold,
  PiCreditCardBold,
  PiCalendarBold,
} from "react-icons/pi"

export default function AITravelAgents() {
  const [selectedCapability, setSelectedCapability] = useState<string>("flights")
  const videoRef = useRef<HTMLVideoElement>(null)

  const agent = {
    id: "1",
    name: "Sofia",
    avatar: "/agents/agent-sophia.jpeg",
    tagline: "Your AI travel specialist handling everything from flights to expenses",
    rating: 4.9,
    completedTasks: 12847,
    languages: ["English", "Spanish", "Portuguese", "French"],
    status: "online" as const,
  }

  const capabilities = [
    {
      id: "flights",
      title: "Flight Booking",
      description: "Search, compare, and book flights across 500+ airlines with real-time pricing",
      icon: PiAirplaneTakeoffBold,
      features: ["NDC connections", "Price alerts", "Seat selection", "Upgrades"],
      color: "bg-blue-500",
    },
    {
      id: "hotels",
      title: "Hotel Reservations",
      description: "Find and book accommodations with corporate rates and loyalty integration",
      icon: PiBuildingsBold,
      features: ["Corporate rates", "Loyalty points", "Room preferences", "Amenities"],
      color: "bg-green-500",
    },
    {
      id: "expenses",
      title: "Expense Management",
      description: "Automatic receipt capture, categorization, and policy compliance checking",
      icon: PiCreditCardBold,
      features: ["Receipt scanning", "Auto-categorization", "Policy checks", "Reporting"],
      color: "bg-purple-500",
    },
    {
      id: "calendar",
      title: "Calendar Integration",
      description: "Sync travel plans with your calendar and send automated updates to stakeholders",
      icon: PiCalendarBold,
      features: ["Calendar sync", "Auto-updates", "Meeting blocks", "Notifications"],
      color: "bg-orange-500",
    },
  ]

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, which is expected in some browsers
      })
    }
  }, [])

  const selectedCap = capabilities.find((cap) => cap.id === selectedCapability) || capabilities[0]

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/spectral-dark-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
            <Image
              src="/logo/suitpax-symbol.webp"
              alt="Suitpax"
              width={12}
              height={12}
              className="mr-1.5 w-3 h-3 brightness-0 invert"
            />
            AI Travel Specialist
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tighter leading-none mb-6 text-white">
            Meet your intelligent
            <br />
            <span className="text-white/80 font-inter">multitasking assistant</span>
          </h2>
          <p className="text-lg font-light text-white/90 max-w-3xl mx-auto font-inter">
            One AI agent that handles every aspect of your business travel - from booking to expenses, all with
            human-like understanding and precision.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Agent Profile */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative">
                  <Image
                    src={agent.avatar || "/placeholder.svg"}
                    alt={agent.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-medium text-white mb-2">{agent.name}</h3>
                  <p className="text-sm text-white/80 mb-3 font-inter leading-relaxed">{agent.tagline}</p>

                  <div className="flex items-center space-x-4 text-sm text-white/70 mb-4">
                    <div className="flex items-center">
                      <PiStarFill className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium text-white">{agent.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <PiCheckCircleBold className="w-4 h-4 text-green-400 mr-1" />
                      <span>{agent.completedTasks.toLocaleString()} tasks</span>
                    </div>
                    <div className="flex items-center">
                      <PiGlobeBold className="w-4 h-4 text-blue-400 mr-1" />
                      <span>{agent.languages.length} languages</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {agent.languages.slice(0, 3).map((lang, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-white/20 px-2 py-1 text-xs font-medium text-white"
                      >
                        {lang}
                      </span>
                    ))}
                    {agent.languages.length > 3 && (
                      <span className="inline-flex items-center rounded-lg bg-white/20 px-2 py-1 text-xs font-medium text-white">
                        +{agent.languages.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Capability Selector */}
              <div className="space-y-4">
                <h4 className="text-lg font-serif font-medium text-white">Multitasking Capabilities</h4>

                <div className="grid grid-cols-2 gap-2">
                  {capabilities.map((capability) => (
                    <button
                      key={capability.id}
                      onClick={() => setSelectedCapability(capability.id)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedCapability === capability.id
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/10 border border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <capability.icon className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white font-inter">{capability.title}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Capability Details */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCapability}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 ${selectedCap.color} rounded-lg flex items-center justify-center`}>
                        <selectedCap.icon className="w-4 h-4 text-white" />
                      </div>
                      <h5 className="text-lg font-serif font-medium text-white">{selectedCap.title}</h5>
                    </div>

                    <p className="text-sm text-white/80 mb-4 font-inter">{selectedCap.description}</p>

                    <div className="grid grid-cols-2 gap-2">
                      {selectedCap.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <PiCheckCircleBold className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-xs text-white/70 font-inter">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Live Demo */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
              <div className="inline-flex items-center rounded-xl bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white mb-4">
                Live Demo
              </div>

              <div className="relative rounded-xl overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-48 object-cover"
                  loop
                  muted
                  autoPlay
                  playsInline
                  poster="/agents/agent-sophia.jpeg"
                >
                  <source src="/videos/ai-agent-demo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <h3 className="text-xl font-serif font-medium text-white mb-2">AI in Action</h3>
              <p className="text-sm text-white/80 mb-4 font-inter">
                Watch Sofia handle multiple travel tasks simultaneously with human-like understanding and efficiency.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-inter">&lt; 3s</div>
                  <div className="text-xs text-white/70 font-inter">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-inter">99.8%</div>
                  <div className="text-xs text-white/70 font-inter">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-inter">24/7</div>
                  <div className="text-xs text-white/70 font-inter">Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-inter">4+</div>
                  <div className="text-xs text-white/70 font-inter">Simultaneous Tasks</div>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center font-inter">
                <PiChatCircleBold className="w-4 h-4 mr-2" />
                Start Working with Sofia
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
