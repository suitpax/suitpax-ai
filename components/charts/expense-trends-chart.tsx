"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

const expenseData = [
  { month: "Jan", flights: 0, hotels: 0, meals: 0, total: 0 },
  { month: "Feb", flights: 0, hotels: 0, meals: 0, total: 0 },
  { month: "Mar", flights: 0, hotels: 0, meals: 0, total: 0 },
  { month: "Apr", flights: 0, hotels: 0, meals: 0, total: 0 },
  { month: "May", flights: 0, hotels: 0, meals: 0, total: 0 },
  { month: "Jun", flights: 0, hotels: 0, meals: 0, total: 0 },
]

export function ExpenseTrendsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M")

  const totalExpenses = expenseData.reduce((sum, month) => sum + month.total, 0)
  const avgMonthlyExpense = totalExpenses / expenseData.length
  const trend = 0 // Since all values are 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Expense Trends</CardTitle>
                <p className="text-xs text-gray-500 font-light">Monthly spending analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
              <Calendar className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">{selectedPeriod}</span>
            </div>
          </div>

          {/* Period Selection */}
          <div className="flex items-center gap-2 mt-4">
            {["3M", "6M", "1Y"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs rounded-xl bg-gray-900 hover:bg-gray-800"
              >
                {period}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">${totalExpenses}</div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">${avgMonthlyExpense}</div>
              <div className="text-xs text-gray-500">Monthly Avg</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-lg font-medium text-gray-900">{Math.abs(trend)}%</span>
              </div>
              <div className="text-xs text-gray-500">vs Last Period</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenseData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="flightsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B7280" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6B7280" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="hotelsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  interval={0}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [`$${value}`, name]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#374151"
                  strokeWidth={2}
                  fill="url(#totalGradient)"
                  name="Total"
                />
                <Area
                  type="monotone"
                  dataKey="flights"
                  stroke="#6B7280"
                  strokeWidth={1.5}
                  fill="url(#flightsGradient)"
                  name="Flights"
                />
                <Area
                  type="monotone"
                  dataKey="hotels"
                  stroke="#9CA3AF"
                  strokeWidth={1.5}
                  fill="url(#hotelsGradient)"
                  name="Hotels"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              <span className="text-xs text-gray-600">Total Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Flights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Hotels</span>
            </div>
          </div>

          {/* Empty State Message */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 font-medium mb-1">No expense data yet</p>
            <p className="text-xs text-gray-500">
              Your spending trends will appear here after your first business trip
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
