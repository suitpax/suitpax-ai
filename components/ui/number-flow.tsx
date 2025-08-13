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
}

export function AnimatedNumber({
  value,
  className,
  format,
  prefix = "",
  suffix = "",
  animated = true,
  ...props
}: NumberFlowProps) {
  return (
    <NumberFlow
      value={value}
      format={format}
      prefix={prefix}
      suffix={suffix}
      animated={animated}
      className={cn("font-medium tabular-nums", className)}
      {...props}
    />
  )
}

export { NumberFlow }
