"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (hasVisited) {
      setShowSplash(false)
      return
    }

    // Set a timeout to hide the splash screen after animation
    const timer = setTimeout(() => {
      setShowSplash(false)
      sessionStorage.setItem("hasVisited", "true")
    }, 2500) // Adjust timing as needed

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, delay: 0.5 },
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5 },
            }}
            exit={{
              scale: 1.2,
              opacity: 0,
              transition: { duration: 0.5 },
            }}
            className="relative w-32 h-32 md:w-40 md:h-40"
          >
            <Image src="/logo/suitpax-symbol-2.png" alt="Suitpax" fill className="object-contain" priority />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
