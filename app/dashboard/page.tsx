"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { CreditCard, TrendingUp, Users, Calendar, User, Building2, Sparkles, ArrowRight, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface UserData {
  id: string
  full_name: string | null
  company_name: string | null
  plan_type: string
  ai_tokens_used: number
  ai_tokens_limit: number
  travel_searches_used: number
  onboarding_completed: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

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

      if (sessionError || !session) {
        router.push("/auth/login")
        return
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (userError) {
        console.error("Error fetching user data:", userError)
        toast.error("Failed to load your profile.")
      } else {
        setUser(userData)
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error)
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const getUserDisplayName = () => {
    return user?.full_name?.split(" ")[0] || "there"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-24"></div>
            </div>
          ))}
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
            Welcome back, {getUserDisplayName()}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <p className="text-gray-600 font-light">
              {user.company_name || "Your Company"} • {user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1)}{" "}
              Plan
            </p>
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
              <Plane className="h-4 w-4 mr-2" />
              Book Flight
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
            <TrendingUp className="h-8 w-8 text-gray-600" />
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
            <Users className="h-8 w-8 text-gray-600" />
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
            <Calendar className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Upcoming Trips</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">0</p>
              <p className="text-xs font-light text-gray-500">No trips planned</p>
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
            <CreditCard className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Pending Expenses</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">0</p>
              <p className="text-xs font-light text-gray-500">All clear!</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content grid - Zero State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-light mb-4">
              Your recent activity will appear here once you start using the platform.
            </p>
            <Button asChild variant="outline" className="border-gray-200 bg-transparent text-xs">
              <Link href="/dashboard/ai-chat">
                Start with AI Chat
                <ArrowRight className="h-3 w-3 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">Upcoming Trips</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plane className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-light mb-4">You have no upcoming trips.</p>
            <Button asChild variant="outline" className="border-gray-200 bg-transparent text-xs">
              <Link href="/dashboard/flights">
                Book your first trip
                <ArrowRight className="h-3 w-3 ml-2" />
              </Link>
            </Button>
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
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/flights"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 group-hover:shadow-sm transition-shadow">
              <Plane className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Book Flight</p>
              <p className="text-xs text-gray-500">Search and book flights</p>
            </div>
          </Link>

          <Link
            href="/dashboard/ai-chat"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 group-hover:shadow-sm transition-shadow">
              <Sparkles className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">AI Assistant</p>
              <p className="text-xs text-gray-500">Chat with travel AI</p>
            </div>
          </Link>

          <Link
            href="/dashboard/expenses"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 group-hover:shadow-sm transition-shadow">
              <CreditCard className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Expenses</p>
              <p className="text-xs text-gray-500">Track your spending</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
