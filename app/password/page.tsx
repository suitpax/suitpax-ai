"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import CityAnimateText from "@/components/ui/city-animate-text"
import { Sparkles, Plane, Mic } from "lucide-react"

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

  useEffect(() => {
    const titles = [
      "Run your business travel like a product.",
      "From intent to itinerary, instantly.",
      "Policy‑aware bookings. Real‑time savings.",
      "Conversations that turn into trips.",
      "Smarter flights. Faster finance.",
      "One platform. Travel, spend, compliance.",
      "Predict. Plan. Automate.",
      "Design. Ship. Scale.",
      "Build. Travel. Code.",
      "Context. Voice. Agents.",
      "Flights. Stays. Finance.",
      "Seat maps. Price tracking. Rebooking.",
      "Made for teams that move fast.",
      "Your travel copilot, 24/7.",
      "Reduce costs, not ambition.",
      "NDC direct. 3DS secure. PCI‑safe.",
      "Travel that fits your policy.",
      "Talk to book. Track to save.",
      "From Slack to seat in minutes.",
      "All your trips. One beautiful flow.",
      "Suitpax AI for modern companies.",
      "Suitpax AI: Manage. Travel. Code.",
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

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactMsg(null)
    setContactLoading(true)
    try {
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
    <VantaHaloBackground
      className="relative w-full min-h-[100vh] overflow-hidden bg-white"
      options={{
        backgroundColor: 0xf3f4f6,
        baseColor: 0xe5e7eb,
        color: 0x93c5fd,
        color2: 0xdbeafe,
        size: 0.8,
        amplitudeFactor: 0.7,
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
          <div className="mt-7">
            <CityAnimateText />
          </div>

          {/* Variant lines */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-gray-700">
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Design. Ship. Scale.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Predict. Plan. Automate.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Flights. Hotels. Finance.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Build. Travel. Code.</span>
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 border border-black/10">Chat. Voice. Agents.</span>
          </div>

          {/* Access input */}
          <div className="mt-6 text-[11px] text-gray-600">Enter the access key to explore our next‑gen business travel platform.</div>
          <form onSubmit={handleSubmit} className="mt-2 w-full max-w-3xl mx-auto px-2">
            <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur border border-gray-200 rounded-full p-2 shadow-sm">
              <div className="relative h-12 w-12 md:h-12 md:w-12 rounded-full overflow-hidden bg-gray-200 ring-1 ring-gray-300/50">
                <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center object-[50%_30%] scale-125">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20(online-video-cutter.com)%20(1)-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4" type="video/mp4" />
                </video>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key to continue"
                className="flex-1 bg-transparent text-[13px] md:text-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none h-10"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full text-black hover:text-gray-700 flex items-center justify-center"
                aria-label="Continue"
                title="Continue"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
            {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
          </form>

          {/* Removed city example cards to declutter */}

          {/* Key highlights (2 only, glass) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl w-full">
            {[
              { title: 'Predictive Travel', desc: 'From intent to itinerary', tone: 'bg-white/80 border border-gray-200 text-gray-900' },
              { title: 'Enterprise‑grade', desc: 'Security. Compliance. Control.', tone: 'bg-white/80 border border-gray-200 text-gray-900' },
            ].map((c, i) => (
              <div key={i} className={`rounded-2xl p-4 ${c.tone} backdrop-blur supports-[backdrop-filter]:backdrop-blur hover:shadow-sm transition-shadow`}>
                <div className="text-sm font-medium tracking-tight">{c.title}</div>
                <div className="text-[12px] opacity-80 mt-1">{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Contact form (Brevo-ready): message, email, company */}
          <div className="mt-9 w-full max-w-2xl">
            <div className="text-center mb-3">
              <div className="text-xs font-semibold tracking-widest text-gray-700 uppercase">Get early access</div>
              <div className="text-[12px] text-gray-600 font-light">Tell us about your team and we’ll reach out with access.</div>
            </div>
            <form onSubmit={submitContact} className="space-y-2">
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="What do you want to achieve with Suitpax?"
                className="w-full bg-white/90 border border-gray-200 rounded-2xl p-3 text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none backdrop-blur"
                rows={3}
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Work email"
                  className="flex-1 bg-white/90 border border-gray-200 rounded-2xl p-2 text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none backdrop-blur"
                  required
                />
                <input
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  placeholder="Company"
                  className="flex-1 bg-white/90 border border-gray-200 rounded-2xl p-2 text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none backdrop-blur"
                  required
                />
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="px-4 rounded-2xl bg-black text-white hover:bg-gray-900 text-[13px]"
                >
                  {contactLoading ? 'Sending…' : 'Request access'}
                </button>
              </div>
            </form>
            {contactMsg && <div className="mt-2 text-center text-xs text-gray-700">{contactMsg}</div>}
          </div>

          {/* Reduced badges spacing */}
          <div className="flex items-center gap-3 mt-5">
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