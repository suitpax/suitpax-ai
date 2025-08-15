"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import { useState } from "react"

const monthlyData = [
  { month: "Jan", amount: 2400, transactions: 45 },
  { month: "Feb", amount: 1800, transactions: 38 },
  { month: "Mar", amount: 3200, transactions: 52 },
  { month: "Apr", amount: 2800, transactions: 41 },
  { month: "May", amount: 3600, transactions: 58 },
  { month: "Jun", amount: 2200, transactions: 35 },
]

const categoryData = [
  { name: "Transportation", value: 35, amount: 4200, color: "#374151" },
  { name: "Accommodation", value: 30, amount: 3600, color: "#6B7280" },
  { name: "Meals", value: 20, amount: 2400, color: "#9CA3AF" },
  { name: "Other", value: 15, amount: 1800, color: "#D1D5DB" },
]

const trendData = [
  { week: "W1", amount: 850 },
  { week: "W2", amount: 920 },
  { week: "W3", amount: 780 },
  { week: "W4", amount: 1100 },
  { week: "W5", amount: 950 },
  { week: "W6", amount: 1200 },
]

interface ExpenseAnalyticsProps {
  className?: string
}

export function ExpenseAnalytics({ className }: ExpenseAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("6months")

  const totalSpent = categoryData.reduce((sum, item) => sum + item.amount, 0)
  const avgMonthly = monthlyData.reduce((sum, item) => sum + item.amount, 0) / monthlyData.length
  const trend = ((monthlyData[monthlyData.length - 1].amount - monthlyData[0].amount) / monthlyData[0].amount) * 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium tracking-tighter text-black">Expense Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 rounded-xl border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</p>
              <p className="text-xl font-medium tracking-tighter text-black mt-1">€{totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-gray-200 rounded-xl">
              <DollarSign className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Monthly</p>
              <p className="text-xl font-medium tracking-tighter text-black mt-1">
                €{Math.round(avgMonthly).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-gray-200 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</p>
              <div className="flex items-center mt-1">
                <p className="text-xl font-medium tracking-tighter text-black">
                  {trend > 0 ? "+" : ""}
                  {trend.toFixed(1)}%
                </p>
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500 ml-2" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 ml-2" />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-medium tracking-tighter text-black mb-4">Monthly Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} interval={0} tickMargin={10} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Bar dataKey="amount" fill="#374151" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-medium tracking-tighter text-black mb-4">Spending by Category</h3>
          <div className="h-64 flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">€{item.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Weekly Trend */}
        <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-medium tracking-tighter text-black mb-4">Weekly Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" stroke="#6b7280" fontSize={12} interval={0} tickMargin={10} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#374151"
                  strokeWidth={2}
                  dot={{ fill: "#374151", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
