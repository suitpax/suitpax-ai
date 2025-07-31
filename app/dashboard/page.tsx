"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PlusIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface DashboardStats {
  totalTrips: number
  completedTrips: number
  totalExpenses: number
  totalSpent: number
}

const quickActions = [
  {
    name: "Book a Trip",
    description: "Plan your next business travel",
    href: "/dashboard/flights",
    icon: BriefcaseIcon,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    name: "Add Expense",
    description: "Track your travel expenses",
    href: "/dashboard/expenses",
    icon: CreditCardIcon,
    color: "bg-green-500/10 text-green-600 border-green-200",
  },
  {
    name: "View Calendar",
    description: "Check your travel schedule",
    href: "/dashboard/calendar",
    icon: CalendarIcon,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
  {
    name: "AI Assistant",
    description: "Get help with travel planning",
    href: "/dashboard/ai-chat",
    icon: ChartBarIcon,
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "trip",
    title: "Flight to New York",
    description: "Booked for next week",
    time: "2 hours ago",
    icon: BriefcaseIcon,
  },
  {
    id: 2,
    type: "expense",
    title: "Hotel Receipt",
    description: "$250.00 added",
    time: "1 day ago",
    icon: CreditCardIcon,
  },
  {
    id: 3,
    type: "meeting",
    title: "Client Meeting",
    description: "Scheduled for tomorrow",
    time: "2 days ago",
    icon: UsersIcon,
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    completedTrips: 0,
    totalExpenses: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch user stats
        const { data: userStats } = await supabase.from("user_stats").select("*").eq("id", user.id).single()

        if (userStats) {
          setStats({
            totalTrips: userStats.total_trips || 0,
            completedTrips: userStats.completed_trips || 0,
            totalExpenses: userStats.total_expenses || 0,
            totalSpent: userStats.total_spent || 0,
          })
        }
      }

      setLoading(false)
    }

    getUser()
  }, [supabase])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getUserName = () => {
    if (!user) return "there"
    const firstName = user.user_metadata?.first_name
    return firstName ? firstName : user.email?.split("@")[0] || "there"
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">
          {getGreeting()}, {getUserName()}
        </h1>
        <p className="text-gray-600 font-light">
          <em className="font-serif italic">Ready to plan your next business trip?</em>
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Total Trips</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">{stats.totalTrips}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">{stats.completedTrips}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Expenses</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">{stats.totalExpenses}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <CreditCardIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Total Spent</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">${stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-medium tracking-tighter mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className="block bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium tracking-tight text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-600 font-light mt-1">
                      <em className="font-serif italic">{action.description}</em>
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium tracking-tighter">Recent Activity</h2>
          <Link
            href="/dashboard/analytics"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors tracking-tight"
          >
            View all
          </Link>
        </div>

        {stats.totalTrips === 0 && stats.totalExpenses === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BriefcaseIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">Welcome to Suitpax!</h3>
            <p className="text-gray-600 font-light mb-6">
              <em className="font-serif italic">Start by booking your first trip or adding an expense</em>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/flights"
                className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Book a Trip
              </Link>
              <Link
                href="/dashboard/ai-chat"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-xl hover:bg-gray-300 transition-colors tracking-tight"
              >
                Ask AI Assistant
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="p-6 flex items-center space-x-4"
              >
                <div className="p-2 bg-gray-200 rounded-xl">
                  <activity.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium tracking-tight text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600 font-light">
                    <em className="font-serif italic">{activity.description}</em>
                  </p>
                </div>
                <div className="text-xs font-medium text-gray-500">{activity.time}</div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
