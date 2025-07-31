"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PaperAirplaneIcon, CreditCardIcon, ChartBarIcon, ClockIcon, PlusIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

interface UserStats {
  total_flights: number
  total_expenses: number
  pending_expenses: number
  this_month_expenses: number
}

interface RecentActivity {
  id: string
  type: "flight" | "expense" | "booking"
  title: string
  description: string
  created_at: string
  amount?: number
}

interface UpcomingTrip {
  id: string
  destination: string
  departure_date: string
  return_date?: string
  status: "confirmed" | "pending" | "cancelled"
  flight_number?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    total_flights: 0,
    total_expenses: 0,
    pending_expenses: 0,
    this_month_expenses: 0,
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [upcomingTrips, setUpcomingTrips] = useState<UpcomingTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState("free")
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get user profile and subscription
        const { data: profile } = await supabase.from("profiles").select("subscription_plan").eq("id", user.id).single()

        setUserPlan(profile?.subscription_plan || "free")

        // Get user stats
        await fetchUserStats(user.id)
        await fetchRecentActivities(user.id)
        await fetchUpcomingTrips(user.id)
      }

      setLoading(false)
    }

    getUser()
  }, [supabase])

  const fetchUserStats = async (userId: string) => {
    try {
      // Get flight bookings count
      const { count: flightCount } = await supabase
        .from("flight_bookings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Get expenses stats
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, status, created_at")
        .eq("user_id", userId)

      const totalExpenses = expenses?.length || 0
      const pendingExpenses = expenses?.filter((e) => e.status === "pending").length || 0

      // Calculate this month expenses
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const thisMonthExpenses =
        expenses
          ?.filter((e) => {
            const expenseDate = new Date(e.created_at)
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0) || 0

      setUserStats({
        total_flights: flightCount || 0,
        total_expenses: totalExpenses,
        pending_expenses: pendingExpenses,
        this_month_expenses: thisMonthExpenses,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const fetchRecentActivities = async (userId: string) => {
    try {
      // Get recent expenses
      const { data: expenses } = await supabase
        .from("expenses")
        .select("id, title, amount, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(3)

      // Get recent flight bookings
      const { data: flights } = await supabase
        .from("flight_bookings")
        .select("id, destination, flight_number, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(2)

      const activities: RecentActivity[] = []

      // Add expenses to activities
      expenses?.forEach((expense) => {
        activities.push({
          id: expense.id,
          type: "expense",
          title: expense.title || "Expense submitted",
          description: `$${expense.amount} expense`,
          created_at: expense.created_at,
          amount: expense.amount,
        })
      })

      // Add flights to activities
      flights?.forEach((flight) => {
        activities.push({
          id: flight.id,
          type: "flight",
          title: `Flight to ${flight.destination}`,
          description: flight.flight_number ? `Flight ${flight.flight_number}` : "Flight booking",
          created_at: flight.created_at,
        })
      })

      // Sort by date and take top 5
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRecentActivities(activities.slice(0, 5))
    } catch (error) {
      console.error("Error fetching recent activities:", error)
    }
  }

  const fetchUpcomingTrips = async (userId: string) => {
    try {
      const { data: trips } = await supabase
        .from("flight_bookings")
        .select("id, destination, departure_date, return_date, status, flight_number")
        .eq("user_id", userId)
        .gte("departure_date", new Date().toISOString())
        .order("departure_date", { ascending: true })
        .limit(5)

      setUpcomingTrips(trips || [])
    } catch (error) {
      console.error("Error fetching upcoming trips:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-0">
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const isPremium = userPlan === "premium" || userPlan === "enterprise"
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User"

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black rounded-2xl p-4 sm:p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tighter">Welcome back, {firstName}</h1>
            <p className="text-gray-300 mt-1 text-sm sm:text-base">
              {userStats.total_flights === 0 && userStats.total_expenses === 0
                ? "Ready to start your business travel journey?"
                : "Here's your travel overview"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium capitalize">{userPlan} Plan</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Flights</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">{userStats.total_flights}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">{userStats.total_expenses}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">{userStats.pending_expenses}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">
                ${userStats.this_month_expenses.toFixed(0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6"
      >
        <h2 className="text-lg font-medium tracking-tighter mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/flights"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-800 transition-colors">
              <PaperAirplaneIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Book Flight</p>
              <p className="text-xs text-gray-500">Search and book flights</p>
            </div>
          </Link>

          <Link
            href="/dashboard/expenses"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-800 transition-colors">
              <PlusIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Add Expense</p>
              <p className="text-xs text-gray-500">Track your expenses</p>
            </div>
          </Link>

          <Link
            href="/dashboard/ai-chat"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-800 transition-colors">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Ask Suitpax AI</p>
              <p className="text-xs text-gray-500">Get travel assistance</p>
            </div>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium tracking-tighter">Recent Activity</h2>
            <Link href="/dashboard/analytics" className="text-sm text-gray-500 hover:text-black transition-colors">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No recent activity</p>
                <p className="text-xs text-gray-400 mt-1">Your travel activities will appear here</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {activity.type === "flight" ? (
                      <PaperAirplaneIcon className="h-4 w-4 text-gray-600" />
                    ) : (
                      <CreditCardIcon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {getTimeAgo(activity.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium tracking-tighter">Upcoming Trips</h2>
            <Link href="/dashboard/flights" className="text-sm text-gray-500 hover:text-black transition-colors">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingTrips.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PaperAirplaneIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No upcoming trips</p>
                <p className="text-xs text-gray-400 mt-1">Book your first flight to get started</p>
                <Link
                  href="/dashboard/flights"
                  className="inline-flex items-center mt-3 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Book Flight
                </Link>
              </div>
            ) : (
              upcomingTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <PaperAirplaneIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{trip.destination}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(trip.departure_date)}
                        {trip.flight_number && ` • ${trip.flight_number}`}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      trip.status === "confirmed"
                        ? "bg-gray-200 text-gray-800"
                        : trip.status === "pending"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {trip.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Upgrade CTA for free users */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-medium tracking-tighter text-gray-900">Unlock Premium Features</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get access to advanced analytics, priority support, and unlimited bookings.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
