"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PaperAirplaneIcon, CreditCardIcon, UsersIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import StatsOverview from "@/components/dashboard/stats-overview"
import QuickActions from "@/components/dashboard/quick-actions"
import Link from "next/link"

const recentActivities = [
  {
    id: 1,
    type: "flight",
    title: "Flight to London booked",
    description: "LHR - Departing March 15, 2024",
    time: "2 hours ago",
    icon: PaperAirplaneIcon,
  },
  {
    id: 2,
    type: "expense",
    title: "Hotel expense submitted",
    description: "$450 - Hilton London",
    time: "4 hours ago",
    icon: CreditCardIcon,
  },
  {
    id: 3,
    type: "team",
    title: "New team member added",
    description: "Sarah Johnson joined the team",
    time: "1 day ago",
    icon: UsersIcon,
  },
]

const upcomingTrips = [
  {
    id: 1,
    destination: "London, UK",
    date: "March 15, 2024",
    type: "Business",
    status: "confirmed",
  },
  {
    id: 2,
    destination: "Tokyo, Japan",
    date: "April 2, 2024",
    type: "Conference",
    status: "pending",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState("free")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("subscription_plan").eq("id", user.id).single()

        setUserPlan(profile?.subscription_plan || "free")
      }

      setLoading(false)
    }

    getUser()
  }, [supabase])

  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-0">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const isPremium = userPlan === "premium" || userPlan === "enterprise"

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
            <h1 className="text-xl sm:text-2xl font-medium tracking-tighter">
              Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0]}
            </h1>
            <p className="text-gray-300 mt-1 text-sm sm:text-base">Ready to manage your business travel efficiently?</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <StatsOverview userPlan={userPlan} />

      {/* Quick Actions */}
      <QuickActions userPlan={userPlan} />

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
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
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
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trip.destination}</p>
                    <p className="text-xs text-gray-500">
                      {trip.date} • {trip.type}
                    </p>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    trip.status === "confirmed" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {trip.status}
                </div>
              </div>
            ))}
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
                Get access to advanced analytics, priority support, and more.
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
