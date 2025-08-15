"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare } from "lucide-react"

export function DailyTasksMiniCard() {
  const tasks = [
    { title: "Review expense receipts", done: false },
    { title: "Share itinerary with team", done: false },
    { title: "Schedule policy review", done: false },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-gray-700" />
          <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Today</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {tasks.map((t) => (
          <div key={t.title} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
            {t.title}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
