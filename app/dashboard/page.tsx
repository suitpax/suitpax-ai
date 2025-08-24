"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { createClient } from "@/lib/supabase/client"
import DashboardOnboarding from "@/components/dashboard/dashboard-onboarding"
import { OnboardingPrompt } from "@/components/dashboard/onboarding-prompt"

export default function DashboardPage() {
  const [greet, setGreet] = useState("Good day")
  const [name, setName] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)
  const [skippedOnboarding, setSkippedOnboarding] = useState(false)
  const supabase = createClient()
  useEffect(() => {
    const hours = new Date().getHours()
    setGreet(hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening')
    try {
      const raw = localStorage.getItem('suitpax_user_name')
      setName(raw && raw.trim() ? raw : '')
      const skipped = localStorage.getItem('suitpax_onboarding_skipped')
      setSkippedOnboarding(skipped === 'true')
    } catch {}
  }, [])
  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)
        const { data: profile } = await supabase.from('profiles').select('onboarding_completed, full_name, first_name').eq('id', user.id).single()
        if (profile) {
          setOnboardingCompleted(!!profile.onboarding_completed)
          if (!name && (profile.first_name || profile.full_name)) {
            setName(profile.first_name || profile.full_name || '')
          }
        } else {
          setOnboardingCompleted(false)
        }
      } catch (e) {
        console.error(e)
        setOnboardingCompleted(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const cards = [
    { id: "bank-connection", component: <BankConnectionCard /> },
    { id: "expense-trends", component: <ExpenseTrendsChart /> },
    { id: "business-metrics", component: <BusinessMetricsChart /> },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Onboarding gate: show full flow if not completed and not skipped; otherwise show compact prompt until completed */}
      {onboardingCompleted === false && userId && !skippedOnboarding && (
        <div className="mb-8">
          <DashboardOnboarding
            userId={userId}
            onComplete={() => { setOnboardingCompleted(true); setSkippedOnboarding(false) }}
            onSkip={() => { setSkippedOnboarding(true) }}
          />
        </div>
      )}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none text-gray-900 mb-1">My Dashboard</h1>
          <p className="text-sm font-light tracking-tighter text-gray-600">{greet}{name ? `, ${name}` : ''} — welcome to your dashboard</p>
          <p className="text-sm text-gray-500 font-light mt-1">Track performance, search flights, and manage policies</p>
        </motion.div>
        {onboardingCompleted === false && skippedOnboarding && (
          <div className="mt-4">
            <OnboardingPrompt userName={name} onDismiss={() => setSkippedOnboarding(true)} />
          </div>
        )}
        <div className="mt-6">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-gray-600">Suitpax AI — Ask anything. Travel. Business. Code.</p>
            </div>
            <PromptInput
              value={""}
              onValueChange={() => {}}
              onSubmit={() => {}
              }
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