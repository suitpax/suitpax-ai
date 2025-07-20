"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import AgentGrid from "../ui/agent-grid"

// Actualiza la lista de agentes para que coincidan con los de ai-travel-agents.tsx:
const agents = [
  {
    id: 1,
    name: "Luna",
    avatar: "/agents/agent-50.png",
    role: "AI Agent",
  },
  {
    id: 2,
    name: "Kahn",
    avatar: "/agents/agent-51.png",
    role: "AI Agent",
  },
  {
    id: 3,
    name: "Winter",
    avatar: "/agents/agent-52.png",
    role: "AI Agent",
  },
  {
    id: 4,
    name: "Sophia",
    avatar: "/agents/agent-53.png",
    role: "AI Agent",
  },
  {
    id: 5,
    name: "Zara",
    avatar: "/agents/agent-54.png",
    role: "AI Agent",
  },
  {
    id: 6,
    name: "Mia",
    avatar: "/agents/agent-55.png",
    role: "AI Agent",
  },
]

// Actualizar la lista de agentes para incluir los nuevos y evitar repeticiones
const travelAgents = [
  { id: 1, image: "/agents/agent-1.png" },
  { id: 2, image: "/agents/agent-2.png" },
  { id: 3, image: "/agents/agent-3.png" },
  { id: 4, image: "/agents/agent-4.png" },
  { id: 5, image: "/agents/agent-5.png" },
  { id: 6, image: "/agents/agent-6.png" },
  { id: 7, image: "/agents/agent-7.png" },
  { id: 8, image: "/agents/agent-8.png" },
  { id: 9, image: "/agents/agent-9.png" },
  { id: 10, image: "/agents/agent-10.png" },
  { id: 11, image: "/agents/agent-11.png" },
  { id: 12, image: "/agents/agent-12.png" },
  { id: 13, image: "/agents/agent-13.png" },
  { id: 14, image: "/agents/kahn-avatar.png" },
  { id: 15, image: "/agents/agent-15.png" },
  { id: 16, image: "/agents/agent-16.png" },
  { id: 17, image: "/agents/agent-17.png" },
  { id: 18, image: "/agents/agent-18.png" },
  { id: 19, image: "/agents/agent-19.png" },
  { id: 20, image: "/agents/agent-20.png" },
  { id: 21, image: "/agents/agent-21.png" },
  { id: 22, image: "/agents/agent-22.png" },
  { id: 23, image: "/agents/agent-23.png" },
  { id: 24, image: "/agents/agent-24.png" },
  { id: 25, image: "/agents/agent-25.png" },
  { id: 26, image: "/agents/agent-26.png" },
  { id: 27, image: "/agents/agent-27.png" },
  { id: 28, image: "/agents/agent-28.png" },
  { id: 29, image: "/agents/agent-29.png" },
  { id: 30, image: "/agents/agent-30.png" },
  { id: 31, image: "/agents/agent-31.png" },
  { id: 32, image: "/agents/agent-32.png" },
  { id: 33, image: "/agents/agent-33.png" },
  { id: 34, image: "/agents/agent-34.png" },
  { id: 35, image: "/agents/agent-35.png" },
  { id: 36, image: "/agents/agent-36.png" },
  { id: 37, image: "/agents/agent-37.png" },
  { id: 38, image: "/agents/agent-38.png" },
  { id: 39, image: "/agents/agent-39.png" },
  { id: 40, image: "/agents/agent-40.png" },
  { id: 41, image: "/agents/agent-41.png" },
  { id: 42, image: "/agents/agent-42.png" },
  { id: 43, image: "/agents/agent-43.png" },
  { id: 44, image: "/agents/agent-44.png" },
  { id: 45, image: "/agents/agent-45.png" },
  { id: 46, image: "/agents/agent-46.png" },
  { id: 47, image: "/agents/agent-47.png" },
  { id: 48, image: "/agents/agent-48.png" },
  { id: 49, image: "/agents/agent-49.png" },
  { id: 50, image: "/agents/agent-50.png" },
  { id: 51, image: "/agents/agent-51.png" },
  { id: 52, image: "/agents/agent-52.png" },
  { id: 53, image: "/agents/agent-53.png" },
  { id: 54, image: "/agents/agent-54.png" },
]

// Title variations focused on business travel revolution with MCP references
const titleVariations = [
  "Your business travel is about to change. Forever",
  "The way your company travels is about to be transformed. Forever",
  "Corporate travel is on the verge of a revolution. Forever",
  "How employees travel for business is about to change. Forever",
  "Traveltech reimagined. Forever",
  "AI Agents with MCP superpowers transforming business travel",
  "MCP-powered AI revolutionizing corporate travel management",
  "Supercharged AI Agents with Model Context Protocol",
  "Business travel reimagined with MCP intelligence",
  "The future of travel: AI Agents with MCP superpowers",
]

// Subtitle variations
const subtitleVariations = [
  "AI-powered travel management that transforms how companies of all sizes handle business trips",
  "Reimagining corporate travel with intelligent automation for startups and growing businesses",
  "Seamless integration between your company's workflow and travel management, from startups to enterprises",
  "Empowering teams with smarter, faster, and more efficient travel solutions, regardless of company size",
  "MCP-enhanced AI agents that understand travel needs for startups and scale-ups",
  "Model Context Protocol integration for unprecedented travel intelligence for businesses at any stage",
  "AI agents with contextual understanding designed for modern businesses, from bootstrapped to venture-backed",
  "Next-generation travel planning with MCP-enabled AI capabilities for companies at every growth stage",
]

export default function BusinessTravelRevolution() {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    // Select random title and subtitle
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    const subtitleIndex = Math.floor(Math.random() * subtitleVariations.length)
    setRandomSubtitle(subtitleVariations[subtitleIndex])
  }, [])

  // Function to handle agent selection
  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId === selectedAgent ? null : agentId)
  }

  return (
    <div className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Technology
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Coming Q2 2025
            </span>
          </div>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {randomTitle}
          </motion.h2>

          {/* Añadir indicación llamativa de lanzamiento */}
          <motion.div
            className="mt-6 mb-4 inline-flex items-center bg-black text-white px-6 py-2 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg font-semibold tracking-tighter mr-2">LAUNCHING Q2 2025</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </motion.div>

          <motion.p
            className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {randomSubtitle}
          </motion.p>

          <motion.p
            className="mt-2 text-xs font-light text-gray-500 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Reimagining the future of corporate travel with AI-powered solutions that adapt to your unique business
            needs
          </motion.p>
        </div>

        {/* Usar el componente AgentGrid en lugar del código inline */}
        <AgentGrid agents={travelAgents} selectedAgent={selectedAgent} onAgentSelect={handleAgentSelect} />

        <div className="flex justify-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            <Link
              href="https://accounts.suitpax.com/sign-up"
              className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg w-full sm:w-auto min-w-[220px] transition-colors relative group overflow-hidden"
            >
              <span className="relative z-10">Pre-register</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-300 via-white to-sky-300 opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500 animate-flow-slow"></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
