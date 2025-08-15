"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import VideoPlayer from "@/components/video-player"

// Breakpoint personalizado para pantallas muy pequeñas
const useExtraSmallScreen = () => {
  const [isXs, setIsXs] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsXs(window.innerWidth < 480)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return isXs
}

// Feature Badge Component
const FeatureBadge = ({ text, isActive = false }) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
        isActive ? "border-gray-300 bg-gray-200 text-gray-700" : "border-gray-200 bg-white text-gray-500"
      } text-xs font-medium transition-all duration-300`}
    >
      {isActive && <CheckCircle className="h-3 w-3" />}
      {text}
    </div>
  )
}

// Title variations focused on business travel
const titleVariations = [
  "Your business travel is about to change. Forever",
  "The way your company travels is about to be transformed",
  "Corporate travel is on the verge of a revolution",
  "How employees travel for business is about to change",
  "Traveltech reimagined for the modern workforce",
  "AI Agents with MCP superpowers transforming business travel",
  "Business travel reimagined with MCP intelligence",
]

// Subtitle variations
const subtitleVariations = [
  "AI-powered travel management that transforms how companies of all sizes handle business trips",
  "Reimagining corporate travel with intelligent automation for startups and growing businesses",
  "Seamless integration between your company's workflow and travel management",
  "Empowering teams with smarter, faster, and more efficient travel solutions",
  "MCP-enhanced AI agents that understand travel needs for startups and scale-ups",
]

export const VideoShowcase = () => {
  const isXs = useExtraSmallScreen()
  const [activeFeature, setActiveFeature] = useState("AI Motion")
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Efecto para cambiar la característica activa cada 3 segundos
  useEffect(() => {
    const features = ["AI Motion", "Real-time Rendering", "Interactive UI", "Business Travel"]
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % features.length
      setActiveFeature(features[currentIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Efecto para seleccionar un título y subtítulo aleatorio
  useEffect(() => {
    // Select random title and subtitle
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    const subtitleIndex = Math.floor(Math.random() * subtitleVariations.length)
    setRandomSubtitle(subtitleVariations[subtitleIndex])

    // Preload video
    const videoElement = document.createElement("video")
    videoElement.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supermotion_co%20%282%29-GWuBXOG5erdxB4voOtmDHtr4BcHhK6.mp4"
    videoElement.preload = "auto"
    videoElement.muted = true
    videoElement.oncanplaythrough = () => setVideoLoaded(true)
    videoElement.onerror = () => setVideoError(true)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Technology
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Coming Q2 2025
            </span>
          </div>

          <motion.h2
            className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-black leading-none max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {randomTitle}
          </motion.h2>

          {/* Añadir indicación llamativa de lanzamiento */}
          <motion.div
            className="mt-6 mb-4 inline-flex items-center bg-black text-white px-6 py-2 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg font-semibold tracking-tighter mr-2">INTERACTIVE DEMO</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </motion.div>

          <motion.p
            className="mt-3 text-sm font-medium text-gray-600 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {randomSubtitle}
          </motion.p>

          <motion.p
            className="mt-2 text-xs font-light text-gray-500 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Reimagining the future of corporate travel with AI-powered solutions that adapt to your unique business
            needs
          </motion.p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["AI Motion", "Real-time Rendering", "Interactive UI", "Business Travel"].map((feature) => (
              <FeatureBadge key={feature} text={feature} isActive={activeFeature === feature} />
            ))}
          </div>
        </div>

        {/* Video Showcase - Simplificado y más directo */}
        <motion.div
          className="w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VideoPlayer
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supermotion_co%20%282%29-GWuBXOG5erdxB4voOtmDHtr4BcHhK6.mp4"
            poster="/images/suitpax-dashboard.jpeg"
            fallbackImage="/images/suitpax-dashboard.jpeg"
            aspectRatio="video"
            className="rounded-xl"
          />
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto">
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-4xl font-medium tracking-tighter text-black mb-2">95%</div>
            <p className="text-gray-600 text-sm">Faster than traditional travel platforms</p>
          </motion.div>
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-4xl font-medium tracking-tighter text-black mb-2">400+</div>
            <p className="text-gray-600 text-sm">Global airlines and hotels connected</p>
          </motion.div>
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-4xl font-medium tracking-tighter text-black mb-2">24/7</div>
            <p className="text-gray-600 text-sm">AI agent availability worldwide</p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="flex justify-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            <a
              href="https://accounts.suitpax.com/sign-up"
              className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg w-full sm:w-auto min-w-[220px] transition-colors relative group overflow-hidden"
            >
              <span className="relative z-10">Pre-register</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-300 via-white to-sky-300 opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500 animate-flow-slow"></span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VideoShowcase
