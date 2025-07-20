"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface QuickActionButtonProps {
  icon: LucideIcon
  label: string
  description?: string
  onClick?: () => void
  variant?: "default" | "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

export default function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
  size = "md",
  disabled = false,
  className,
}: QuickActionButtonProps) {
  const variants = {
    default: "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
    primary: "bg-black border-black text-white hover:bg-gray-800",
    secondary: "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200",
  }

  const sizes = {
    sm: { container: "p-2", icon: "w-4 h-4", text: "text-xs" },
    md: { container: "p-3", icon: "w-5 h-5", text: "text-sm" },
    lg: { container: "p-4", icon: "w-6 h-6", text: "text-base" },
  }

  const sizeConfig = sizes[size]

  return (
    <motion.button
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizeConfig.container,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -1, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
    >
      <Icon className={cn("mb-1", sizeConfig.icon)} />
      <span className={cn("font-medium", sizeConfig.text)}>{label}</span>
      {description && <span className="text-[10px] text-gray-500 mt-0.5 text-center">{description}</span>}
    </motion.button>
  )
}
