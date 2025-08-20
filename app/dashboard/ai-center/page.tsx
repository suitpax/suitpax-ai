"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AICenterPage() {
  const sp = useSearchParams()
  const tab = sp.get("tab") || "chat"

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "voice", label: "Voice" },
    { id: "code", label: "Code" },
  ]

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">AI Center</h1>
        </div>

        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/ai-center?tab=${t.id}`}
                className={`whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium ${tab === t.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {tab === "chat" && (
            <iframe src="/dashboard/suitpax-ai" className="w-full min-h-[70vh] rounded-xl border border-gray-200 bg-white" />
          )}
          {tab === "voice" && (
            <iframe src="/dashboard/voice-ai" className="w-full min-h-[70vh] rounded-xl border border-gray-200 bg-white" />
          )}
          {tab === "code" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">Coming soon: Suitpax Code.</div>
          )}
        </div>
      </div>
    </div>
  )
}