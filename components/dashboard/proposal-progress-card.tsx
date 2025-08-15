"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProposalProgressCard() {
  const data = { proposals: 64, interviews: 12, hires: 10 }
  const totalBars = 40
  const makeBars = (count: number, color: string) => {
    return Array.from({ length: totalBars }, (_, i) => (
      <div key={i} className={`h-8 w-1 rounded ${i < count ? color : "bg-gray-200"}`} />
    ))
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Proposal Progress</CardTitle>
          <div className="text-xs text-gray-500">April 11, 2024</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <div>Proposals sent</div>
          <div>Interviews</div>
          <div>Hires</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-end gap-1">{makeBars(16, "bg-gray-900")}</div>
          <div className="flex items-end gap-1">{makeBars(12, "bg-orange-400")}</div>
          <div className="flex items-end gap-1">{makeBars(10, "bg-gray-600")}</div>
        </div>
        <div className="mt-4 grid grid-cols-3 text-center text-sm text-gray-900">
          <div>{data.proposals}</div>
          <div>{data.interviews}</div>
          <div>{data.hires}</div>
        </div>
      </CardContent>
    </Card>
  )
}
