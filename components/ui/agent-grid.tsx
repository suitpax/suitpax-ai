"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

// Tipos para las props del componente
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
    // Usar un número consistente de agentes en todas las pantallas
    const totalAgents = 130

    for (let i = 0; i < totalAgents; i++) {
      // Use modulo to ensure even distribution of all agent images
      const agentIndex = i % agents.length
      const agent = agents[agentIndex]

      grid.push({
        id: `agent-${i}`,
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
  }, [agents])

  // Function to handle agent selection
  const handleAgentSelect = (agentId: string) => {
    if (onAgentSelect) {
      onAgentSelect(agentId)
    }
  }

  return (
    <div className="relative mb-8 px-0.5">
      <div className="grid grid-cols-12 sm:grid-cols-14 md:grid-cols-16 lg:grid-cols-18 xl:grid-cols-20 gap-0.5">
        {agentGrid.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.003 }}
            className="aspect-square relative cursor-pointer"
            onClick={() => handleAgentSelect(agent.id)}
          >
            <AnimatePresence>
              {selectedAgent === agent.id && (
                <motion.div
                  className="absolute inset-0 rounded-md z-10 pointer-events-none"
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
                    background: "rgba(6, 95, 70, 0.3)",
                    boxShadow: "0 0 12px 3px rgba(6, 95, 70, 0.2)",
                  }}
                />
              )}
            </AnimatePresence>

            <div className="absolute inset-[15%] rounded-md overflow-hidden bg-gray-100">
              <Image
                src={agent.image || "/placeholder.svg"}
                alt="AI Travel Agent"
                fill
                className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 640px) 20px, (max-width: 768px) 18px, (max-width: 1024px) 16px, 14px"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50/95 via-transparent to-transparent pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0) 40%, rgba(249, 250, 251, 0))",
        }}
      ></div>
    </div>
  )
}