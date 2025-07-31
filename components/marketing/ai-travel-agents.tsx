"use client"

import { useEffect } from "react"

import { useState } from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiSparkle } from "react-icons/pi"

// Actualizar el array de titleVariations para incluir los títulos específicos solicitados
const titleVariations = [
  "MCP-powered AI Agents for next-gen travel",
  "AI Agents with MCP superpowers",
  "Business travel transformed with MCP technology",
  "AI Agents revolutionizing business travel",
  "AI Agents with superhuman travel capabilities",
  "AI Agents that transform how you travel",
  "AI Agents: The ultimate travel powerhouse",
  "AI Agents unleashing travel potential",
  "Contextually-aware AI Agents with MCP technology",
  "Supercharged travel agents with MCP intelligence",
]

// Subtítulos
const subtitles = [
  "Designed to make your journey seamless, personalized, and efficient",
  "Handling the complexities of travel so you can focus on what matters",
  "Intelligent assistance that adapts to your unique travel preferences",
  "Transforming business travel with cutting-edge AI technology",
  "Leveraging MCP technology for unprecedented contextual understanding",
  "AI agents that maintain context across your entire travel journey",
  "Enhanced with Model Context Protocol for superior travel intelligence",
  "Next-generation AI with MCP capabilities for smarter travel planning",
]

// Actualizar la lista de agentes para incluir los nuevos con sus roles específicos:

const agents = [
  { name: "Marcus", role: "Flight Specialist", image: "/agents/agent-marcus.jpeg" },
  { name: "Sophia", role: "Hotel Expert", image: "/agents/agent-sophia.jpeg" },
  { name: "Emma", role: "Policy Manager", image: "/agents/agent-emma.jpeg" },
  { name: "Alex", role: "Expense Analyst", image: "/agents/agent-alex.jpeg" },
  { name: "Zara", role: "Travel Coordinator", image: "/agents/agent-zara.jpeg" },
  { name: "Luna", role: "Risk Assessor", image: "/agents/agent-luna-new.png" },
  { name: "Kai", role: "Itinerary Planner", image: "/agents/agent-kai-new.png" },
  { name: "Nova", role: "Budget Optimizer", image: "/agents/agent-nova.jpeg" },
  { name: "Aria", role: "Compliance Officer", image: "/agents/agent-aria.jpeg" },
  { name: "Sage", role: "Data Analyst", image: "/agents/agent-sage.jpeg" },
]

// Mini badges para categorías de viajes de negocios
const travelCategories = [
  "Business Travel",
  "Automated Travel Policies",
  "Expense Management",
  "Corporate Rates",
  "Team Travel",
  "Duty of Care",
  "Travel Analytics",
  "Sustainability",
  "Airport VIP Lounge",
  "Group Bookings",
  "24/7 Support",
  "Travel Risk Management",
]

export const AITravelAgents = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])
  }, [])

  return (
    <section className="pt-12 pb-6 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            <PiSparkle className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">Launching Q3 2025</em>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-6">{randomSubtitle}</p>

          {/* Agents Grid - 2 rows of 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 overflow-hidden rounded-2xl">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm sm:text-base font-medium tracking-tighter text-black mb-1">{agent.name}</h3>
                    <p className="text-xs font-medium text-gray-500">{agent.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-12"
          >
            <p className="text-sm font-light text-gray-600 mb-6">
              <em className="font-serif italic">Ready to experience the future of business travel?</em>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight">
                Join Waitlist
              </button>
              <button className="px-6 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 text-black font-medium rounded-xl hover:bg-white transition-colors tracking-tight">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AITravelAgents
