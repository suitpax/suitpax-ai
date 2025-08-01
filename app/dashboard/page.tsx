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
  MessageSquare,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const [userProfile, setUserProfile] = useState<any>(null)
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

          // Get user profile
          const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

          if (profile) {
            setUserProfile(profile)
          }

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
  }, [supabase])

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
      href: "/dashboard/analytics",
      color: "bg-orange-50 text-orange-700",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium tracking-tight">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">
              {isNewUser ? (
                <>
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Suitpax
                  </span>
                </>
              ) : (
                <>
                  Welcome back,{" "}
                  <span className="text-gray-600">
                    {userProfile?.first_name || user?.email?.split("@")[0] || "Traveler"}
                  </span>
                </>
              )}
            </h1>
            <p className="text-gray-600 font-light">
              {isNewUser
                ? "Let's get started with your business travel management"
                : "Here's your travel overview for today"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Zap className="h-3 w-3 mr-1" />
              Dashboard
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* New User Onboarding */}
      {isNewUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 tracking-tight">
                    Get Started with Suitpax
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete these steps to unlock the full power of AI-driven business travel management.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/profile">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/dashboard/ai-chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Try AI Assistant
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/flights">
                    <Plane className="h-4 w-4 mr-2" />
                    Book First Trip
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">{stats.totalTrips}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">
                ${stats.totalSavings.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">{stats.upcomingTrips}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">{stats.activeBookings}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.status === "completed" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {activity.status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                      {activity.status === "cancelled" && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.timestamp.toLocaleDateString()} at{" "}
                        {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">No recent activity</p>
                  <p className="text-xs text-gray-600">Your travel activity will appear here</p>
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
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="bg-gray-200 rounded-2xl p-6 text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tighter">Need Help?</h3>
                <p className="text-sm text-gray-300">
                  Chat with Suitpax AI, your AI Agent, for instant help with bookings and travel questions.
                </p>
              </div>
            </div>
            <Button asChild variant="secondary" className="bg-white text-black hover:bg-gray-100">
              <Link href="/dashboard/ai-chat">
                Chat with Suitpax AI
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}