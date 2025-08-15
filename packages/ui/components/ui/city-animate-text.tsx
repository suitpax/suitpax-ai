"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedTextProps {
  cities?: string[]
}

// Cities for the animated text
const defaultCities = [
  "New York",
  "London",
  "Tokyo",
  "San Francisco",
  "Berlin",
  "Singapore",
  "Dubai",
  "Hong Kong",
  "Shanghai",
  "Sydney",
  "Toronto",
  "Mumbai",
  "São Paulo",
  "Zurich",
  "Frankfurt",
  "Amsterdam",
  "Seoul",
  "Paris",
  "Madrid",
  "Rome",
  "Frankfurt",
  "Doha",
  "Milan", // Added city
  "Vienna", // Added city
  "Brussels", // Added city
  "Geneva", // Added city
  "Munich", // Added city
  "Barcelona", // Added European city
  "Copenhagen", // Added European city
  "Lisbon", // Added European city
  "Stockholm", // Added European city
]

// Añadir esta función al inicio del componente CityAnimateText
const prefersReducedMotion =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

export const CityAnimateText = ({ cities = defaultCities }: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cities.length)
    }, 3000) // Change city every 3 seconds

    return () => clearInterval(interval)
  }, [cities.length])

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden relative">
      {/* AI indicator - now positioned at top center */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center bg-gray-200 rounded-full px-2 py-0.5 text-[10px] text-black">
        <div className="w-1.5 h-1.5 rounded-full bg-black mr-1 animate-pulse self-center"></div>
        <span className="font-medium">Suitpax AI</span>
      </div>

      <div className="flex flex-col items-center pt-6">
        <span className="text-xs text-black/80 mb-1">Heads up! you've got a meeting in...</span>
        <div className="h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={prefersReducedMotion ? { y: 0, opacity: 0 } : { y: -40, opacity: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      y: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }
              }
              className="text-black font-medium tracking-tighter text-2xl md:text-xl"
            >
              {cities[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default CityAnimateText
