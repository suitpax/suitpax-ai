"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface AirlinesSliderProps {
  title?: string
  className?: string
}

const AIRLINE_LOGOS = [
  { name: "Cathay Pacific", code: "CX" },
  { name: "SWISS", code: "LX" },
  { name: "Air France", code: "AF" },
  { name: "Jet2", code: "LS" },
  { name: "Vueling", code: "VY" },
  { name: "KLM", code: "KL" },
  { name: "Iberia", code: "IB" },
  { name: "Lufthansa", code: "LH" },
  { name: "British Airways", code: "BA" },
  { name: "Emirates", code: "EK" },
  { name: "Qatar Airways", code: "QR" },
  { name: "Turkish Airlines", code: "TK" },
  { name: "United", code: "UA" },
  { name: "Delta", code: "DL" },
  { name: "American", code: "AA" },
  { name: "Ryanair", code: "FR" },
  { name: "easyJet", code: "U2" },
  { name: "Singapore Airlines", code: "SQ" },
  { name: "ANA", code: "NH" },
  { name: "Aer Lingus", code: "EI" },
  { name: "Aegean", code: "A3" },
  { name: "Finnair", code: "AY" },
  { name: "SAS", code: "SK" },
  { name: "Tap Air Portugal", code: "TP" },
  { name: "Etihad", code: "EY" },
]

export default function AirlinesSlider({ title = "", className = "" }: AirlinesSliderProps) {
  const items = useMemo(() => [...AIRLINE_LOGOS, ...AIRLINE_LOGOS], [])
  return (
    <div className={`w-full overflow-hidden py-4 ${className}`}>
      <div className="relative w-full overflow-hidden">
        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center space-x-10 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { repeat: Number.POSITIVE_INFINITY, repeatType: "loop", duration: 36, ease: "linear" } }}
          >
            {items.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="flex items-center justify-center h-9 w-32 relative group">
                <motion.img
                  src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${logo.code}.svg`}
                  alt={`${logo.name} logo`}
                  className="max-h-[18px] max-w-[110px] object-contain transition-all duration-300 group-hover:opacity-100"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                />
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-500">
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

