import type React from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TokenUsageChartProps {
  used: number
  total: number
  plan: string
}

export function TokenUsageChart({ used, total, plan }: TokenUsageChartProps) {
  const percentage = (used / total) * 100

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-900">AI Tokens</CardTitle>
        <div className="text-xs text-gray-600">{plan} Plan</div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{used.toLocaleString()} used</span>
          <span>{total.toLocaleString()} total</span>
        </div>
        <Progress
          value={percentage}
          className="h-2 bg-gray-100"
          style={
            {
              "--progress-background": percentage > 80 ? "#ef4444" : percentage > 60 ? "#f59e0b" : "#374151",
            } as React.CSSProperties
          }
        />
        <div className="text-xs text-gray-500">{(100 - percentage).toFixed(1)}% remaining</div>
      </CardContent>
    </Card>
  )
}
