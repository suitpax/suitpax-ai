"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FeatureHighlightProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  variant?: "default" | "premium" | "enterprise"
  className?: string
}

export default function FeatureHighlight({
  icon: Icon,
  title,
  description,
  badge,
  variant = "default",
  className,
}: FeatureHighlightProps) {
  const variants = {
    default: {
      container: "bg-white border-gray-200",
      icon: "text-gray-600 bg-gray-50",
      title: "text-black",
      description: "text-gray-600",
    },
    premium: {
      container: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
      icon: "text-emerald-700 bg-emerald-100",
      title: "text-emerald-900",
      description: "text-emerald-700",
    },
    enterprise: {
      container: "bg-gradient-to-br from-gray-900 to-black border-gray-700",
      icon: "text-white bg-gray-800",
      title: "text-white",
      description: "text-gray-300",
    },
  }

  const variantStyles = variants[variant]

  return (
    <motion.div
      className={cn("relative p-4 rounded-xl border shadow-sm", variantStyles.container, className)}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {badge && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center rounded-full bg-emerald-950 px-2 py-0.5 text-[9px] font-medium text-white">
            {badge}
          </span>
        </div>
      )}

      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", variantStyles.icon)}>
        <Icon className="w-5 h-5" />
      </div>

      <h3 className={cn("text-sm font-medium mb-1", variantStyles.title)}>{title}</h3>

      <p className={cn("text-xs leading-relaxed", variantStyles.description)}>{description}</p>
    </motion.div>
  )
}
