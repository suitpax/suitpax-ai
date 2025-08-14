"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, TrendingUp, Calendar } from "lucide-react"

const metricsData = [
  { category: "Travel Requests", current: 0, target: 25, completion: 0 },
  { category: "Policy Compliance", current: 0, target: 100, completion: 0 },
  { category: "Cost Savings", current: 0, target: 15, completion: 0 },
  { category: "Team Efficiency", current: 0, target: 80, completion: 0 },
  { category: "AI Utilization", current: 0, target: 60, completion: 0 },
]

export function BusinessMetricsChart() {
  const [selectedView, setSelectedView] = useState("monthly")

  const totalCompletion = metricsData.reduce((sum, item) => sum + item.completion, 0) / metricsData.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Business Metrics</CardTitle>
                <p className="text-xs text-gray-500 font-light">Performance against company targets</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
              <Calendar className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-600 capitalize">{selectedView}</span>
            </div>
          </div>

          {/* View Selection */}
          <div className="flex items-center gap-2 mt-4">
            {["weekly", "monthly", "quarterly"].map((view) => (
              <Button
                key={view}
                variant={selectedView === view ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView(view)}
                className="text-xs rounded-xl bg-gray-900 hover:bg-gray-800"
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-medium text-gray-900">{totalCompletion.toFixed(0)}%</div>
              <div className="text-xs text-gray-500">Overall Progress</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-lg font-medium text-gray-900">1</span>
              </div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-lg font-medium text-gray-900">0%</span>
              </div>
              <div className="text-xs text-gray-500">Growth Rate</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  interval={0}
                  tickMargin={12}
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [
                    name === "current" ? `${value}% Current` : `${value}% Target`,
                    name === "current" ? "Current" : "Target",
                  ]}
                />
                <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="target" />
                <Bar dataKey="current" fill="#374151" radius={[4, 4, 0, 0]} name="current" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded"></div>
              <span className="text-xs text-gray-600">Current Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span className="text-xs text-gray-600">Target Goals</span>
            </div>
          </div>

          {/* Empty State Message */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 font-medium mb-1">Ready to track your business metrics</p>
            <p className="text-xs text-gray-500">
              Start using Suitpax to see your performance data and achieve your business goals
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
