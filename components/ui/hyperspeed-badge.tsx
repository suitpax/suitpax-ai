"use client"

import { motion } from "framer-motion"

export default function HyperspeedBadge() {
  return (
    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-1 text-[10px] font-medium">
      <img src="/logo/suitpax-bl-logo.webp" alt="Suitpax" className="h-4 w-auto" />
      <span className="text-gray-900">Hyperspeed Flights</span>
    </motion.span>
  )
}

