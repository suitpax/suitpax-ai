"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: "up" | "down" | "neutral"
  prefix?: string
  suffix?: string
  className?: string
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel,
  trend,
  prefix,
  suffix,
  className,
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-emerald-600" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-600" />
      default:
        return <Minus className="w-3 h-3 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-400"
    }
  }

  return (
    <motion.div
      className={cn("bg-white border border-gray-200 rounded-xl p-4 shadow-sm", className)}
      whileHover={{ y: -1, boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-600">{title}</h3>
        {trend && getTrendIcon()}
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
        <span className="text-2xl font-bold text-black">{value}</span>
        {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1">
          <span className={cn("text-xs font-medium", getTrendColor())}>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          {changeLabel && <span className="text-xs text-gray-500">{changeLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}
