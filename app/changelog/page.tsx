import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog | Suitpax AI",
  description: "Product updates and release notes for Suitpax AI.",
}

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                <span className="text-[10px] font-medium text-gray-700">Suitpax AI</span>
                <span className="text-[10px] text-gray-500">Changelog</span>
              </div>
              <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">Release Notes</h1>
            </div>

            <div className="mt-10 space-y-6">
              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium tracking-tight text-gray-900">Suitpax AI 0.0.1</h2>
                  <span className="text-xs text-gray-500">2025-01-01</span>
                </div>
                <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>New Suitpax Code hero and Ops Copilot recipes</li>
                  <li>AgentCode input with Vanta Halo background</li>
                  <li>Pricing and Plans updates; removed model mentions</li>
                  <li>Navigation improvements on mobile</li>
                  <li>New UI components: Accordion, Popover, Pagination</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}