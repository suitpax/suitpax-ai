"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  variant?: "default" | "minimal" | "detailed"
  className?: string
}

export default function ProgressIndicator({
  steps,
  currentStep,
  variant = "default",
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {variant === "minimal" ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <motion.div
              className="bg-emerald-950 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                  index <= currentStep
                    ? "bg-emerald-950 border-emerald-950 text-white"
                    : "bg-white border-gray-300 text-gray-400",
                )}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === currentStep ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {index + 1}
              </motion.div>
              {variant === "detailed" && (
                <span
                  className={cn(
                    "text-xs mt-2 text-center max-w-20",
                    index <= currentStep ? "text-emerald-950 font-medium" : "text-gray-400",
                  )}
                >
                  {step}
                </span>
              )}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute h-0.5 w-16 mt-4 -ml-8 transition-colors",
                    index < currentStep ? "bg-emerald-950" : "bg-gray-300",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
