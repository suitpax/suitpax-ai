"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Circle({ value }: { value: number }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg width="60" height="60" className="rotate-[-90deg]">
      <circle cx="30" cy="30" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
      <circle cx="30" cy="30" r={radius} stroke="#111827" strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="rotate-[90deg] text-xs fill-gray-900">
        {value}%
      </text>
    </svg>
  )
}

export function GoalTrackerCard() {
  const goals = [
    { label: "Policy Compliance", value: 0 },
    { label: "Cost Savings", value: 0 },
    { label: "AI Utilization", value: 0 },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Goal Tracker</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-3 gap-4">
        {goals.map((g) => (
          <div key={g.label} className="text-center">
            <Circle value={g.value} />
            <div className="text-xs text-gray-600 mt-2">{g.label}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
