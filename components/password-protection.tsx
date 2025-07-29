"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Eye, EyeOff, ArrowRight, Sparkles, Users, Calendar, Shield, Rocket } from "lucide-react"
import { motion } from "framer-motion"

export default function PasswordProtection({ onUnlock }: { onUnlock: () => void }) {
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
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
        onUnlock()
      }, 1500)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  const launchStats = [
    { icon: <Calendar className="w-4 h-4" />, value: "Oct 2025", label: "Official Launch" },
    { icon: <Users className="w-4 h-4" />, value: "5,000+", label: "Waitlist Members" },
    { icon: <Shield className="w-4 h-4" />, value: "Enterprise", label: "Security Ready" },
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
      title: "AI Agent Verification",
      description: "Zia validates your company credentials",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: "Early Access Granted",
      description: "Exclusive preview of October 2025 launch",
      icon: <Rocket className="w-5 h-5" />,
    },
    {
      title: "Full Platform Access",
      description: "Complete business travel solution",
      icon: <Sparkles className="w-5 h-5" />,
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
        <video ref={videoRef} className="w-full h-full object-cover opacity-40" autoPlay muted loop playsInline>
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
      </div>

      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
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

      <div className="relative z-10 w-full max-w-6xl p-4 md:p-8 mx-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-black/50 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
        >
          {/* Header Section */}
          <div className="p-8 md:p-16 text-center relative">
            {/* Launch Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 mb-8"
            >
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm font-medium">October 2025 Launch Preview</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-6 leading-none">
                <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
                  The Future
                </span>
                <br />
                <span className="font-medium">of Business Travel</span>
              </h1>

              <p className="text-white/80 text-xl md:text-2xl font-light max-w-4xl mx-auto leading-relaxed">
                Get exclusive early access to the most advanced AI-powered business travel platform.
                <span className="font-serif italic"> Limited spots available.</span>
              </p>
            </motion.div>

            {/* Launch Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {launchStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20"
                >
                  <div className="text-emerald-400">{stat.icon}</div>
                  <div className="text-white font-medium text-lg">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Process Steps */}
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-12"
            >
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-500 ${
                      currentStep === index
                        ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-400"
                        : "bg-white/5 border border-white/20 text-white/60"
                    }`}
                  >
                    {step.icon}
                    <div className="text-left">
                      <div className="text-sm font-medium">{step.title}</div>
                      <div className="text-xs opacity-80">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-white/40 hidden md:block" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 md:px-16 pb-8 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* AI Agent Interface */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0">
                      <Image
                        src="/agents/agent-5.png"
                        alt="Zia - AI Verification Agent"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl md:text-2xl font-medium mb-1">Zia Verification Agent</h3>
                    <p className="text-white/70 text-sm">AI-Powered Security & Access Control</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-400/30">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-emerald-400 text-xs font-medium">Active</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed">
                    <span className="font-serif italic">"Welcome to the future."</span> I'm Zia, your AI verification
                    agent. Please provide your company credentials to access our exclusive October 2025 launch preview.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full py-4 px-6 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 outline-none transition-all text-white text-lg placeholder-white/50"
                        placeholder="Enter your company name"
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-white/80 text-sm font-medium mb-2">Access Code</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full py-4 px-6 pr-14 bg-white/10 backdrop-blur-md border ${
                          error ? "border-red-500 animate-shake" : "border-white/30"
                        } rounded-2xl focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 outline-none transition-all text-white text-lg placeholder-white/50`}
                        placeholder="Enter exclusive access code"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-12 text-white/60 hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(!acceptedTerms)}
                      className="w-5 h-5 mt-1 border-2 border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-emerald-400/50"
                      required
                    />
                    <label htmlFor="terms" className="text-white/80 text-sm font-light leading-relaxed">
                      I acknowledge this is confidential pre-launch material and agree to the early access terms. I
                      understand this preview is limited to select business partners for the October 2025 launch.
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!acceptedTerms}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 md:py-5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl transition-all flex items-center justify-center text-lg font-medium hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <span>Access October 2025 Preview</span>
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </motion.button>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl"
                    >
                      <p className="text-red-300 text-sm">
                        Invalid access code. Please contact your account manager for the correct credentials.
                      </p>
                    </motion.div>
                  )}
                </form>

                {/* Features Preview */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <h4 className="text-white font-medium mb-4 text-center">What's included in your preview:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        className="flex items-center gap-2 text-white/70 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-center gap-3 text-white/40">
            <span className="text-sm font-light font-serif italic">Powered by</span>
            <Image
              src="/logo/suitpax-cloud-logo.webp"
              alt="Suitpax"
              width={80}
              height={20}
              className="h-4 w-auto opacity-60"
            />
            <span className="text-sm font-light">• October 2025</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
