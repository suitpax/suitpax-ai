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
    const totalAgents = 130 // Puedes ajustar este número si es necesario

    for (let i = 0; i < totalAgents; i++) {
      // Use modulo to ensure even distribution of all agent images
      const agentIndex = i % agents.length
      const agent = agents[agentIndex]

      grid.push({
        id: `agent-${i}`, // Asegurar IDs únicos si se repiten agentes
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
  }, [agents]) // Dependencia en agents para regenerar si cambian

  // Function to handle agent selection
  const handleAgentSelect = (agentId: string) => {
    if (onAgentSelect) {
      onAgentSelect(agentId)
    }
  }

  return (
    <div className="relative mb-8 px-0.5">
      {" "}
      {/* Reducido mb de mb-12 a mb-8 */}
      {/* Ajuste de columnas: menos columnas en pantallas grandes para que los agentes sean más grandes */}
      <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-10 xl:grid-cols-12 gap-0.5">
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
                  className="absolute inset-0 rounded-md z-10 pointer-events-none" // Redondeo más sutil
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY, // Corregido de Infinity a Number.POSITIVE_INFINITY
                    ease: "easeInOut",
                  }}
                  style={{
                    background: "rgba(6, 95, 70, 0.3)", // emerald-950 con opacidad
                    boxShadow: "0 0 12px 3px rgba(6, 95, 70, 0.2)", // Sombra sutil emerald-950
                  }}
                />
              )}
            </AnimatePresence>
            {/* Ajuste del inset para que la imagen ocupe más espacio, similar a móvil */}
            <div className="absolute inset-[10%] sm:inset-[12%] md:inset-[15%] lg:inset-[10%] xl:inset-[12%] rounded-md overflow-hidden bg-gray-100">
              <Image
                src={agent.image || "/placeholder.svg"}
                alt="AI Travel Agent"
                fill
                className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 640px) 30px, (max-width: 768px) 35px, (max-width: 1024px) 40px, 45px" // Tamaños ajustados para ser más grandes
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50/95 via-transparent to-transparent pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0) 40%, rgba(249, 250, 251, 0))", // Ajustado para que el gradiente sea más sutil
        }}
      ></div>
    </div>
  )
}
