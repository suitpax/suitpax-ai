import type { Metadata } from "next"
import LaunchHero from "@/components/marketing/launch-hero"
import OpsCopilot from "@/components/marketing/ops-copilot"
import AgentCode from "@/components/marketing/agent-code"

export const metadata: Metadata = {
  title: "Suitpax Code | AI for building UIs and tools",
  description: "Build production-grade UIs, tools, and dashboards with Suitpax Code and AI agents.",
}

export default function CodePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
              <span className="text-[10px] text-gray-500">Code</span>
            </div>
          </div>
        </div>
      </section>
      <LaunchHero />
      <OpsCopilot />
      <AgentCode />
    </main>
  )
}