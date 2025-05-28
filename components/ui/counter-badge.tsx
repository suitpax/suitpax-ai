"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface CounterBadgeProps {
  className?: string
  variant?: "light" | "dark"
}

export default function CounterBadge({ className = "", variant = "light" }: CounterBadgeProps) {
  const [count, setCount] = useState(587)

  useEffect(() => {
    // Calculate how many days have passed since October 20, 2023
    const startDate = new Date(2023, 9, 20) // October 20, 2023 (month is 0-indexed)
    const currentDate = new Date()
    const daysDiff = Math.max(0, (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.floor(daysDiff)

    // Set the count to 587 days
    setCount(587)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 backdrop-blur-sm bg-black/80 border border-white/10 rounded-full text-white text-[9px] ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
      </span>
      <span className="whitespace-nowrap">{count} days building the next-gen of traveltech</span>
    </motion.div>
  )
}
