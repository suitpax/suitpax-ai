"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"

export default function PasswordGatePage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error("Invalid password")
      const data = await res.json()
      if (data?.ok) {
        // set a short-lived cookie via API; then redirect home
        router.push("/")
      } else {
        setError("Invalid password")
      }
    } catch (err) {
      setError("Invalid password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <VantaHaloBackground
      className="relative w-full min-h-[100vh] overflow-hidden bg-white"
      options={{
        backgroundColor: 0xf6f7fb,
        baseColor: 0xeff2f7,
        color: 0xffffff,
        color2: 0xdde3ee,
        size: 0.85,
        amplitudeFactor: 0.9,
      }}
    >
      {/* Clean hero: no dot pattern */}

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium text-white/90 mb-4 border border-white/15">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={60} height={15} className="h-3 w-auto mr-1 invert" />
            Private preview access
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tighter text-black leading-tight max-w-5xl"
          >
            The Suitpax AI: Build. Travel. Code.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-sm md:text-base font-light text-gray-700 max-w-2xl"
          >
            Enter the access key to explore our next‑gen business travel platform.
          </motion.p>

          {/* Shimmer text */}
          <div className="mt-4 text-gray-700 text-sm font-medium relative inline-block">
            <span className="relative z-10">Shaping the next‑gen of business travel</span>
            <span className="absolute inset-0 animate-hero-shimmer bg-[linear-gradient(110deg,#ffffff,45%,#9ca3af,55%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent" />
          </div>

          {/* Variant lines */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-700">
            <span className="inline-flex items-center rounded-xl bg-black/5 px-2.5 py-1 border border-black/10">Design. Ship. Scale.</span>
            <span className="inline-flex items-center rounded-xl bg-black/5 px-2.5 py-1 border border-black/10">Predict. Plan. Automate.</span>
            <span className="inline-flex items-center rounded-xl bg-black/5 px-2.5 py-1 border border-black/10">Flights. Hotels. Finance.</span>
          </div>

          {/* Prompt-like password input */}
          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-3xl mx-auto px-2">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-3 md:p-4 shadow-sm">
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-gray-200">
                <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center md:object-center object-[50%_35%]">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4" type="video/mp4" />
                </video>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key to continue"
                className="flex-1 bg-transparent text-base md:text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none h-16 md:h-[72px]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 md:h-14 w-12 md:w-14 rounded-2xl bg-black text-white hover:bg-gray-900 flex items-center justify-center border border-black/10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
            {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
          </form>

          {/* Secondary hype badges */}
          <div className="flex items-center gap-2 mt-6">
            <span className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-0.5 text-[9px] font-medium text-white/90 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1" />
              Launching soon
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-0.5 text-[9px] font-medium text-white/90 border border-white/15">
              Private beta
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-center text-gray-500">
            <span className="text-xs">© {new Date().getFullYear()} Suitpax. All rights reserved.</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-hero-shimmer {
          -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, #000 20%, #000 80%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, #000 20%, #000 80%, rgba(0,0,0,0) 100%);
          animation: shimmerMove 2.6s linear infinite;
        }
        @keyframes shimmerMove {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </VantaHaloBackground>
  )
}

