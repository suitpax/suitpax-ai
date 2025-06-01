"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "online" | "offline" | "busy" | "away"
  text?: string
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

export default function StatusBadge({ status, text, size = "md", animated = true, className }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: "bg-emerald-500", text: text || "Online" },
    offline: { color: "bg-gray-400", text: text || "Offline" },
    busy: { color: "bg-red-500", text: text || "Busy" },
    away: { color: "bg-yellow-500", text: text || "Away" },
  }

  const sizeClasses = {
    sm: { dot: "w-1.5 h-1.5", text: "text-[9px]", padding: "px-2 py-0.5" },
    md: { dot: "w-2 h-2", text: "text-[10px]", padding: "px-2.5 py-0.5" },
    lg: { dot: "w-2.5 h-2.5", text: "text-xs", padding: "px-3 py-1" },
  }

  const config = statusConfig[status]
  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-black/10 border border-gray-200",
        sizes.padding,
        className,
      )}
    >
      <motion.div
        className={cn("rounded-full mr-1.5", config.color, sizes.dot)}
        animate={animated && status === "online" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
      <span className={cn("font-medium text-gray-700", sizes.text)}>{config.text}</span>
    </div>
  )
}
