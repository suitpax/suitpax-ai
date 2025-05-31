"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { PiSparkle, PiRocket, PiLightning } from "react-icons/pi"

export default function DisruptionCard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    "We're ready to disrupt the industry. Trust me...",
    "The future of business travel starts here.",
    "AI-powered. Human-centered. Revolutionary.",
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [isVisible, messages.length])

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="flex justify-center items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <PiSparkle className="h-2.5 w-2.5 mr-1" />
              Vision
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Future
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <PiRocket className="h-2.5 w-2.5 mr-1" />
              Innovation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
            The crystal clear future of business travel
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">
            Transparency, innovation, and revolutionary technology converging to reshape how companies manage travel
          </p>
          <p className="mt-2 text-xs font-light text-gray-500 max-w-3xl">
            Like light refracting through crystal, our AI illuminates every aspect of your travel program with
            unprecedented clarity and precision
          </p>
        </div>

        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
          {/* Imagen de fondo */}
          <Image
            src="/images/glass-cube-reflection.jpeg"
            alt="Glass Cube Reflection - The Future of Business Travel"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradiente para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

          {/* Contenido principal */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-6 md:p-8">
            {/* Header con badges */}
            <div className="w-full flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20">
                  <PiLightning className="h-3 w-3 mr-1" />
                  Suitpax Vision 2025
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                  Live Innovation
                </span>
              </div>
              <motion.div
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>

            {/* Título central */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tighter text-white mb-4 leading-tight">
                Clarity in a complex world
              </h3>
              <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                Every facet of business travel, illuminated by artificial intelligence
              </p>
            </div>

            {/* Mini chat dinámico */}
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/30 shadow-2xl max-w-lg mx-auto"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/30 shadow-lg">
                      <Image
                        src="/agents/agent-42.png"
                        alt="Suitpax AI Agent"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/25 backdrop-blur-md rounded-xl p-3 text-white text-sm md:text-base shadow-lg">
                        <motion.p
                          key={currentMessage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="leading-relaxed"
                        >
                          {messages[currentMessage]}
                        </motion.p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-xs text-white/70 font-medium">Suitpax AI</p>
                          <span className="mx-2 text-white/40">•</span>
                          <p className="text-xs text-white/70">Just now</p>
                        </div>
                        <div className="flex space-x-1">
                          {messages.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                index === currentMessage ? "bg-white" : "bg-white/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer con estadísticas */}
            <div className="w-full flex justify-between items-end">
              <div className="flex flex-col items-start">
                <span className="text-xs text-white/70 mb-1">Suitpax</span>
                <span className="text-sm md:text-base font-medium text-white font-serif tracking-tighter">
                  Redefining Business Travel
                </span>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-white/60">98.5% Accuracy</span>
                  <span className="text-xs text-white/60">150+ Countries</span>
                  <span className="text-xs text-white/60">24/7 Support</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20">
                  2025
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Explore Vision
                </motion.button>
              </div>
            </div>
          </div>

          {/* Efectos de luz adicionales */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

        {/* Sección adicional de contenido */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <PiSparkle className="h-8 w-8 text-gray-700 mb-4" />
            <h4 className="text-lg font-medium tracking-tighter text-black mb-2">Crystal Clear Insights</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every travel decision illuminated with AI-powered analytics and real-time data visualization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <PiRocket className="h-8 w-8 text-gray-700 mb-4" />
            <h4 className="text-lg font-medium tracking-tighter text-black mb-2">Revolutionary Technology</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cutting-edge AI that transforms complex travel management into simple, intelligent automation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <PiLightning className="h-8 w-8 text-gray-700 mb-4" />
            <h4 className="text-lg font-medium tracking-tighter text-black mb-2">Lightning Fast Results</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Instant responses, real-time updates, and seamless integration across your entire travel ecosystem.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
