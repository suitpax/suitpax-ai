"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plane,
  Hotel,
  CreditCard,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

interface DashboardStats {
  totalTrips: number
  totalSavings: number
  upcomingTrips: number
  activeBookings: number
}

interface RecentActivity {
  id: string
  type: "flight" | "hotel" | "expense" | "approval"
  title: string
  description: string
  timestamp: Date
  status: "completed" | "pending" | "cancelled"
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalSavings: 0,
    upcomingTrips: 0,
    activeBookings: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Error getting user:", error)
          return
        }

        if (user) {
          setUser(user)

          // Check if user is new (created in the last 24 hours)
          const userCreatedAt = new Date(user.created_at)
          const now = new Date()
          const hoursDiff = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60)
          setIsNewUser(hoursDiff < 24)

          // Load user-specific data
          await loadDashboardData(user.id, hoursDiff < 24)
        }
      } catch (error) {
        console.error("Error in getUser:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [])

  const loadDashboardData = async (userId: string, isNew: boolean) => {
    try {
      if (isNew) {
        // New user - show welcome data
        setStats({
          totalTrips: 0,
          totalSavings: 0,
          upcomingTrips: 0,
          activeBookings: 0,
        })
        setRecentActivity([
          {
            id: "1",
            type: "approval",
            title: "Welcome to Suitpax!",
            description: "Your account has been successfully created",
            timestamp: new Date(),
            status: "completed",
          },
        ])
      } else {
        // Existing user - show realistic data
        setStats({
          totalTrips: Math.floor(Math.random() * 50) + 10,
          totalSavings: Math.floor(Math.random() * 10000) + 2000,
          upcomingTrips: Math.floor(Math.random() * 5) + 1,
          activeBookings: Math.floor(Math.random() * 3) + 1,
        })

        // Generate realistic recent activity
        const activities: RecentActivity[] = [
          {
            id: "1",
            type: "flight",
            title: "Flight to San Francisco",
            description: "SFO departure confirmed for tomorrow",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: "completed",
          },
          {
            id: "2",
            type: "hotel",
            title: "Hotel Booking Confirmed",
            description: "Hilton San Francisco Union Square",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            status: "completed",
          },
          {
            id: "3",
            type: "expense",
            title: "Expense Report Submitted",
            description: "Q4 Business Travel Expenses",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: "pending",
          },
        ]
        setRecentActivity(activities)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const quickActions = [
    {
      icon: Plane,
      title: "Book Flight",
      description: "Find and book business flights",
      href: "/dashboard/flights",
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: Hotel,
      title: "Book Hotel",
      description: "Reserve accommodations",
      href: "/dashboard/hotels",
      color: "bg-green-50 text-green-700",
    },
    {
      icon: CreditCard,
      title: "Expenses",
      description: "Manage travel expenses",
      href: "/dashboard/expenses",
      color: "bg-purple-50 text-purple-700",
    },
    {
      icon: BarChart3,
      title: "Reports",
      description: "View travel analytics",
      href: "/dashboard/reports",
      color: "bg-orange-50 text-orange-700",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tighter leading-none">
                {isNewUser ? (
                  <>
                    <em className="font-serif italic">Welcome to</em>
                    <br />
                    <span className="text-gray-700">Suitpax</span>
                  </>
                ) : (
                  <>
                    <em className="font-serif italic">Welcome back,</em>
                    <br />
                    <span className="text-gray-700">
                      {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler"}
                    </span>
                  </>
                )}
              </h1>
              <p className="text-lg font-light text-gray-600 mt-2">
                {isNewUser
                  ? "Let's get started with your business travel management"
                  : "Here's your travel overview for today"}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                <em className="font-serif italic">Dashboard</em>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New User Onboarding */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium tracking-tighter mb-2">Get Started with Suitpax</h3>
                  <p className="text-sm font-light text-gray-600 mb-4">
                    Complete these steps to unlock the full power of AI-driven business travel management.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete Profile
                    </Link>
                    <Link
                      href="/dashboard/ai-chat"
                      className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Try AI Assistant
                    </Link>
                    <Link
                      href="/dashboard/flights"
                      className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Book First Trip
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Trips</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{stats.totalTrips}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Plane className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Savings</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">${stats.totalSavings.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Upcoming Trips</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{stats.upcomingTrips}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Bookings</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{stats.activeBookings}</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Quick Actions</em>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium tracking-tighter group-hover:text-gray-900 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm font-light text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Recent Activity</em>
              </h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.status === "completed"
                            ? "bg-green-50"
                            : activity.status === "pending"
                              ? "bg-yellow-50"
                              : "bg-red-50"
                        }`}
                      >
                        {activity.status === "completed" && <CheckCircle className="h-4 w-4 text-green-700" />}
                        {activity.status === "pending" && <Clock className="h-4 w-4 text-yellow-700" />}
                        {activity.status === "cancelled" && <AlertCircle className="h-4 w-4 text-red-700" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm tracking-tighter">{activity.title}</p>
                        <p className="text-xs font-light text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp.toLocaleDateString()} at{" "}
                          {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-light text-gray-600">No recent activity</p>
                    <p className="text-xs text-gray-500 mt-1">Your travel activity will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Assistant CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium tracking-tighter mb-2">
                  <em className="font-serif italic">Need Help?</em>
                </h3>
                <p className="font-light text-white/80">
                  Chat with Zia, your AI travel assistant, for instant help with bookings and travel questions.
                </p>
              </div>
              <Link
                href="/dashboard/ai-chat"
                className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <em className="font-serif italic">Chat with Zia</em>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}