"use client"

import MiniCountdownBadge from "@/components/ui/mini-countdown"

export default function SuitpaxAIPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-medium tracking-tighter">Suitpax AI</h1>
        <p className="text-sm text-gray-600 mt-2">Rebuilding Prompt Kit from scratch — coming soon.</p>
        <div className="mt-4 flex justify-center">
          <MiniCountdownBadge target={new Date("2025-10-21T00:00:00Z")} title="Suitpax Launch" />
        </div>
      </div>
    </div>
  )
}
