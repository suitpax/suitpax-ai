"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiStarFill, PiChatCircleFill } from "react-icons/pi"
import { Badge } from "@/components/ui/badge"

interface Agent {
  id: string
  name: string
  role: string
  image: string
  rating: number
  callsToday: number
  languages: string[]
  specialty: string
  accent: string
  voice: string
  status: "available" | "busy" | "offline"
}

interface AgentCardProps {
  agent: Agent
  onSelect: (agent: Agent) => void
  isSelected: boolean
  showDetails?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-400"
    case "busy":
      return "bg-orange-400"
    case "offline":
      return "bg-gray-400"
    default:
      return "bg-gray-300"
  }
}

export function AgentCard({ agent, onSelect, isSelected, showDetails = false }: AgentCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(agent)}
      className={`w-full p-4 rounded-xl border transition-all text-left ${
        isSelected
          ? "bg-gray-50 border-gray-300 shadow-md"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <Image
            src={agent.image || "/placeholder.svg"}
            alt={agent.name}
            width={48}
            height={48}
            className="rounded-xl object-cover"
          />
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(
              agent.status,
            )} rounded-full border-2 border-white`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
          <p className="text-sm text-gray-600 truncate">{agent.role}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <PiStarFill className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-600">{agent.rating}</span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <PiChatCircleFill className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{agent.callsToday}</span>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 line-clamp-2">{agent.specialty}</p>

          <div className="flex flex-wrap gap-1">
            {agent.languages.slice(0, 2).map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
            {agent.languages.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{agent.languages.length - 2}
              </Badge>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Voice:</span> {agent.voice}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium">Accent:</span> {agent.accent}
            </p>
          </div>
        </div>
      )}
    </motion.button>
  )
}
