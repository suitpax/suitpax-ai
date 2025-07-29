"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const agents = [
  {
    id: 1,
    name: "Sophia",
    role: "Travel Specialist",
    thumbnail: "/agents/agent-sophia.jpeg",
    description: "Expert in complex itinerary planning and business travel optimization.",
  },
  {
    id: 2,
    name: "Marcus",
    role: "Expense Manager",
    thumbnail: "/agents/agent-marcus.jpeg",
    description: "Specialized in expense tracking, policy compliance, and budget optimization.",
  },
  {
    id: 3,
    name: "Emma",
    role: "Policy Advisor",
    thumbnail: "/agents/agent-emma.jpeg",
    description: "Ensures all travel bookings align with your company's policies and guidelines.",
  },
  {
    id: 4,
    name: "Alex",
    role: "Booking Assistant",
    thumbnail: "/agents/agent-alex.jpeg",
    description: "Handles all flight, hotel, and car rental bookings with speed and precision.",
  },
]

export default function AITravelAgents() {
  const [activeAgent, setActiveAgent] = useState(agents[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((currentAgent) => {
        const currentIndex = agents.findIndex((a) => a.id === currentAgent.id)
        return agents[(currentIndex + 1) % agents.length]
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 mb-4">
            AI Travel Agents
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-4">
            Meet Your AI Travel Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI agents work 24/7 to handle your business travel needs with human-like intelligence and efficiency.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Agent List */}
          <div className="lg:col-span-2 space-y-4">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                onClick={() => setActiveAgent(agent)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeAgent.id === agent.id
                    ? "border-black bg-gray-50 scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                whileHover={{ scale: activeAgent.id === agent.id ? 1.05 : 1.02 }}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={agent.thumbnail || "/placeholder.svg"}
                    alt={agent.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Agent Display */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeAgent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
            >
              <Image
                src={activeAgent.thumbnail || "/placeholder.svg"}
                alt={activeAgent.name}
                layout="fill"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold tracking-tighter mb-2">{activeAgent.name}</h3>
                <p className="text-lg text-gray-200">{activeAgent.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
