"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"

const weekData = [
  { day: "S", value: 1200 },
  { day: "M", value: 900 },
  { day: "T", value: 2567 },
  { day: "W", value: 1800 },
  { day: "T", value: 2100 },
  { day: "F", value: 1600 },
  { day: "S", value: 1900 },
]

export function IncomeTrackerCard() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Income Tracker</CardTitle>
              <p className="text-xs text-gray-500">Track changes in income over time</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-700">
            Week <ChevronDown className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-2xl font-medium tracking-tight text-gray-900">+20%</div>
            <div className="text-xs text-gray-500">This week is higher than last</div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center rounded-lg bg-gray-900 text-white px-2.5 py-1 text-xs">$2,567</div>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111827" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#111827" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} interval={0} tickMargin={8} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E5E7EB", borderRadius: 12 }} formatter={(v) => [`$${v}`, "Income"]} />
              <Area type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} fill="url(#incomeGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
