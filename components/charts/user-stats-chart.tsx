import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", flights: 2, expenses: 1200 },
  { month: "February", flights: 4, expenses: 2100 },
  { month: "March", flights: 1, expenses: 800 },
  { month: "April", flights: 3, expenses: 1800 },
  { month: "May", flights: 5, expenses: 2800 },
  { month: "June", flights: 2, expenses: 1400 },
]

const chartConfig = {
  flights: {
    label: "Flights",
    color: "#374151",
  },
  expenses: {
    label: "Expenses",
    color: "#6b7280",
  },
} satisfies ChartConfig

export function UserStatsChart() {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Travel Activity</CardTitle>
        <CardDescription className="text-sm text-gray-600">Your monthly travel statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area dataKey="expenses" type="natural" fill="#f3f4f6" fillOpacity={0.4} stroke="#6b7280" stackId="a" />
              <Area dataKey="flights" type="natural" fill="#374151" fillOpacity={0.8} stroke="#374151" stackId="a" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-gray-900">
              Trending up by 12% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-gray-600">Based on your travel activity</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
