"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AirplaneIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const stats = [
  { name: "Total Trips", value: "24", change: "+12%", icon: AirplaneIcon },
  { name: "This Month", value: "$12,450", change: "+8%", icon: ChartBarIcon },
  { name: "Team Members", value: "8", change: "+2", icon: UsersIcon },
  { name: "Upcoming", value: "3", change: "Next 7 days", icon: CalendarIcon },
]

const quickActions = [
  { name: "Book Flight", icon: AirplaneIcon, href: "/dashboard/flights" },
  { name: "View Analytics", icon: ChartBarIcon, href: "/dashboard/analytics" },
  { name: "Team Calendar", icon: CalendarIcon, href: "/dashboard/calendar" },
  { name: "AI Chat", icon: PlusIcon, href: "/dashboard/ai-chat" },
]

const recentActivity = [
  { id: 1, action: "Flight booked", details: "SFO → NYC", time: "2 hours ago", status: "completed" },
  { id: 2, action: "Expense submitted", details: "$245 hotel", time: "4 hours ago", status: "pending" },
  { id: 3, action: "Trip approved", details: "London business trip", time: "1 day ago", status: "completed" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [supabase.auth])

  const getUserDisplayName = (user: User | null) => {
    if (!user) return "User"
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tighter text-black">Welcome back, {getUserDisplayName(user)}</h1>
        <p className="text-sm text-gray-600 mt-1">Here's what's happening with your business travel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.name}</p>
                <p className="text-xl font-medium text-black mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-black mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <action.icon className="mr-2 h-3 w-3" />
                  {action.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-black mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="text-xs font-medium text-black">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    {activity.status === "completed" ? (
                      <CheckCircleIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ClockIcon className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Insights */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-black">Travel Insights</h3>
          <div className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700">
            AI Powered
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-black">Cost Savings</p>
            <p className="text-lg font-medium text-green-600">$2,340</p>
            <p className="text-xs text-gray-600">vs last month</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <ClockIcon className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-black">Avg Trip Time</p>
            <p className="text-lg font-medium text-blue-600">3.2 days</p>
            <p className="text-xs text-gray-600">optimal duration</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <CheckCircleIcon className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-black">Policy Compliance</p>
            <p className="text-lg font-medium text-purple-600">94%</p>
            <p className="text-xs text-gray-600">team average</p>
          </div>
        </div>
      </div>
    </div>
  )
}
