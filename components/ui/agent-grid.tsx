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

  // Función para generar la grid de agentes
  const generateAgentGrid = () => {
    const grid = []
    const totalAgents = 200 // Número fijo para la densidad

    for (let i = 0; i < totalAgents; i++) {
      const agentIndex = i % agents.length
      const agent = agents[agentIndex]

      grid.push({
        id: `agent-${i}`, // ID único
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

  // Manejar selección de agente
  const handleAgentSelect = (agentId: string) => {
    if (onAgentSelect) {
      onAgentSelect(agentId)
    }
  }

  return (
    <div className="relative mb-6 px-0.5">
      {/* Grid fija de 12 columnas con tamaños responsivos */}
      <div className="grid grid-cols-12 gap-0.5 max-w-[360px] md:max-w-[480px] mx-auto">
        {agentGrid.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.001 }}
            className="aspect-square relative cursor-pointer max-w-[30px] md:max-w-[40px]"
            onClick={() => handleAgentSelect(agent.id)}
          >
            <AnimatePresence>
              {selectedAgent === agent.id && (
                <motion.div
                  className="absolute inset-0 rounded-sm z-10 pointer-events-none"
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
                    boxShadow: "0 0 8px 2px rgba(6, 95, 70, 0.2)",
                  }}
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0.5 rounded-sm overflow-hidden bg-gray-100">
              <Image
                src={agent.image || "/placeholder.svg"}
                alt="AI Travel Agent"
                fill
                className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 768px) 30px, 40px"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50/95 via-transparent to-transparent pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0) 30%, rgba(249, 250, 251, 0))",
        }}
      ></div>
    </div>
  )
}