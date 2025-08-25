"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ScoreOverview from "@/components/dashboard/scoring/score-overview"
import ScoreBreakdown from "@/components/dashboard/scoring/score-breakdown"
import ImprovementSuggestions from "@/components/dashboard/scoring/improvement-suggestions"
import PeerComparison from "@/components/dashboard/scoring/peer-comparison"
import TrendSparkline from "@/components/dashboard/scoring/trend-sparkline"

export default function ScoringPage() {
  const [score, setScore] = useState(72)
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Scoring</h1>
        <p className="text-gray-600 font-light">Intelligent score from 0–100 with clear drivers</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1"><CardContent className="p-4"><ScoreOverview score={score} /></CardContent></Card>
        <Card className="xl:col-span-2"><CardContent className="p-4"><TrendSparkline /></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2"><CardContent className="p-4"><ScoreBreakdown /></CardContent></Card>
        <Card className="xl:col-span-1"><CardContent className="p-4"><PeerComparison /></CardContent></Card>
      </div>

      <Card><CardContent className="p-4"><ImprovementSuggestions /></CardContent></Card>
    </div>
  )
}

