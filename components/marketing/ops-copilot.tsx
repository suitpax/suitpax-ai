"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const recipes = [
  { title: "Generate Policy Editor UI", desc: "React + Tailwind, tabs for Company/Policies/Approvals", tag: "UI" },
  { title: "Expense Anomaly Detector", desc: "Identify outliers in travel expenses (JSON input)", tag: "Insights" },
  { title: "Team Travel Dashboard", desc: "Flights/Hotels/Spend KPIs with filters", tag: "Dashboard" },
  { title: "Booking Workflow Bot", desc: "Approve under-threshold trips automatically", tag: "Automation" },
]

export default function OpsCopilot() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            <span className="text-[10px] font-medium text-gray-700">Suitpax Code</span>
            <span className="text-[10px] text-gray-500">Ops Copilot</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-gray-900">Build with AI recipes</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">Click a recipe to preview what Suitpax Code can generate for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {recipes.map((r, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ y: -2 }}
              className={`text-left rounded-2xl border ${active === i ? "border-black" : "border-gray-200"} bg-white p-4 transition-all shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">{r.title}</div>
                <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-[10px] text-gray-700">{r.tag}</span>
              </div>
              <div className="text-xs text-gray-600">{r.desc}</div>
            </motion.button>
          ))}
        </div>
        {active !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500 mb-1">Preview</div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-[12px] text-gray-700 whitespace-pre-wrap">
{`> ${recipes[active].title}\n${recipes[active].desc}\n\nPrompt example:\n"${recipes[active].title} using TypeScript + Tailwind. Provide components and example props."`}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}