import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Ethics | Suitpax",
  description: "Our ethical principles for building and deploying AI at Suitpax.",
}

export default function AIEthicsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
              <span className="text-[10px] text-gray-500">AI Ethics</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">AI Ethics Charter</h1>
            <p className="mt-3 text-base text-gray-600 font-medium">Principles that guide how I design, build, and deploy AI systems.</p>
          </div>

          <div className="mt-8 space-y-6 text-sm text-gray-700">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">1. Safety & Reliability</h2>
              <p>I prioritize safe and reliable systems. I test thoroughly, monitor for regressions, and respond quickly to issues.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">2. Privacy & Security</h2>
              <p>I minimize data collection and protect data with industry‑standard security. I never sell personal data.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">3. Transparency</h2>
              <p>I communicate how the system uses data, the limitations of models, and provide clear user controls.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">4. Fairness</h2>
              <p>I strive to reduce bias and evaluate for disparate impact. I continuously improve datasets and evaluation practices.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">5. Human Oversight</h2>
              <p>I design for human‑in‑the‑loop where appropriate, with clear escalation paths and auditability.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">6. Accountability</h2>
              <p>I take responsibility for outcomes, maintain logs for audits, and provide channels to report issues or appeal decisions.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">7. Sustainability</h2>
              <p>I consider the environmental impact of AI workloads and optimize for efficiency when possible.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}