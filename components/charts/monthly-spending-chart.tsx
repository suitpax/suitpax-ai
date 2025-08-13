"use client"

import { motion } from "framer-motion"
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar } from "lucide-react"

const spendingData = [
  { month: "Jan", actual: 0, budget: 0, forecast: 0 },
  { month: "Feb", actual: 0, budget: 0, forecast: 0 },
  { month: "Mar", actual: 0, budget: 0, forecast: 0 },
  { month: "Apr", actual: 0, budget: 0, forecast: 0 },
  { month: "May", actual: 0, budget: 0, forecast: 0 },
  { month: "Jun", actual: 0, budget: 0, forecast: 0 },
]

export function MonthlySpendingChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Monthly Spending</CardTitle>
                <p className="text-xs text-gray-500 font-light">Budget vs actual vs forecast</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
              <Calendar className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">YTD</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">$0</div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">$0</div>
              <div className="text-xs text-gray-500">Budget Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">0%</div>
              <div className="text-xs text-gray-500">Budget Used</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B7280" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6B7280" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
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
                  dataKey="budget"
                  stroke="#6B7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#budgetGradient)"
                  name="Budget"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#374151"
                  strokeWidth={2}
                  fill="url(#actualGradient)"
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Forecast"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              <span className="text-xs text-gray-600">Actual Spending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Forecast</span>
            </div>
          </div>

          {/* Empty State Message */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 font-medium mb-1">No spending data yet</p>
            <p className="text-xs text-gray-500">
              Your monthly spending trends will appear here after your first business expenses
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
