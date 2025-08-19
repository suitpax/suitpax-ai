"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { Sparkles, Plane, Mic } from "lucide-react"

export default function PasswordGatePage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [headline, setHeadline] = useState("Suitpax AI: Build. Travel. Code.")
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null)
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  useEffect(() => {
    const titles = [
      "Suitpax AI: Build. Travel. Code.",
      "Suitpax AI: Predict. Plan. Automate.",
      "Suitpax AI: Flights. Hotels. Finance.",
      "Suitpax AI: Chat. Voice. Agents.",
      "Suitpax AI: Design. Ship. Scale.",
    ]
    setHeadline(titles[Math.floor(Math.random() * titles.length)])
  }, [])

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

  const subscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterMsg(null)
    setNewsletterLoading(true)
    try {
      const resp = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const json = await resp.json()
      if (!resp.ok || !json?.ok) throw new Error(json?.error || 'Subscribe failed')
      setNewsletterMsg('You are in. Check your inbox!')
      setNewsletterEmail("")
    } catch (err: any) {
      setNewsletterMsg(err?.message || 'Something went wrong')
    } finally {
      setNewsletterLoading(false)
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
      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-xl bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-900 mb-4 border border-gray-200">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={60} height={15} className="h-3 w-auto mr-1" />
            Private preview access
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tighter text-black leading-tight max-w-5xl"
          >
            {headline}
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
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-gray-700">
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Design. Ship. Scale.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Predict. Plan. Automate.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Flights. Hotels. Finance.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Build. Travel. Code.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Chat. Voice. Agents.</span>
          </div>

          {/* Prompt-like password input (smaller & squarer) */}
          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-3xl mx-auto px-2">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur border border-gray-200 rounded-lg p-2.5 shadow-sm">
              <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-gray-300/50">
                <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center object-[50%_35%]">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4" type="video/mp4" />
                </video>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key to continue"
                className="flex-1 bg-transparent text-[15px] md:text-base text-gray-900 placeholder:text-gray-500 focus:outline-none h-12"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="h-9 w-9 md:h-10 md:w-10 rounded-md text-black hover:text-gray-700 flex items-center justify-center"
                aria-label="Continue"
                title="Continue"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
            {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
          </form>

          {/* Feature strip under input */}
          <div className="mt-6 w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 p-3">
                <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-gray-900">Predictive prompts</div>
                  <div className="text-[11px] text-gray-600">Understand intent in any language</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 p-3">
                <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Plane className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-gray-900">Real flight data</div>
                  <div className="text-[11px] text-gray-600">Duffel offers with smart re‑ranking</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 p-3">
                <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Mic className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-gray-900">Voice‑first</div>
                  <div className="text-[11px] text-gray-600">Call Suitpax Voice, your AI agent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Disruptive marketing showcase (5 tiles) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-6xl w-full">
            {[
              { title: 'Agent Orchestration', desc: 'Multi‑tool workflows in seconds', tone: 'bg-gradient-to-br from-black to-gray-800 text-white' },
              { title: 'Predictive Travel', desc: 'From intent to itinerary', tone: 'bg-white border border-gray-200' },
              { title: 'Finance Sync', desc: 'Expenses. Policies. Approvals.', tone: 'bg-gradient-to-br from-gray-900 to-gray-700 text-white' },
              { title: 'Enterprise‑grade', desc: 'Security. Compliance. Control.', tone: 'bg-white border border-gray-200' },
              { title: 'Voice‑native', desc: 'Hands‑free Suitpax Voice', tone: 'bg-gradient-to-br from-black to-gray-900 text-white' },
            ].map((c, i) => (
              <div key={i} className={`rounded-2xl p-4 ${c.tone} hover:shadow-md transition-shadow`}>
                <div className="text-sm font-medium tracking-tight">{c.title}</div>
                <div className="text-[12px] opacity-80 mt-1">{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Suitpax Nation Newsletter */}
          <div className="mt-10 w-full max-w-2xl">
            <div className="text-center mb-3">
              <div className="text-xs font-semibold tracking-widest text-gray-700 uppercase">Suitpax Nation</div>
              <div className="text-[12px] text-gray-600 font-light">Join our newsletter for product drops, travel intel, and deep dives.</div>
            </div>
            <form onSubmit={subscribeNewsletter} className="flex items-center gap-2 bg-white/90 border border-gray-200 rounded-lg p-2 shadow-sm">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none h-10"
                required
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="h-10 px-4 rounded-md bg-black text-white hover:bg-gray-900"
              >
                {newsletterLoading ? 'Sending…' : 'Subscribe'}
              </button>
            </form>
            {newsletterMsg && <div className="mt-2 text-center text-xs text-gray-700">{newsletterMsg}</div>}
          </div>

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