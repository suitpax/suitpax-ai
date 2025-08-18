"use client"

import { motion } from "framer-motion"

const events = Array.from({ length: 31 }).map((_, i) => {
  // Months from Oct 2023 to Oct 2025 inclusive (25 months, but we create a denser list for visual effect)
  // We'll synthesize realistic milestones across product, AI, flights, billing, MCP etc.
  const base = new Date(2023, 9, 1) // Oct 1, 2023
  const d = new Date(base.getFullYear(), base.getMonth() + i, 1)
  const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const notes = [
    "First code commits and project scaffolding",
    "Supabase auth + dashboard skeleton",
    "Flights search prototype and UI system",
    "AI prompt input and policy copy",
    "Duffel integration baseline (offers)",
    "Seat maps and ancillaries wiring",
    "Payment intents + 3DS return",
    "Orders creation and billing logs",
    "PDF receipts and storage",
    "AI Center and memory refresh",
    "MCP groundwork for agents",
    "City images and suggestions locale",
    "Filters UX and airlines selector",
    "Business Travel page: ops + stack",
    "Analytics and token counters",
    "Approvals and requests stubs",
    "Mail + meetings hooks",
    "Policy helpers (refundable/changeable)",
    "Price tracking and load-more",
    "Design polish: slider and badges",
    "Voice AI demo and cloud utils",
    "Partners showcase experiments",
    "Hero personalization",
    "AI receipts and booking finalize",
    "Events module and brief form",
    "Integrations hub and MCP remote",
    "Loyalty endpoints baseline",
    "Security & edge runtime tune-up",
    "Marketing API-first story",
    "Drop timeline (internal) ready",
    "Suitpax launches",
  ]
  return { label, text: notes[Math.min(i, notes.length - 1)] }
})

export default function CodeTimeline() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-black">Two Years of Building</h2>
          <p className="text-sm text-gray-700 font-light mt-2">From the first line of code to launch — a realistic journey of product, AI and travel infra.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.02, 0.5) }}
              className="relative rounded-2xl border border-black/10 bg-white/60 backdrop-blur-md p-4 shadow-sm hover:shadow-md"
            >
              <div className="text-xs text-gray-700 font-medium tracking-tight">{e.label}</div>
              <div className="text-sm text-black font-light mt-1">{e.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

