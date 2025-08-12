"use client"

import { useState, useEffect } from "react"
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
  Bot,
  Sparkles,
  MessageSquare,
  Brain,
} from "lucide-react"

interface DashboardStats {
  totalTrips: number
  totalSavings: number
  upcomingTrips: number
  activeBookings: number
}

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-700">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <div className="relative overflow-hidden">
                  <h1 className="text-3xl md:text-4xl font-medium tracking-tighter text-gray-900 relative">
                    <span className="relative inline-block">
                      Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    </span>
                  </h1>
                </div>
                <p className="text-gray-600 mt-1 font-light">
                  <em className="font-serif italic">Ready to transform your business travel</em>
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>No upcoming trips</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Ready to start</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 font-medium">Get started</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Plane className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Savings</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 font-medium">Start saving</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Expenses</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 font-medium">Track expenses</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Team Size</p>
                <p className="text-3xl font-bold text-gray-900">1</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 font-medium">Invite team</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/dashboard/suitpax-ai">
            <div className="bg-gray-50 rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group cursor-pointer">
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
                  <div className="inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-sm border border-gray-200 transition-colors group-hover:shadow-md">
                    <span className="relative z-10">Start Conversation</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
