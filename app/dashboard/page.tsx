"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"

export default function DashboardPage() {
  const cards = [
    { id: "bank-connection", component: <BankConnectionCard /> },
    { id: "expense-trends", component: <ExpenseTrendsChart /> },
    { id: "business-metrics", component: <BusinessMetricsChart /> },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-medium leading-none text-gray-900 mb-2">Overview</h1>
          <p className="text-lg font-light tracking-tighter text-gray-600">Business travel and spend at a glance</p>
          <p className="text-sm text-gray-500 font-light mt-1">Track performance, search flights, and manage policies</p>
        </motion.div>
        <div className="mt-6">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-gray-600">Suitpax AI — Ask anything. Travel. Business. Code.</p>
            </div>
            <PromptInput
              value={""}
              onValueChange={() => {}}
              onSubmit={(v) => {
                const val = typeof v === "string" ? v : ""
                if (!val.trim()) return
                window.location.href = `/dashboard/ai-center?tab=chat&prompt=${encodeURIComponent(val)}`
              }}
              isLoading={false}
              className="bg-white border-gray-200 shadow-sm"
            >
              <PromptInputTextarea placeholder="Ask the AI to plan a trip, analyze an expense, or draft a policy…" />
              <PromptInputActions>
                <PromptInputAction tooltip="Send">
                  <button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-2xl h-7 w-7 p-0 inline-flex items-center justify-center">
                    <ArrowUp className="size-3.5" />
                  </button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c) => (
          <div key={c.id}>{c.component}</div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/dashboard/ai-center" className="block group">
          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 rounded-2xl border border-gray-800 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium tracking-tight text-white">Suitpax AI</h3>
                <p className="text-xs text-gray-300">Ask, plan, and manage with AI</p>
              </div>
              <div className="text-white text-opacity-80 text-xs">↗</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}