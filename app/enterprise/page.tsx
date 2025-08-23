import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Suitpax",
  description: "Enterprise business travel with MCP AI agents, SLAs, global compliance and deep integrations.",
  alternates: { canonical: "https://suitpax.com/enterprise" },
}

export default function EnterprisePage() {
  return (
    <main className="w-full bg-black text-gray-200">
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-xl border border-white/20 px-3 py-1 text-[10px] font-medium">Enterprise</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">Enterprise travel programs, reimagined</h1>
          <p className="mt-3 text-sm md:text-base text-gray-300 max-w-2xl">MCP AI agents, global compliance and SLAs. Voice to book, auto‑apply policies, expense control & OCR at scale, and integrations with your ERP/HRIS and data warehouse.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {["MCP agents with org context","Concierge 24/7 • SLAs","Global policy & compliance","SSO/SCIM • ERP/HRIS • DWH","Cost centers & budgets at scale","NDC + 200+ airlines"].map((t) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-medium text-white">{t}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a href="mailto:hello@suitpax.com" className="inline-flex items-center rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-gray-100">Talk to sales</a>
          </div>
        </div>
      </section>
    </main>
  )
}