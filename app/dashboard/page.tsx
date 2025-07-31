"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AirplaneIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

const stats = [
  { name: "Total Trips", value: "24", change: "+12%", icon: AirplaneIcon, color: "bg-blue-50 text-blue-600" },
  { name: "This Month", value: "$12,450", change: "+8%", icon: ChartBarIcon, color: "bg-green-50 text-green-600" },
  { name: "Team Members", value: "8", change: "+2", icon: UsersIcon, color: "bg-purple-50 text-purple-600" },
  { name: "Upcoming", value: "3", change: "Next 7 days", icon: CalendarIcon, color: "bg-orange-50 text-orange-600" },
]

const quickActions = [
  {
    name: "Book Flight",
    icon: AirplaneIcon,
    href: "/dashboard/flights",
    description: "Find and book your next trip",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    name: "AI Chat",
    icon: ChatBubbleLeftRightIcon,
    href: "/dashboard/ai-chat",
    description: "Get travel assistance",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    name: "Voice AI",
    icon: MicrophoneIcon,
    href: "/dashboard/voice-ai",
    description: "Voice-powered travel planning",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    name: "Analytics",
    icon: ChartBarIcon,
    href: "/dashboard/analytics",
    description: "View travel insights",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
]

const recentActivity = [
  { id: 1, action: "Flight booked", details: "SFO → NYC", time: "2 hours ago", status: "completed" },
  { id: 2, action: "Expense submitted", details: "$245 hotel", time: "4 hours ago", status: "pending" },
  { id: 3, action: "Trip approved", details: "London business trip", time: "1 day ago", status: "completed" },
  { id: 4, action: "AI chat session", details: "Travel policy questions", time: "2 days ago", status: "completed" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase.auth])

  const getUserDisplayName = (user: User | null) => {
    if (!user) return "User"
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">
          {getGreeting()}, {getUserDisplayName(user)}
        </h1>
        <p className="text-gray-600 font-light">
          <em className="font-serif italic">Ready to plan your next business trip?</em>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">{stat.name}</p>
                <p className="text-2xl font-medium text-black mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium tracking-tighter text-black mb-6">
              <em className="font-serif italic">Quick Actions</em>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`block p-4 rounded-xl border ${action.color} hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <action.icon className="h-6 w-6" />
                      <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="font-medium tracking-tight text-black mb-1">{action.name}</h4>
                    <p className="text-xs text-gray-600 font-light">
                      <em className="font-serif italic">{action.description}</em>
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium tracking-tighter text-black">
                <em className="font-serif italic">Recent Activity</em>
              </h3>
              <Link
                href="/dashboard/analytics"
                className="text-xs font-medium text-gray-700 hover:text-black transition-colors tracking-tight"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-black">{activity.action}</p>
                      <p className="text-xs text-gray-600 font-light">
                        <em className="font-serif italic">{activity.details}</em>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    {activity.status === "completed" ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClockIcon className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Travel Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium tracking-tighter text-black">
            <em className="font-serif italic">Travel Insights</em>
          </h3>
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
            AI Powered
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-black mb-1">Cost Savings</p>
            <p className="text-2xl font-medium text-green-600 mb-1">$2,340</p>
            <p className="text-xs text-gray-600 font-light">
              <em className="font-serif italic">vs last month</em>
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-black mb-1">Avg Trip Time</p>
            <p className="text-2xl font-medium text-blue-600 mb-1">3.2 days</p>
            <p className="text-xs text-gray-600 font-light">
              <em className="font-serif italic">optimal duration</em>
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <CheckCircleIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-black mb-1">Policy Compliance</p>
            <p className="text-2xl font-medium text-purple-600 mb-1">94%</p>
            <p className="text-xs text-gray-600 font-light">
              <em className="font-serif italic">team average</em>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
