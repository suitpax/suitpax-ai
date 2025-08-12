"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  ArrowRight,
  Bot,
  Sparkles,
  MessageSquare,
  Brain,
  UserIcon,
  Settings,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header with Finance title styling */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Dashboard</h1>
            <p className="text-gray-600 font-light">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.04 }}
      >
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-xl font-medium tracking-tighter">
                  {user?.user_metadata?.full_name || "User Profile"}
                </h3>
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                  Free Plan
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Position</p>
                  <p className="font-medium">Business Traveler</p>
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">Not Set</p>
                </div>
                <div>
                  <p className="text-gray-500">Member Since</p>
                  <p className="font-medium">{new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <Link href="/dashboard/company">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Company Settings
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium tracking-tighter mb-4">Travel Analytics</h3>
            <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No travel data yet</p>
                <p className="text-xs text-gray-400">Start booking to see analytics</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium tracking-tighter mb-4">Expense Trends</h3>
            <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No expenses recorded</p>
                <p className="text-xs text-gray-400">Add expenses to track trends</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-600">Total Trips</p>
            <p className="text-2xl font-medium tracking-tighter">0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-600">Savings</p>
            <p className="text-2xl font-medium tracking-tighter">$0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-600">Expenses</p>
            <p className="text-2xl font-medium tracking-tighter">$0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-600">Team Size</p>
            <p className="text-2xl font-medium tracking-tighter">1</p>
          </div>
        </div>
      </motion.div>

      {/* Suitpax AI Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24 }}
      >
        <Link href="/dashboard/suitpax-ai">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                  <Bot className="h-3 w-3 mr-1" />
                  AI Technology
                </span>
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
                  <span className="w-1 h-1 rounded-full bg-gray-600 animate-pulse mr-1"></span>
                  Available Now
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-gray-900 leading-none max-w-4xl mx-auto mb-4">
                Your AI travel assistant is ready
              </h3>

              <p className="text-sm font-medium text-gray-500 max-w-2xl mx-auto mb-6">
                Get instant help with flight bookings, expense management, travel policies, and more
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">Smart Memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">AI Powered</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center bg-gray-900 text-white hover:bg-black px-8 py-3 rounded-xl text-sm font-medium tracking-tighter transition-colors group-hover:shadow-md">
                  <span className="relative z-10">Start Conversation</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
