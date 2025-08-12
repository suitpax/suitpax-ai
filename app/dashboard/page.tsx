"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  Plane,
  DollarSign,
  ArrowRight,
  Users,
  Receipt,
  Calendar,
  MapPin,
  TrendingUp,
  Bot,
  Sparkles,
  MessageSquare,
  Brain,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface DashboardStats {
  totalTrips: number
  totalSavings: number
  upcomingTrips: number
  activeBookings: number
}

interface RecentActivity {
  id: string
  type: "welcome" | "profile" | "setup"
  title: string
  description: string
  timestamp: Date
  status: "completed" | "pending"
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalSavings: 0,
    upcomingTrips: 0,
    activeBookings: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  const initializeNewUser = useCallback(() => {
    const welcomeActivity: RecentActivity = {
      id: "welcome",
      type: "welcome",
      title: "Welcome to Suitpax Business Travel!",
      description: "Your corporate travel management platform is ready",
      timestamp: new Date(),
      status: "completed",
    }

    setRecentActivity([welcomeActivity])
    setStats({
      totalTrips: 0,
      totalSavings: 0,
      upcomingTrips: 0,
      activeBookings: 0,
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Error getting user:", error)
          return
        }

        if (user && isMounted) {
          setUser(user)
          initializeNewUser()
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error in getUser:", error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    getUser()

    return () => {
      isMounted = false
    }
  }, [initializeNewUser])

  const travelData = [
    { month: "Jan", trips: 0, savings: 0 },
    { month: "Feb", trips: 0, savings: 0 },
    { month: "Mar", trips: 0, savings: 0 },
    { month: "Apr", trips: 0, savings: 0 },
    { month: "May", trips: 0, savings: 0 },
    { month: "Jun", trips: 0, savings: 0 },
  ]

  const upcomingFlights = [
    {
      destination: "New York",
      date: "Dec 15, 2024",
      flight: "AA 1234",
      status: "Confirmed",
    },
    {
      destination: "London",
      date: "Dec 22, 2024",
      flight: "BA 5678",
      status: "Pending",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-700">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </h1>
                <p className="text-gray-600 mt-1">Ready to optimize your business travel</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>2 upcoming trips</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Last trip: Never</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Savings</p>
                <p className="text-3xl font-bold text-gray-900">$12,450</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+24%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Expenses</p>
                <p className="text-3xl font-bold text-gray-900">$8,920</p>
                <div className="flex items-center mt-2">
                  <Receipt className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">This month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Team Size</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">Active users</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Travel Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Travel Overview</h2>
                <div className="text-sm text-gray-500">June 2024</div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={travelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      formatter={(value: any, name: string) => [
                        name === "trips" ? `${value} trips` : `$${value}`,
                        name === "trips" ? "Business Trips" : "Savings",
                      ]}
                    />
                    <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Flights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Flights</h2>
              <div className="space-y-4">
                {upcomingFlights.map((flight, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{flight.destination}</p>
                      <p className="text-sm text-gray-600">{flight.date}</p>
                      <p className="text-xs text-gray-500">{flight.flight}</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        flight.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {flight.status}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/flights"
                className="block w-full mt-4 p-3 text-center bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                View All Flights
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Suitpax AI Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/dashboard/suitpax-ai">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Suitpax AI</h3>
                      <p className="text-gray-300">Your intelligent travel assistant</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Get instant help with flight bookings, expense management, travel policies, and more. Powered by
                    advanced AI with memory of your preferences and travel history.
                  </p>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-gray-300">Smart Memory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-gray-300">24/7 Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      <span className="text-sm text-gray-300">AI Powered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold group-hover:bg-gray-100 transition-colors">
                      Start Conversation
                    </div>
                    <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-48 h-48 relative">
                    <img
                      src="/blonde-ai-assistant.png"
                      alt="Suitpax AI Assistant"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
