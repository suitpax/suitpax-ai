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
        <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
              <span className="text-[10px] text-gray-500">Code</span>
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-medium tracking-tighter text-black">Build with AI, ship faster</h1>
            <p className="mt-3 text-gray-600 font-medium">Production-grade components, SDKs and agent workflows to build enterprise UIs and tools in hours.</p>
          </div>

          {/* Overview */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { title: "UI Kits", desc: "Composable React components for dashboards, workflows and data-heavy UIs" },
              { title: "Agents SDK", desc: "Task-oriented agents with tools, memory and safety rails" },
              { title: "Templates", desc: "Starter kits for finance ops, travel ops and internal tools" },
            ].map((b, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 p-4 bg-white/60">
                <p className="text-sm font-medium text-black">{b.title}</p>
                <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live demos already built */}
      <div className="space-y-6 lg:space-y-8">
        <LaunchHero />
        <OpsCopilot />
        <AgentCode />
      </div>

      {/* Capabilities */}
      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-4">What you can build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                t: "AI Workflows",
                d: "Form builders, approvals and automations with agent tools (mail, calendar, flights, expenses).",
              },
              { t: "Data UX", d: "Tables, charts and editors for finance and operations at enterprise scale." },
              { t: "Copilots", d: "Context-aware assistants with memory, RAG and safe tool execution." },
              { t: "Dashboards", d: "Plug-and-play layouts with auth, theming and responsive navigation." },
            ].map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4 bg-white">
                <p className="text-sm font-medium text-black">{c.t}</p>
                <p className="text-sm text-gray-600 mt-1">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK + CLI */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-5 bg-white">
              <h3 className="text-lg font-medium tracking-tight text-black">Agents SDK</h3>
              <p className="text-sm text-gray-600 mt-2">Define tasks, tools and memory. Plug into UI components and ship.</p>
              <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-auto">
{`import { defineAgent } from "@suitpax/code"

export const travelAgent = defineAgent({
  name: "Kahn",
  tools: ["flights", "email", "calendar"],
  memory: true,
})`}
              </pre>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5 bg-white">
              <h3 className="text-lg font-medium tracking-tight text-black">CLI & Templates</h3>
              <p className="text-sm text-gray-600 mt-2">Bootstrap a working app with auth, dashboard and sample agents.</p>
              <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-auto">
{`npx create-suitpax-app@latest
cd app && pnpm dev`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm text-gray-600">Get early access</p>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-black mt-1">Try Suitpax Code</h3>
          <a href="/contact" className="inline-flex items-center mt-4 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium">
            Talk to founder
          </a>
        </div>
      </section>
    </main>
  )
}