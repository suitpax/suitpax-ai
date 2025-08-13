import type React from "react"
import { Plane } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FlightUsageChartProps {
  searches: number
  maxSearches: number
  bookings: number
}

export function FlightUsageChart({ searches, maxSearches, bookings }: FlightUsageChartProps) {
  const percentage = (searches / maxSearches) * 100

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Plane className="h-4 w-4" />
          Flight Searches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{searches} searches</span>
          <span>{bookings} bookings</span>
        </div>
        <Progress
          value={percentage}
          className="h-2 bg-gray-100"
          style={
            {
              "--progress-background": "#374151",
            } as React.CSSProperties
          }
        />
        <div className="text-xs text-gray-500">{maxSearches - searches} searches remaining</div>
      </CardContent>
    </Card>
  )
}
