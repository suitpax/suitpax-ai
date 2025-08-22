"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import Badge from "@/components/ui/badge"

export default function TrySuitpax() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setResponse(null)
    try {
      const res = await fetch("/api/enhanced-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      })
      if (!res.ok) throw new Error("Request failed")
      const json = await res.json()
      const text = json?.text || json?.message || JSON.stringify(json)
      setResponse(String(text))
    } catch (err: any) {
      setResponse(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <VantaHaloBackground className="relative w-full overflow-hidden bg-black">
      <section className="relative w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge text="Try Suitpax AI" className="bg-transparent hover:bg-transparent" />
              <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">Live Preview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-tighter text-white leading-none">Ask anything to Suitpax</h2>
            <p className="mt-4 text-xs sm:text-sm font-medium text-white/70 max-w-2xl mx-auto">A blackbox-style prompt input to quickly test how Suitpax AI responds to your travel, expense and policy questions.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-2.5">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Plan a business trip to London next week under €800"
                className="flex-1 bg-transparent text-sm md:text-base text-white placeholder:text-white/50 focus:outline-none h-10"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-9 px-4 rounded-xl bg-white text-black hover:bg-white/90 text-sm font-medium"
              >
                {loading ? "Thinking…" : "Ask"}
              </button>
            </div>
          </form>

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/90"
            >
              {response}
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">Serif headings</span>
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">Tracking‑tighter</span>
            <Link href="/changelog" className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">Latest updates</Link>
          </div>
        </div>
      </section>
    </VantaHaloBackground>
  )
}