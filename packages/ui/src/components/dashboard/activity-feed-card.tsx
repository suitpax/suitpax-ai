"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityFeedCard() {
  const items = [
    { title: "Flight confirmed to NYC", detail: "2 min ago" },
    { title: "Expense report approved", detail: "1 hour ago" },
    { title: "Team meeting scheduled", detail: "3 hours ago" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {items.map((it) => (
          <div key={it.title} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-900">{it.title}</div>
            <div className="text-xs text-gray-500">{it.detail}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}