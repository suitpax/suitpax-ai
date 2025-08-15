"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp } from "lucide-react"

const efficiencyData = [
  { month: "Jan", bookingTime: 0, costSavings: 0, compliance: 0 },
  { month: "Feb", bookingTime: 0, costSavings: 0, compliance: 0 },
  { month: "Mar", bookingTime: 0, costSavings: 0, compliance: 0 },
  { month: "Apr", bookingTime: 0, costSavings: 0, compliance: 0 },
  { month: "May", bookingTime: 0, costSavings: 0, compliance: 0 },
  { month: "Jun", bookingTime: 0, costSavings: 0, compliance: 0 },
]

export function TravelEfficiencyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Travel Efficiency</CardTitle>
                <p className="text-xs text-gray-500 font-light">Booking time and cost optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
              <TrendingUp className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">6M</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">0 min</div>
              <div className="text-xs text-gray-500">Avg Booking Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">$0</div>
              <div className="text-xs text-gray-500">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">0%</div>
              <div className="text-xs text-gray-500">Policy Compliance</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} interval={0} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="bookingTime" fill="#374151" radius={[4, 4, 0, 0]} name="Booking Time (min)" />
                <Bar dataKey="costSavings" fill="#6B7280" radius={[4, 4, 0, 0]} name="Cost Savings ($)" />
                <Bar dataKey="compliance" fill="#9CA3AF" radius={[4, 4, 0, 0]} name="Compliance (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              <span className="text-xs text-gray-600">Booking Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Cost Savings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Compliance</span>
            </div>
          </div>

          {/* Empty State Message */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 font-medium mb-1">No efficiency data yet</p>
            <p className="text-xs text-gray-500">
              Start booking trips to see your efficiency metrics and optimization opportunities
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
