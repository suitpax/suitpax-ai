"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function AiSuggestionsCard() {
  const suggestions = [
    "Connect your bank to automate expense tracking.",
    "Invite teammates to collaborate on trips.",
    "Enable policy rules to increase compliance.",
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gray-700" />
          <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">AI Suggestions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {suggestions.map((s) => (
          <div key={s} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
            {s}
          </div>
        ))}
        <div className="text-xs text-gray-600">
          New: Check real-time advisories in <Link className="underline" href="/dashboard/radar">Radar</Link>.
        </div>
      </CardContent>
    </Card>
  )
}
