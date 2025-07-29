"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

// Types for component props
interface AgentGridProps {
  agents: Array<{
    id: number
    image: string
  }>
  onAgentSelect?: (agentId: string) => void
  selectedAgent?: string | null
}

export default function AgentGrid({ agents, onAgentSelect, selectedAgent }: AgentGridProps) {
  const [agentGrid, setAgentGrid] = useState<any[]>([])

  // Function to generate the agent grid
  const generateAgentGrid = () => {
    const grid = []
    // Reduce for mobile - fewer agents on smaller screens
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    const totalAgents = isMobile ? 60 : 120 // Less agents on mobile

    for (let i = 0; i < totalAgents; i++) {
      // Use modulo to ensure even distribution of all agent images
      const agentIndex = i % agents.length
      const agent = agents[agentIndex]

      grid.push({
        id: `agent-${i}`, // Ensure unique IDs if agents repeat
        image: agent.image,
      })
    }
    return grid
  }

  useEffect(() => {
    setAgentGrid(generateAgentGrid())

    const handleResize = () => {
      setAgentGrid(generateAgentGrid())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [agents]) // Dependency on agents to regenerate if they change

  // Function to handle agent selection
  const handleAgentSelect = (agentId: string) => {
    if (onAgentSelect) {
      onAgentSelect(agentId)
    }
  }

  return (
    <div className="relative mb-6 px-0.5">
      {/* Responsive grid with fewer columns on mobile */}
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-16 xl:grid-cols-18 gap-1">
        {agentGrid.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.001 }}
            className="aspect-square relative cursor-pointer"
            onClick={() => handleAgentSelect(agent.id)}
          >
            <AnimatePresence>
              {selectedAgent === agent.id && (
                <motion.div
                  className="absolute inset-0 rounded-full z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.2)",
                  }}
                />
              )}
            </AnimatePresence>
            {/* Circular bubble style like Grok */}
            <div className="absolute inset-1 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={agent.image || "/placeholder.svg"}
                alt="AI Travel Agent"
                fill
                className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 768px) 20px, 24px"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0))",
        }}
      ></div>
    </div>
  )
}
