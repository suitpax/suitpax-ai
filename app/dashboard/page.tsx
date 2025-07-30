"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import {
  Plane,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  User,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface UserData {
  id: string
  full_name: string | null
  company_name: string | null
  plan_type: string
  ai_tokens_used: number
  ai_tokens_limit: number
  travel_searches_used: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

interface UserProfile {
  user_id: string
  full_name: string | null
  company: string | null
  job_title: string | null
  phone: string | null
  travel_preferences: any
  created_at: string
  updated_at: string
}

const recentActivity = [
  {
    id: 1,
    type: "flight",
    title: "Flight booked to London",
    description: "LHR - Heathrow Airport",
    time: "2 hours ago",
    icon: Plane,
  },
  {
    id: 2,
    type: "chat",
    title: "AI Chat session",
    description: "Travel recommendations for Paris",
    time: "4 hours ago",
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "expense",
    title: "Expense submitted",
    description: "$1,250 hotel booking",
    time: "1 day ago",
    icon: CreditCard,
  },
]

const upcomingTrips = [
  {
    id: 1,
    destination: "London, UK",
    date: "Dec 15, 2024",
    type: "Business",
    status: "Confirmed",
  },
  {
    id: 2,
    destination: "Paris, France",
    date: "Jan 8, 2025",
    type: "Conference",
    status: "Pending",
  },
  {
    id: 3,
    destination: "Tokyo, Japan",
    date: "Feb 20, 2025",
    type: "Business",
    status: "Draft",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      setLoading(true)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        toast.error("Error loading session")
        return
      }

      if (!session) {
        console.log("No session found")
        return
      }

      // Fetch or create user data
      let { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (userError && userError.code === "PGRST116") {
        // User doesn't exist, create new user
        console.log("Creating new user...")
        setIsNewUser(true)

        const newUserData = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
          company_name: null,
          plan_type: "free",
          ai_tokens_used: 0,
          ai_tokens_limit: 5000,
          travel_searches_used: 0,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: createdUser, error: createError } = await supabase
          .from("users")
          .insert([newUserData])
          .select()
          .single()

        if (createError) {
          console.error("Error creating user:", createError)
          toast.error("Error creating user profile")
          return
        }

        userData = createdUser
        toast.success("Welcome to Suitpax! 🎉")
      } else if (userError) {
        console.error("Error fetching user:", userError)
        toast.error("Error loading user data")
        return
      }

      if (userData) {
        setUser(userData)

        // Fetch user profile
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profileData) {
          setUserProfile(profileData)
        }
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error)
      toast.error("Error loading dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getUserDisplayName = () => {
    if (user?.full_name) {
      return user.full_name.split(" ")[0]
    }
    if (userProfile?.full_name) {
      return userProfile.full_name.split(" ")[0]
    }
    return "there"
  }

  const getCompanyName = () => {
    return user?.company_name || userProfile?.company || "Your Company"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-medium tracking-tighter mb-2">Unable to load user data</h3>
        <p className="text-gray-600 font-light mb-6">
          There was an issue loading your profile. Please try refreshing the page.
        </p>
        <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800">
          Refresh Page
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black leading-none">
            {isNewUser ? (
              <>
                <em className="font-serif italic">Welcome to Suitpax</em>
              </>
            ) : (
              <>
                <em className="font-serif italic">Welcome back,</em> {getUserDisplayName()}
              </>
            )}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <p className="text-gray-600 font-light">
              {getCompanyName()} • {user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1)} Plan
            </p>
            {isNewUser && (
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                New Account
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline" className="border-gray-200 bg-transparent">
            <Link href="/dashboard/ai-chat">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Link>
          </Button>
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/dashboard/flights">
              Book Flight
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">AI Tokens Used</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">
                {user.ai_tokens_used.toLocaleString()}
              </p>
              <p className="text-xs font-light text-gray-500">of {user.ai_tokens_limit.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Travel Searches</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">{user.travel_searches_used}</p>
              <p className="text-xs font-light text-gray-500">this month</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Upcoming Trips</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">3</p>
              <p className="text-xs font-light text-gray-500">next 30 days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Savings</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">$2,450</p>
              <p className="text-xs font-light text-gray-500">this month</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
            <em className="font-serif italic">Recent Activity</em>
          </h3>
          <div className="space-y-4">
            {isNewUser ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Welcome to Suitpax! 🎉</p>
                <p className="text-sm font-light">
                  Start by booking your first trip or chatting with the AI assistant.
                </p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm font-light text-gray-500">{activity.description}</p>
                    <p className="text-xs font-light text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
            <em className="font-serif italic">Upcoming Trips</em>
          </h3>
          <div className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{trip.destination}</p>
                  <p className="text-xs font-light text-gray-500">
                    {trip.date} • {trip.type}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-[10px] font-medium ${
                    trip.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : trip.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
          <em className="font-serif italic">Quick Actions</em>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/flights"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <Plane className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Book Flight</span>
          </Link>
          <Link
            href="/dashboard/ai-chat"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <MessageSquare className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">AI Assistant</span>
          </Link>
          <Link
            href="/dashboard/expenses"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <CreditCard className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Expenses</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <User className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Profile</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
