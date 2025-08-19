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
      className="relative w-full min-h-[100vh] overflow-hidden"
      options={{
        backgroundColor: 0xe8eaee,
        baseColor: 0xdfe3ea,
        color: 0xffffff,
        color2: 0xeeeeee,
        size: 0.85,
        amplitudeFactor: 1.0,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#6b7280_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />

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
            className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tighter text-white leading-tight max-w-4xl"
          >
            The Suitpax AI: Build. Travel. Code.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 text-base md:text-lg font-light text-gray-200/90 max-w-2xl"
          >
            Enter the access key to explore our next‑gen business travel platform. Precision. Speed. Intelligence.
          </motion.p>

          {/* Shimmer text */}
          <div className="mt-6 text-gray-200/80 text-base font-medium relative inline-block">
            <span className="relative z-10">Shaping the next‑gen of business travel</span>
            <span className="absolute inset-0 animate-hero-shimmer bg-[linear-gradient(110deg,#ffffff,45%,#9ca3af,55%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent" />
          </div>

          {/* Variant lines */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/80">
            <span className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-1 border border-white/15">Design. Ship. Scale.</span>
            <span className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-1 border border-white/15">Predict. Plan. Automate.</span>
            <span className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-1 border border-white/15">Flights. Hotels. Finance.</span>
          </div>

          {/* Prompt-like password input */}
          <form onSubmit={handleSubmit} className="mt-10 w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-gray-700">
                <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4" type="video/mp4" />
                </video>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key to continue"
                className="flex-1 bg-transparent text-base md:text-lg text-white placeholder:text-gray-300 focus:outline-none h-16 md:h-[72px]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="h-14 md:h-16 px-6 rounded-2xl bg-white text-black hover:bg-gray-100 flex items-center justify-center text-sm md:text-base font-medium border border-white/20"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-white/80 animate-pulse" />
                    <span>Checking</span>
                  </span>
                ) : (
                  "Enter"
                )}
              </button>
            </div>
            {error && <div className="mt-2 text-xs text-gray-300">{error}</div>}
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
          <div className="flex items-center justify-center gap-3 text-white/90">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={90} height={22} className="h-5 w-auto invert" />
            <span className="text-xs uppercase tracking-wider">Technology by Suitpax</span>
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

