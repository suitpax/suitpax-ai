"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
// Vanta removed for accessibility and performance; using static gradient
import CityAnimateText from "@/components/ui/city-animate-text"
import MiniCountdownBadge from "@/components/ui/mini-countdown"
import { z } from "zod"
import { SmallSessionLoader } from "@/components/ui/loaders"
// Icons removed (unused)

export default function PasswordGatePage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [headline, setHeadline] = useState("Suitpax AI: Build. Travel. Code.")
  const [contactEmail, setContactEmail] = useState("")
  const [contactCompany, setContactCompany] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [contactMsg, setContactMsg] = useState<string | null>(null)
  const [contactLoading, setContactLoading] = useState(false)
  // Add visibility toggle
  const [showPassword, setShowPassword] = useState(false)

  const accessSchema = z.object({
    password: z.string().min(6, "Access key must be at least 6 characters"),
  })

  const contactSchema = z.object({
    email: z.string().email("Enter a valid email"),
    company: z.string().min(2, "Company is required"),
    message: z.string().min(10, "Message should be at least 10 characters"),
  })

  useEffect(() => {
    const titles = [
      "Suitpax AI: Business travel. Expenses. Voice.",
      "Run business travel with AI Agents and Analytics.",
      "From itinerary to expense — one intelligent flow.",
      "Policy‑aware bookings. Real‑time savings.",
      "Travel. Expense. Voice AI. Agents.",
      "Business travel copilots with live Analytics.",
      "Talk to book. Track to save. Automate compliance.",
      "Suitpax AI: Travel. Expense. Code — for teams.",
      "Context. Voice. Agents. Analytics.",
      "Smarter flights. Faster finance.",
    ]
    setHeadline(titles[Math.floor(Math.random() * titles.length)])
  }, [])

  const launchPhrases = [
    "Preparing the gears…",
    "Updating Suitpax AI…",
    "Integrating systems…",
    "Collecting data…",
    "Calibrating policies…",
    "Optimizing itineraries…",
    "Syncing travel wallets…",
    "Securing payments (3DS)…",
    "Fetching NDC content…",
    "Mapping seats in real‑time…",
    "Tuning price tracking…",
    "Booting voice agents…",
    "Orchestrating workflows…",
    "Connecting to airlines…",
    "Verifying compliance…",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const parsed = accessSchema.safeParse({ password })
      if (!parsed.success) {
        setError(parsed.error.errors[0]?.message || "Invalid password")
        return
      }
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

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactMsg(null)
    setContactLoading(true)
    try {
      const parsed = contactSchema.safeParse({ email: contactEmail, company: contactCompany, message: contactMessage })
      if (!parsed.success) {
        setContactMsg(parsed.error.errors[0]?.message || 'Invalid data')
        return
      }
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactEmail, company: contactCompany, message: contactMessage }),
      })
      const json = await resp.json()
      if (!resp.ok) throw new Error(json?.error || 'Message failed')
      setContactMsg('Thanks! We will reach out shortly.')
      setContactEmail("")
      setContactCompany("")
      setContactMessage("")
    } catch (err: any) {
      setContactMsg(err?.message || 'Something went wrong')
    } finally {
      setContactLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-[100vh] overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Removed separate agents banner to avoid duplication with the sticky top bar */}
          <div className="inline-flex items-center rounded-xl bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-900 mb-4 border border-gray-200">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={60} height={15} className="h-3 w-auto mr-1" />
            Private preview access
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tighter text-black leading-tight max-w-4xl"
          >
            {headline}
          </motion.h1>

          {/* Intro copy moved closer to the input */}

          {/* Shimmer text */}
          <div className="mt-4 text-gray-700 text-sm font-medium relative inline-block">
            <span className="relative z-10">Shaping the next‑gen of business travel</span>
            <span className="absolute inset-0 animate-hero-shimmer bg-[linear-gradient(110deg,#ffffff,45%,#9ca3af,55%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent" />
          </div>

          {/* Animated city text (cleaner spacing) */}
          <div className="mt-8">
            <CityAnimateText />
          </div>

          {/* Mini badges under animated text */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-700">
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 border border-black/10">Design. Ship. Scale.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 border border-black/10">Predict. Plan. Automate.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 border border-black/10">Flights. Hotels. Finance.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 border border-black/10">Chat. Voice. Agents.</span>
          </div>
          {/* Removed small city strip */}

          {/* Access input */}
          <div className="mt-6 text-[11px] text-gray-600">Enter the access key to explore our next‑gen business travel platform.</div>
          <form onSubmit={handleSubmit} className="mt-2 w-full max-w-xl mx-auto px-2">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 rounded-full p-1.5 shadow-sm">
              <div className="relative h-9 w-9 md:h-9 md:w-9 rounded-full overflow-hidden bg-gray-200 ring-1 ring-gray-300/50">
                <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center object-[50%_30%] scale-125">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20(online-video-cutter.com)%20(1)-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4" type="video/mp4" />
                </video>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key to continue"
                className="flex-1 bg-transparent text-[12px] md:text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none h-8"
                required
                aria-invalid={!!error}
                aria-describedby={error ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 inline-flex items-center justify-center text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide access key" : "Show access key"}
                title={showPassword ? "Hide access key" : "Show access key"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.62-1.43 1.5-2.75 2.59-3.89M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1 2.3-2.5 4.17-4.33 5.5M14 14a3 3 0 1 1-4-4"/><path d="M1 1l22 22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-7 w-7 md:h-8 md:w-8 rounded-full text-black hover:text-gray-700 flex items-center justify-center"
                aria-label="Continue"
                title="Continue"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
            {error && <div id="password-error" className="mt-2 text-xs text-red-600">{error}</div>}
          </form>

          {/* Removed city example cards to declutter */}

          {/* Key highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl w-full">
            <div className="rounded-2xl p-4 bg-white/80 border border-gray-200 text-gray-900 backdrop-blur supports-[backdrop-filter]:backdrop-blur hover:shadow-sm transition-shadow">
              <div className="text-sm font-medium tracking-tight">Predictive Travel</div>
              <div className="text-[12px] opacity-80 mt-1">From intent to itinerary</div>
            </div>
            <div className="rounded-2xl p-4 bg-black text-white border border-black/10 backdrop-blur supports-[backdrop-filter]:backdrop-blur hover:shadow-black/20 transition-shadow">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-0.5 text-[10px] font-medium border border-white/20">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:150ms]" />
                  </span>
                  <span>Our AI Agents están trabajando...</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-0.5 text-[10px] font-medium border border-white/20">
                  <SmallSessionLoader label="" />
                  <span>Booting services</span>
                </span>
                <a href="/changelog" className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-0.5 text-[10px] font-medium border border-white/20 hover:bg-white/15">Changelog →</a>
              </div>
            </div>
          </div>

          {/* Contact form (Brevo-ready): message, email, company */}
          <div className="mt-10 w-full max-w-2xl">
            <div className="text-center mb-3">
              <div className="text-xs font-semibold tracking-widest text-gray-700 uppercase">Get early access</div>
              <div className="text-[12px] text-gray-600 font-light">Tell us about your team and we’ll reach out with access.</div>
            </div>
            <form onSubmit={submitContact} className="space-y-3">
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="What do you want to achieve with Suitpax?"
                className="w-full bg-white/90 border border-gray-200 rounded-2xl p-3 text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none backdrop-blur min-h-[120px]"
                rows={4}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Work email"
                  className="bg-white/90 border border-gray-200 rounded-2xl p-2.5 text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none backdrop-blur"
                  required
                />
                <input
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  placeholder="Company"
                  className="bg-white/90 border border-gray-200 rounded-2xl p-2.5 text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none backdrop-blur"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={contactLoading}
                className="w-full md:w-auto md:self-end px-6 h-10 rounded-2xl bg-black text-white hover:bg-gray-900 text-[13px]"
              >
                {contactLoading ? 'Sending…' : 'Request access'}
              </button>
            </form>
            {contactMsg && <div className="mt-2 text-center text-xs text-gray-700">{contactMsg}</div>}
          </div>

          {/* Reduced badges spacing */}
          <div className="flex items-center gap-3 mt-5">
            <MiniCountdownBadge target={new Date('2025-10-21T00:00:00Z')} title="Official launch" />
            <span className="inline-flex items-center rounded-xl bg-white/10 px-2.5 py-0.5 text-[9px] font-medium text-white/90 border border-white/15">Private beta</span>
          </div>
        </div>
      </div>

      {/* Top sticky banner (full width) — merged with AI Agents marquee */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/95 text-gray-300 text-[11px] font-medium tracking-tight border-b border-white/10">
          <div className="flex -space-x-2">
            {["/agents/agent-5.png","/agents/agent-15.png","/agents/agent-3.png","/agents/agent-8.png"].slice(0,4).map((src, i) => (
              <img key={i} src={src} alt="AI Agent" className="h-6 w-6 rounded-full ring-1 ring-white/20 object-cover" />
            ))}
          </div>
          <div className="relative flex-1 overflow-hidden h-5">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="whitespace-nowrap text-[11px] text-gray-300 animate-[marquee_16s_linear_infinite]">
                {launchPhrases.concat(launchPhrases).map((p, idx) => (
                  <span key={idx} className="mx-4">{p}</span>
                ))}
              </div>
            </div>
          </div>
          <a href="mailto:ai@suitpax.com" className="rounded-xl border border-white/10 bg-white/20 px-2.5 py-1 text-[10px] text-black hover:bg-white/30 backdrop-blur">
            Contact us
          </a>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="px-4 py-2 bg-black/95 text-gray-300 text-center text-[11px] font-medium tracking-tight">
          Private preview • Building the future of business travel
        </div>
        <div className="px-4 py-1 bg-black/95 text-center text-[10px] text-gray-400">
          Suitpax™ is a trademark of Suitpax. All product names, logos, and brands are property of their respective owners.
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
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
    </div>
  )
}