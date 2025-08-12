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
    <Card className="bg-white border-gray-200">
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">Performance Overview</CardTitle>
        <CardDescription className="text-sm text-gray-600">Your Suitpax usage across different areas</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <PolarGrid stroke="#f3f4f6" />
              <Radar dataKey="value" fill="#374151" fillOpacity={0.2} stroke="#374151" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-gray-900">
          Overall efficiency up 15% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-600">Based on your last 30 days of activity</div>
      </CardFooter>
    </Card>
  )
}
