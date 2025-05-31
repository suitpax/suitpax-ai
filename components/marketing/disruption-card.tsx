"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { PiArrowRightBold, PiSparkle, PiLightningBold, PiRocketLaunchBold } from "react-icons/pi"

export default function DisruptionCard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: PiLightningBold,
      title: "Instant Booking",
      description: "AI-powered flight and hotel booking in seconds",
    },
    {
      icon: PiSparkle,
      title: "Smart Policies",
      description: "Automated compliance with dynamic policy enforcement",
    },
    {
      icon: PiRocketLaunchBold,
      title: "Future Ready",
      description: "Next-generation travel management platform",
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="flex justify-center items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <PiSparkle className="h-2.5 w-2.5 mr-1" />
              Vision 2025
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Innovation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
            Redefining business travel through innovation
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-3xl">
            We're not just building another travel platform. We're creating the future of how businesses manage, book,
            and optimize their travel operations with cutting-edge AI technology.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-medium tracking-tighter text-black">The Crystal Clear Future</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Like a crystal cube that refracts light into infinite possibilities, Suitpax transforms complex travel
                management into clear, actionable insights. Every booking, every expense, every policy decision becomes
                transparent and optimized.
              </p>
            </div>

            {/* Rotating Features */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-500 ${
                      currentFeature === index
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                    animate={{
                      scale: currentFeature === index ? 1.02 : 1,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          currentFeature === index ? "bg-white/20" : "bg-gray-100"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${currentFeature === index ? "text-white" : "text-gray-700"}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className={`text-xs ${currentFeature === index ? "text-white/80" : "text-gray-500"}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-medium tracking-tighter text-black">98%</div>
                <div className="text-xs text-gray-500">Policy Compliance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium tracking-tighter text-black">3.2s</div>
                <div className="text-xs text-gray-500">Avg. Booking Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium tracking-tighter text-black">24%</div>
                <div className="text-xs text-gray-500">Cost Reduction</div>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative">
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden">
              {/* Background Image */}
              <Image
                src="/images/glass-cube-reflection.jpeg"
                alt="Glass Cube Reflection"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>
                    Live Innovation
                  </span>
                  <motion.div
                    className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PiArrowRightBold className="h-4 w-4 text-white" />
                  </motion.div>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl max-w-sm mx-auto"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/30">
                            <Image
                              src="/agents/agent-42.png"
                              alt="AI Agent"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-white text-sm mb-2">
                              <p className="leading-relaxed">
                                "We're ready to disrupt the industry. The future of business travel starts with
                                transparency, intelligence, and seamless experiences. Trust me..."
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-white/90 font-medium">Suitpax AI</p>
                                <p className="text-xs text-white/60">Chief Innovation Officer</p>
                              </div>
                              <span className="text-xs text-white/60">Just now</span>
                            </div>
                          </div>
                        </div>

                        {/* Typing indicator */}
                        <motion.div
                          className="flex items-center gap-1 mt-3 px-3"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                        >
                          <div className="w-1 h-1 rounded-full bg-white/60"></div>
                          <div className="w-1 h-1 rounded-full bg-white/60"></div>
                          <div className="w-1 h-1 rounded-full bg-white/60"></div>
                          <span className="text-xs text-white/60 ml-2">AI is thinking...</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Content */}
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-lg font-serif text-white tracking-tighter mb-1">Crystal Clear Vision</h4>
                    <p className="text-xs text-white/70">Transforming complexity into clarity</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">
                      2025 Vision
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-20 right-20 w-3 h-3 rounded-full bg-white/30"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: 0,
                }}
              />
              <motion.div
                className="absolute bottom-32 left-16 w-2 h-2 rounded-full bg-white/40"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  delay: 1,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            Experience the Future
            <PiArrowRightBold className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
