"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Eye, EyeOff, ArrowRight, Sparkles, Calendar, Shield, Rocket } from "lucide-react"
import { motion } from "framer-motion"

interface PasswordProtectionProps {
  onUnlock: () => void
  children: React.ReactNode
}

export default function PasswordProtection({ onUnlock, children }: PasswordProtectionProps) {
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const correctPassword = "mission2065"

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }

    // Auto-advance steps for demo
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      return
    }

    if (password === correctPassword) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsUnlocked(true)
        onUnlock()
      }, 1500)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  // Si está desbloqueado, mostrar el contenido
  if (isUnlocked) {
    return <>{children}</>
  }

  const launchStats = [
    { icon: <Calendar className="w-3 h-3" />, value: "Oct 2025", label: "Launch" },
    { icon: <Shield className="w-3 h-3" />, value: "Enterprise", label: "Ready" },
    { icon: <Rocket className="w-3 h-3" />, value: "AI-First", label: "Platform" },
  ]

  const features = [
    "AI-Powered Travel Booking",
    "Real-time Expense Management",
    "Smart Policy Compliance",
    "24/7 Voice Assistant",
    "Global Business Access",
    "Advanced Analytics",
  ]

  const steps = [
    {
      title: "AI Verification",
      description: "Zia validates credentials",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      title: "Early Access",
      description: "October 2025 preview",
      icon: <Rocket className="w-4 h-4" />,
    },
    {
      title: "Full Platform",
      description: "Complete solution",
      icon: <Sparkles className="w-4 h-4" />,
    },
  ]

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-1500 ${
        isAnimating ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Video with Enhanced Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover opacity-30" autoPlay muted loop playsInline>
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-black/95"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl p-4 md:p-6 mx-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header Section */}
          <div className="p-6 md:p-12 text-center relative">
            {/* Launch Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 mb-6"
            >
              <Rocket className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">October 2025 Launch Preview</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-white mb-4 leading-none">
                <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
                  The Future
                </span>
                <br />
                <span className="font-medium">of Business Travel</span>
              </h1>

              <p className="text-white/70 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
                Get exclusive early access to the most advanced AI-powered business travel platform.
                <span className="font-serif italic"> Limited preview available.</span>
              </p>
            </motion.div>

            {/* Launch Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {launchStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10"
                >
                  <div className="text-white/80">{stat.icon}</div>
                  <div className="text-white font-medium text-sm">{stat.value}</div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mb-8"
            >
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-500 ${
                      currentStep === index
                        ? "bg-white/10 border border-white/30 text-white"
                        : "bg-white/5 border border-white/10 text-white/60"
                    }`}
                  >
                    {step.icon}
                    <div className="text-left">
                      <div className="text-xs font-medium">{step.title}</div>
                      <div className="text-xs opacity-70">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="w-3 h-3 text-white/30 hidden sm:block" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="px-6 md:px-12 pb-6 md:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {/* AI Agent Interface */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
                      <Image
                        src="/agents/agent-5.png"
                        alt="Zia - AI Verification Agent"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-800 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg md:text-xl font-medium mb-1">Zia Verification Agent</h3>
                    <p className="text-white/60 text-sm">AI-Powered Access Control</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                    <div className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </div>
                    <span className="text-white text-xs font-medium">Active</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                    <span className="font-serif italic">"Welcome to the future."</span> I'm Zia, your AI verification
                    agent. Please provide your company credentials to access our exclusive October 2025 launch preview.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full py-3 px-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl focus:ring-1 focus:ring-white/40 focus:border-white/40 outline-none transition-all text-white placeholder-white/40"
                        placeholder="Enter your company name"
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-white/70 text-sm font-medium mb-2">Access Code</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full py-3 px-4 pr-12 bg-white/5 backdrop-blur-md border ${
                          error ? "border-red-500 animate-shake" : "border-white/20"
                        } rounded-xl focus:ring-1 focus:ring-white/40 focus:border-white/40 outline-none transition-all text-white placeholder-white/40`}
                        placeholder="Enter exclusive access code"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-10 text-white/50 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(!acceptedTerms)}
                      className="w-4 h-4 mt-0.5 border border-white/20 rounded bg-white/5 focus:ring-1 focus:ring-white/40"
                      required
                    />
                    <label htmlFor="terms" className="text-white/70 text-sm font-light leading-relaxed">
                      I acknowledge this is confidential pre-launch material and agree to the early access terms for the
                      October 2025 launch.
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!acceptedTerms}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 md:py-4 bg-white text-black rounded-xl transition-all flex items-center justify-center font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <span>Access October 2025 Preview</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-400/20 rounded-xl"
                    >
                      <p className="text-red-300 text-sm">
                        Invalid access code. Please contact your account manager for the correct credentials.
                      </p>
                    </motion.div>
                  )}
                </form>

                {/* Features Preview */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white font-medium mb-3 text-center text-sm">Preview includes:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        className="flex items-center gap-2 text-white/60 text-xs"
                      >
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex items-center justify-center gap-2 text-white/30">
            <span className="text-xs font-light font-serif italic">Powered by</span>
            <Image
              src="/logo/suitpax-cloud-logo.webp"
              alt="Suitpax"
              width={60}
              height={15}
              className="h-3 w-auto opacity-50"
            />
            <span className="text-xs font-light">• October 2025</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
