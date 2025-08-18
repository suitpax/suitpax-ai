"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import PartnersShowcase from "@/components/partners-showcase"

interface AirlinesSliderProps {
  title?: string
  className?: string
}

const AIRLINE_LOGOS = [
  { name: "Cathay Pacific", url: "https://cdn.brandfetch.io/cathaypacific.com/w/512/h/72/logo" },
  { name: "Transavia", url: "https://cdn.brandfetch.io/transavia.com/w/512/h/92/logo" },
  { name: "Air France", url: "https://cdn.brandfetch.io/airfrance.com/w/512/h/49/logo" },
  { name: "Jet2", url: "https://cdn.brandfetch.io/jet2.com/w/512/h/175/logo" },
  { name: "Vueling", url: "https://cdn.brandfetch.io/vueling.com/w/512/h/169/logo" },
  { name: "KLM", url: "https://cdn.brandfetch.io/klm.com/w/512/h/140/logo" },
  { name: "Iberia", url: "https://cdn.brandfetch.io/iberia.com/w/512/h/180/logo" },
  { name: "Lufthansa", url: "https://cdn.brandfetch.io/lufthansa.com/w/512/h/110/logo" },
  { name: "British Airways", url: "https://cdn.brandfetch.io/britishairways.com/w/512/h/120/logo" },
  { name: "Emirates", url: "https://cdn.brandfetch.io/emirates.com/w/512/h/120/logo" },
]

export default function AirlinesSlider({ title = "", className = "" }: AirlinesSliderProps) {
  const items = useMemo(() => [...AIRLINE_LOGOS, ...AIRLINE_LOGOS], [])
  return (
    <div className={`w-full overflow-hidden py-10 ${className}`}>
      <div className="text-center mb-6">
        <PartnersShowcase />
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center space-x-14 px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { repeat: Number.POSITIVE_INFINITY, repeatType: "loop", duration: 36, ease: "linear" } }}
          >
            {items.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="flex items-center justify-center h-12 w-28 relative group">
                <motion.img
                  src={logo.url}
                  alt={`${logo.name} logo`}
                  className="max-h-full max-w-full object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 invert"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-500">
                  {logo.name}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

