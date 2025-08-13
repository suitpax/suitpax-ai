"use client"

import { NumberFlow } from "@number-flow/react"
import { cn } from "@/lib/utils"

interface NumberFlowProps {
  value: number
  className?: string
  format?: {
    style?: "decimal" | "currency" | "percent"
    currency?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
  prefix?: string
  suffix?: string
  animated?: boolean
  trend?: "up" | "down" | "neutral"
  showTrend?: boolean
}

export function AnimatedNumber({
  value,
  className,
  format,
  prefix = "",
  suffix = "",
  animated = true,
  trend = "neutral",
  showTrend = false,
  ...props
}: NumberFlowProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }

  return (
    <div className="flex items-center gap-2">
      <NumberFlow
        value={value}
        format={format}
        prefix={prefix}
        suffix={suffix}
        animated={animated}
        className={cn("font-medium tabular-nums", className)}
        {...props}
      />
      {showTrend && (
        <div className={cn("text-xs font-medium", trendColors[trend])}>
          {trend === "up" && "↗"}
          {trend === "down" && "↘"}
          {trend === "neutral" && "→"}
        </div>
      )}
    </div>
  )
}

export { NumberFlow }
