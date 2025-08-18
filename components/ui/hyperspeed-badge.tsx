"use client"

import { motion } from "framer-motion"

export default function HyperspeedBadge() {
  return (
    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-1 text-[10px] font-medium">
      <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white border border-gray-200">
        <img src="/logo/suitpax-symbol.webp" alt="Suitpax" className="h-3.5 w-3.5" />
      </span>
      <span className="text-gray-900">Hyperspeed Flights</span>
    </motion.span>
  )
}

