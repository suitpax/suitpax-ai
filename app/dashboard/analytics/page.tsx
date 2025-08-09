"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts"

interface DashboardStats {
  stats: {
    total_flights: number
    total_expenses: number
    pending_expenses: number
    this_month_expenses: number
  }
  recent_activities: Array<{ id: string; type: string; title: string; description: string; created_at: string; amount?: number }>
  upcoming_trips: Array<any>
  monthly_spending: Array<{ month: string; amount: number }>
  top_destinations: Array<{ city: string; trips: number; amount: number }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/user/dashboard-stats", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load analytics")
        setData(json)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-0">
        <div className="animate-pulse h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="p-4">No analytics available.</div>
  }

  const currentMonth = data.monthly_spending[data.monthly_spending.length - 1]

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Analytics</h1>
            <p className="text-gray-600 font-light">Insights and reports for your business travel</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Export Report</Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Flights</p>
                <p className="text-2xl font-medium tracking-tighter">{data.stats.total_flights}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-medium tracking-tighter">${data.stats.this_month_expenses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Expenses</p>
                <p className="text-2xl font-medium tracking-tighter">{data.stats.pending_expenses}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-medium tracking-tighter">${currentMonth?.amount?.toLocaleString?.() || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Destinations and Expense Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter">Top Destinations</h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200">
                {data.top_destinations.length} cities
              </Badge>
            </div>

            <div className="space-y-4">
              {data.top_destinations.map((destination, index) => (
                <div key={destination.city} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{destination.city}</p>
                      <p className="text-sm text-gray-500">{destination.trips} trips</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${destination.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter">Monthly Spending Trend</h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200">Last 6 months</Badge>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthly_spending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#111827" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
