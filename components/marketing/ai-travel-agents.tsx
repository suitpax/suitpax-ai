"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import AIChat from "@/components/ui/ai-chat"

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
  {
    id: 1,
    name: "Luna",
    avatar: "/agents/agent-12.png",
    role: "AI Agent",
    description: "Coordinates travel for corporate and sports teams with personalized itineraries.",
  },
  {
    id: 2,
    name: "Kahn",
    avatar: "/agents/kahn-avatar.png",
    role: "AI Agent",
    description: "Organizes and prioritizes travel-related tasks to maximize productivity.",
  },
  {
    id: 3,
    name: "Winter",
    avatar: "/agents/agent-52.png",
    role: "AI Agent",
    description: "Manages membership programs and exclusive benefits for frequent travelers.",
  },
  {
    id: 4,
    name: "Sophia",
    avatar: "/agents/agent-17.png",
    role: "AI Agent",
    description: "Creates personalized luxury travel experiences for executives.",
  },
  {
    id: 5,
    name: "Zara",
    avatar: "/agents/agent-21.png",
    role: "AI Agent",
    description: "Designs eco-friendly itineraries minimizing carbon footprint.",
  },
  {
    id: 6,
    name: "Nova",
    avatar: "/agents/agent-36.png",
    role: "AI Agent",
    description: "Specializes in seamless travel experiences with cutting-edge technology integration.",
  },
  {
    id: 7,
    name: "Lily",
    avatar: "/agents/agent-56.png",
    role: "AI Agent",
    description: "Organizes adventure experiences and extreme sports for intrepid travelers.",
  },
  {
    id: 8,
    name: "Alex",
    avatar: "/agents/agent-8.png",
    role: "AI Agent",
    description: "Leverages AI to predict travel needs and provide proactive solutions.",
  },
  {
    id: 9,
    name: "Kia",
    avatar: "/agents/agent-9.png",
    role: "AI Agent",
    description: "Streamlines corporate travel processes for maximum efficiency and cost savings.",
  },
  {
    id: 10,
    name: "Jasmine",
    avatar: "/agents/agent-38.png",
    role: "AI Agent",
    description: "Analyzes travel patterns to provide data-driven recommendations for businesses.",
  },
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
  const [activeAgent, setActiveAgent] = useState(7)

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])

    // Cycle through agents automatically for demo effect
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev % agents.length) + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="pt-12 pb-6 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              Introducing Suitpax AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Q3 2025
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-6">{randomSubtitle}</p>

          {/* AI Chat Interface - Moved here */}
          <div className="max-w-2xl w-full mx-auto mb-12">
            <AIChat />
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto mb-16">
          {/* Arcade-style agent selection with flow effect */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden min-h-[350px]">
            {/* Flow effect background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-1 bg-gray-200/40 blur-xl"></div>
              <motion.div
                className="absolute top-0 left-0 w-full h-60 bg-gray-200/30"
                animate={{
                  y: [0, 100, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-full h-40 bg-gray-200/20"
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.3, 1],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-3xl font-medium text-left tracking-tighter text-black mb-4 leading-none">
                Groundbreaking AI Agents with MCP superpowers
              </h3>
              <p className="text-lg font-medium text-gray-700 tracking-tighter mb-4">
                Transforming business travel with Model Context Protocol for enhanced intelligence
              </p>

              <p className="text-sm text-gray-600 mb-8 max-w-md">
                Designed to revolutionize your business travel experience with MCP-powered contextual understanding,
                personalized recommendations, and seamless journey orchestration
              </p>

              {/* Agent grid with arcade-style selection - updated to show 2 rows of 5 agents */}
              <div className="grid grid-cols-5 gap-3 md:gap-4 mb-6">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    className={`flex flex-col items-center cursor-pointer relative group ${
                      activeAgent === agent.id ? "scale-105" : ""
                    }`}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => setActiveAgent(agent.id)}
                  >
                    <div className="relative mb-2">
                      {/* Highlight effect for active agent */}
                      {activeAgent === agent.id && (
                        <motion.div
                          className="absolute -inset-2 rounded-2xl bg-emerald-950/10 shadow-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.4 }}
                          layoutId="highlight"
                        />
                      )}

                      {/* Flow effect for active agent */}
                      {activeAgent === agent.id && (
                        <motion.div
                          className="absolute -inset-4 rounded-2xl bg-gray-200/50 -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [0.9, 1.2, 0.9],
                            rotate: [0, 3, 0, -3, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <div
                        className={`relative w-14 h-14 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                          activeAgent === agent.id
                            ? "border-emerald-950/40 shadow-xl transform scale-110"
                            : "border-gray-200 group-hover:border-gray-300 group-hover:shadow-md"
                        }`}
                      >
                        <Image
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <h3
                      className={`text-[11px] font-medium mb-0.5 text-center w-full transition-colors ${
                        activeAgent === agent.id ? "text-emerald-950" : "text-gray-700 group-hover:text-black"
                      }`}
                    >
                      {agent.name}
                    </h3>
                    <p className="text-[9px] text-gray-500 text-center w-full">{agent.role}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mini badges para categorías de viajes de negocios - Estilo actualizado para coincidir con AI Chat */}
              <div className="flex flex-wrap gap-2 justify-center">
                {travelCategories.map((category, index) => (
                  <motion.span
                    key={index}
                    className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black cursor-pointer hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.span>
                ))}
              </div>

              {/* Destacar algunas categorías con colores especiales */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <motion.span
                  className="inline-flex items-center rounded-xl border border-emerald-950/30 bg-emerald-950/5 px-2 py-0.5 text-[10px] font-medium text-emerald-950 cursor-pointer hover:bg-emerald-950/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 mr-1"></span>
                  MCP-Powered Intelligence
                </motion.span>
                <motion.span
                  className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black cursor-pointer hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
                  Contextual Understanding
                </motion.span>
                <motion.span
                  className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black cursor-pointer hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black mr-1"></span>
                  Model Context Protocol
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AITravelAgents
