"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

export default function PasswordProtection({ onUnlock }: { onUnlock: () => void }) {
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const correctPassword = "mission2065"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      return
    }

    if (password === correctPassword) {
      setIsAnimating(true)
      setTimeout(() => {
        onUnlock()
      }, 1000)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${isAnimating ? "opacity-0" : "opacity-100"}`}
    >
      <div className="relative z-10 w-full max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 bg-black backdrop-blur-md rounded-3xl border border-white/10 min-h-[450px] sm:min-h-[500px] flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <div className="relative z-10 flex justify-center mb-3 sm:mb-6">
          <Image
            src="/suitpax-white-logo.png"
            alt="Suitpax Logo"
            width={140}
            height={35}
            className="h-6 sm:h-8 w-auto"
          />
        </div>

        <div className="relative z-10 mb-4 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 mb-2 sm:mb-4">
            <span className="font-serif italic text-white/80 text-xs sm:text-sm">The next-gen of traveltech</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight leading-tight text-white mb-2 sm:mb-3">
            Made by humans.
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-xs mx-auto">
            An AI-powered platform transforming how businesses manage travel and expenses
          </p>
        </div>

        {/* AI Agent Input Interface */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4 sm:space-y-5">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-5">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4 relative">
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                <Image
                  src="/ai-agent-emma.jpg"
                  alt="AI Assistant Zia"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm sm:text-base font-medium">Zia from Suitpax</p>
                <p className="text-white/60 text-xs sm:text-sm">AI Agent</p>
              </div>
            </div>

            {/* Monitoring badge - moved below Zia's info */}
            <div className="mb-3 sm:mb-4">
              <div
                className="bg-black/60 backdrop-blur-md rounded-full border border-white/10 overflow-hidden flex items-center p-1 sm:p-1.5 shadow-lg"
                style={{ width: "160px", maxWidth: "100%" }}
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden mr-2">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 30%" }}
                  >
                    <source src="/videos/ai-agent-demo.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="flex items-center">
                  <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-white"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs text-white whitespace-nowrap">Monitoring access</span>
                </div>
              </div>
            </div>

            <p className="text-white/90 text-sm sm:text-base mb-3 sm:mb-5">
              Hello, I'm Zia, your Suitpax AI verification Agent. What company are you from?
            </p>

            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-transparent outline-none transition text-white text-sm sm:text-base"
                placeholder="Enter your company name"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full py-2.5 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 bg-black/50 backdrop-blur-md border ${
                    error ? "border-red-500 animate-shake" : "border-white/20"
                  } rounded-xl focus:ring-1 focus:ring-white/30 focus:border-transparent outline-none transition text-white text-sm sm:text-base`}
                  placeholder="Enter access code"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 sm:w-5 h-4 sm:h-5 text-white/60" />
                  ) : (
                    <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-white/60" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-4 sm:h-5 mt-0.5">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="w-3.5 sm:w-4 h-3.5 sm:h-4 border border-white/20 rounded bg-black/50 focus:ring-1 focus:ring-white/30"
                required
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-white/70">
              I acknowledge this material contains confidential information
            </label>
          </div>

          <button
            type="submit"
            disabled={!acceptedTerms}
            className="w-full py-2.5 sm:py-3 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-xl transition flex items-center justify-center text-sm sm:text-base font-medium hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(255,255,255,0.1),0_0_5px_rgba(56,189,248,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2),0_0_10px_rgba(56,189,248,0.3)]"
          >
            <span>Access to open world</span>
            <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </form>

        {/* Technology by text inside the card */}
        <div className="relative z-10 mt-4 sm:mt-6 flex items-center justify-center gap-1.5 text-white/40">
          <span className="text-[10px] sm:text-xs font-light">Technology by</span>
          <Image src="/suitpax-white-logo.png" alt="Suitpax" width={50} height={13} className="h-2.5 sm:h-3 w-auto" />
        </div>
      </div>
    </div>
  )
}
