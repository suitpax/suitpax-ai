import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { category: "Flights", value: 80 },
  { category: "Hotels", value: 65 },
  { category: "Expenses", value: 90 },
  { category: "Policies", value: 75 },
  { category: "AI Usage", value: 85 },
  { category: "Efficiency", value: 70 },
]

const chartConfig = {
  value: {
    label: "Usage",
    color: "#374151",
  },
} satisfies ChartConfig

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
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 10 }} className="text-xs" />
              <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
              <Radar
                dataKey="value"
                fill="#374151"
                fillOpacity={0.15}
                stroke="#374151"
                strokeWidth={2}
                dot={{ fill: "#374151", strokeWidth: 2, r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none text-gray-900">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          Overall efficiency up 15% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-500 font-light text-xs">Based on your last 30 days of activity</div>
      </CardFooter>
    </Card>
  )
}
