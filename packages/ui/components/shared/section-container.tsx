"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  background?: "white" | "gray" | "gradient" | "dark"
  padding?: "sm" | "md" | "lg" | "xl"
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  animate?: boolean
}

export default function SectionContainer({
  children,
  className,
  background = "white",
  padding = "lg",
  maxWidth = "xl",
  animate = true,
}: SectionContainerProps) {
  const backgrounds = {
    white: "bg-white",
    gray: "bg-gray-50",
    gradient: "bg-gradient-to-b from-gray-50 to-white",
    dark: "bg-black",
  }

  const paddings = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
  }

  const maxWidths = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-8xl",
    full: "max-w-full",
  }

  const content = (
    <section className={cn(backgrounds[background], paddings[padding], className)}>
      <div className={cn("container mx-auto px-4 md:px-6", maxWidths[maxWidth])}>{children}</div>
    </section>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {content}
    </motion.div>
  )
}
