import type { Metadata } from "next"
import Hiring from "@/components/marketing/hiring"

export const metadata: Metadata = {
  title: "Careers | Suitpax",
  description: "Join Suitpax and help build the future of AI-powered business travel.",
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
              <span className="text-[10px] text-gray-500">Careers</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">Build the future of travel</h1>
            <p className="mt-3 text-base text-gray-600 font-medium">I’m building a world‑class team to shape the next era of AI‑powered business travel.</p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Hiring />
        </div>
      </section>
    </main>
  )
}