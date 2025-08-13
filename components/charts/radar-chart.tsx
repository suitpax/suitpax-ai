import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { category: "Cost Efficiency", value: 0 },
  { category: "Time Savings", value: 0 },
  { category: "Policy Compliance", value: 0 },
  { category: "Travel Satisfaction", value: 0 },
  { category: "AI Optimization", value: 0 },
  { category: "Booking Speed", value: 0 },
]

const chartConfig = {
  value: {
    label: "Performance",
    color: "#374151",
  },
} satisfies ChartConfig

export function RadarChart() {
  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              className="text-xs font-medium"
            />
            <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
            <Radar
              dataKey="value"
              fill="#374151"
              fillOpacity={0.1}
              stroke="#374151"
              strokeWidth={2}
              dot={{ fill: "#374151", strokeWidth: 2, r: 3 }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900 mb-1">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          No data available yet
        </div>
        <div className="text-xs text-gray-500 font-light">
          Start using Suitpax to see your travel performance metrics
        </div>
      </div>
    </div>
  )
}

export function SuitpaxRadarChart() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-lg font-medium text-gray-900 tracking-tighter">Performance Overview</CardTitle>
        <CardDescription className="text-sm text-gray-600 font-light">
          Your Suitpax usage across different areas
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <RadarChart />
      </CardContent>
    </Card>
  )
}
