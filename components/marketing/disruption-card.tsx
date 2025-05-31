"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function DisruptionCard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="flex justify-center items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              Vision
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Future
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
            The future of business travel
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">
            Reimagining the industry with cutting-edge technology and innovative solutions
          </p>
        </div>

        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden">
          {/* Imagen de fondo */}
          <Image
            src="/images/glass-cube-reflection.jpeg"
            alt="Glass Cube Reflection"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay para mejorar legibilidad */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* Contenido */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-3xl">
              {/* Badge superior */}
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"></span>
                  2025
                </span>
              </div>

              {/* Título principal */}
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-6 text-center">
                Clarity in a complex world
              </h3>

              {/* Mini chat */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl max-w-md mx-auto"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/30">
                    <Image
                      src="/agents/agent-42.png"
                      alt="AI Agent"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 text-white text-sm">
                      <p>We're ready to disrupt the industry. Trust me...</p>
                    </div>
                    <div className="mt-1 flex items-center">
                      <p className="text-xs text-white/70">Suitpax AI</p>
                      <span className="mx-1.5 text-white/40">•</span>
                      <p className="text-xs text-white/70">Just now</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Botón inferior */}
              <div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md text-white text-sm font-medium px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Learn more about our vision
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
