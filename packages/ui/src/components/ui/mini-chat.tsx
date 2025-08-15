"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const MiniChat = () => {
  const [placeholderText, setPlaceholderText] = useState([
    "AI-powered business travel management",
    "Seamless NDC flight booking experience",
    "Expense management with AI automation",
    "Smart corporate travel policy compliance",
    "AI travel agents with superpowers",
    "Real-time travel analytics dashboard",
    "Unified business travel platform",
    "Direct API connections with airlines",
    "Automated expense reconciliation",
    "Corporate travel policy enforcement",
    "Personalized business travel experience",
    "Sustainable business travel options",
    "Integrated travel & expense management",
  ])

  const [agents, setAgents] = useState([
    { id: 10, name: "Maya" },
    { id: 5, name: "Zara" },
    { id: 8, name: "Kai" },
    { id: 40, name: "Nova" },
    { id: 22, name: "Leo" },
    { id: 33, name: "Aria" },
    { id: 42, name: "Finn" },
  ])

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Get random indices on initial load
    const randomTextIndex = Math.floor(Math.random() * placeholderText.length)
    const randomAgentIndex = Math.floor(Math.random() * agents.length)

    setCurrentPlaceholderIndex(randomTextIndex)
    setCurrentAgentIndex(randomAgentIndex)
  }, [placeholderText.length, agents.length])

  const currentAgent = agents[currentAgentIndex]

  return (
    <motion.div
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gray-100/80 backdrop-blur-lg border border-gray-200 text-[10px] font-medium text-black w-auto max-w-[320px] shadow-sm"
      whileHover={{ scale: 1.05, boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-9 h-9 overflow-hidden rounded-xl border border-gray-300 ml-0.5"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={`/agents/agent-${currentAgent.id}.png`}
          alt={`${currentAgent.name} AI Agent`}
          width={64}
          height={64}
          className="w-full h-full object-cover object-center"
        />
      </motion.div>
      <motion.div className="flex-1 py-0.5 px-1.5 text-[10px] font-medium text-black h-9 flex items-center overflow-hidden">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {placeholderText[currentPlaceholderIndex]}
        </span>
      </motion.div>
      <motion.div
        animate={isHovered ? { x: 2, opacity: 1 } : { x: 0, opacity: 0.7 }}
        className="flex items-center justify-center"
      >
        <ArrowRight className="h-4 w-4 text-black" />
      </motion.div>

      {/* Pulse effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gray-200"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      )}
    </motion.div>
  )
}

export default MiniChat
