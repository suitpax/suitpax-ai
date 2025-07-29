"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiStarFill } from "react-icons/pi"
import { Badge } from "@/components/ui/badge"

interface Agent {
  id: string
  name: string
  role: string
  image: string
  rating: number
  callsToday?: number
  languages?: string[]
  specialty: string
  accent?: string
  voice?: string
  status: "available" | "busy" | "offline"
}

interface AgentCardProps {
  agent: Agent
  onSelect?: (agent: Agent) => void
  isSelected?: boolean
  size?: "sm" | "default" | "lg"
  showDetails?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500"
    case "busy":
      return "bg-orange-500"
    case "offline":
      return "bg-gray-500"
    default:
      return "bg-gray-400"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Available"
    case "busy":
      return "Busy"
    case "offline":
      return "Offline"
    default:
      return "Unknown"
  }
}

export function AgentCard({
  agent,
  onSelect,
  isSelected = false,
  size = "default",
  showDetails = true,
}: AgentCardProps) {
  const sizeClasses = {
    sm: "p-3",
    default: "p-4",
    lg: "p-6",
  }

  const imageSize = {
    sm: 32,
    default: 40,
    lg: 56,
  }

  return (
    <motion.div
      onClick={() => onSelect?.(agent)}
      className={`${sizeClasses[size]} rounded-xl border cursor-pointer transition-all ${
        isSelected ? "bg-gray-50 border-gray-300 shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Image
            src={agent.image || "/placeholder.svg"}
            alt={agent.name}
            width={imageSize[size]}
            height={imageSize[size]}
            className="rounded-xl object-cover"
          />
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-white`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium text-black truncate ${
              size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
            }`}
          >
            {agent.name}
          </p>
          <div className="flex items-center gap-1">
            <PiStarFill className={`text-yellow-500 ${size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
            <span className={`text-gray-600 ${size === "sm" ? "text-xs" : "text-xs"}`}>{agent.rating}</span>
          </div>
        </div>
        {size !== "sm" && (
          <Badge
            variant="outline"
            className={`text-xs ${
              agent.status === "available"
                ? "bg-green-50 text-green-700 border-green-200"
                : agent.status === "busy"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {getStatusText(agent.status)}
          </Badge>
        )}
      </div>

      <p className={`text-gray-600 mb-2 ${size === "sm" ? "text-xs" : "text-xs"}`}>{agent.role}</p>

      {showDetails && (
        <>
          <p className={`text-gray-500 mb-3 line-clamp-1 ${size === "sm" ? "text-xs" : "text-xs"}`}>
            {agent.specialty}
          </p>

          <div className="space-y-2">
            {agent.accent && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Voice:</span>
                <span className="text-gray-700">{agent.accent}</span>
              </div>
            )}
            {agent.callsToday !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Calls today:</span>
                <span className="text-gray-700 font-medium">{agent.callsToday}</span>
              </div>
            )}
            {agent.languages && agent.languages.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {agent.languages.slice(0, 2).map((lang) => (
                  <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">
                    {lang}
                  </span>
                ))}
                {agent.languages.length > 2 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{agent.languages.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}

export default AgentCard
