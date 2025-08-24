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
      className="relative flex items-center gap-3 sm:gap-4 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/55 backdrop-blur-2xl border border-gray-200/70 text-[11px] sm:text-[12px] font-medium text-black w-full max-w-none"
      whileHover={{ scale: 1.02, boxShadow: "0 6px 18px -4px rgba(0, 0, 0, 0.12)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-10 h-10 sm:w-11 sm:h-11 overflow-hidden rounded-xl border border-gray-300 ml-0.5 shadow-sm"
        animate={isHovered ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={`/agents/agent-ruby.png`}
          alt={`Ruby AI Agent`}
          width={88}
          height={88}
          className="w-full h-full object-cover object-center"
        />
      </motion.div>
      <motion.div className="flex-1 py-0.5 px-1.5 sm:px-2 text-[11px] sm:text-[12px] font-medium text-black h-10 sm:h-11 flex items-center overflow-hidden min-w-0">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {placeholderText[currentPlaceholderIndex]}
        </span>
      </motion.div>
      <motion.div
        animate={isHovered ? { x: 2, opacity: 1 } : { x: 0, opacity: 0.8 }}
        className="flex items-center justify-center pr-0.5"
      >
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      )}
    </motion.div>
  )
}

export default MiniChat
