"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function InsightsSummaryCard() {
  const insights = [
    { label: "Proposals sent", value: 64, delta: 4 },
    { label: "Interviews", value: 12, delta: -1 },
    { label: "Hires", value: 10, delta: 2 },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Quick Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((i) => (
          <div key={i.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600">{i.label}</div>
                <div className="text-xl font-medium tracking-tight text-gray-900">{i.value}</div>
              </div>
              <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${i.delta>=0?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
                {i.delta>=0? <TrendingUp className="h-3 w-3 mr-1"/>:<TrendingDown className="h-3 w-3 mr-1"/>}
                {i.delta>=0? `+${i.delta}%`:`${i.delta}%`}
              </div>
            </div>
            <div className="h-2 mt-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900" style={{ width: `${Math.min(100, i.value)}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
