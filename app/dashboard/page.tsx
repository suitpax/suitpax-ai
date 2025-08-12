"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { ArrowRight, Sparkles, MessageSquare, Brain, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserStatsChart } from "@/components/charts/user-stats-chart"
import { SuitpaxRadarChart } from "@/components/charts/radar-chart"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import Image from "next/image"

interface UserProfile {
  full_name?: string
  avatar_url?: string
  company?: string
  job_title?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
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

          // Get user profile
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url, company, job_title")
              .eq("id", user.id)
              .single()

            if (profile && isMounted) {
              setUserProfile(profile)
            }
          } catch (error) {
            console.error("Error fetching profile:", error)
          }
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

  const getDisplayName = () => {
    if (!user) return "User"
    return userProfile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header with Finance title styling */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none">Dashboard</h1>
            <p className="text-sm text-gray-600 font-light mt-1">Welcome back, {getDisplayName().split(" ")[0]}</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-fit">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.04 }}
      >
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-gray-200 rounded-md">
              <AvatarImage
                src={userProfile?.avatar_url || "/placeholder.svg"}
                alt={getDisplayName()}
                className="rounded-md"
              />
              <AvatarFallback className="bg-gray-900 text-white text-lg font-medium rounded-md">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <h3 className="text-lg sm:text-xl font-medium tracking-tighter truncate">{getDisplayName()}</h3>
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 w-fit">
                  Free Plan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Position</p>
                  <p className="font-medium text-sm">{userProfile?.job_title || "Business Traveler"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Company</p>
                  <p className="font-medium text-sm">{userProfile?.company || "Not Set"}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-gray-500 text-xs">Member Since</p>
                  <p className="font-medium text-sm">{new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Link href="/dashboard/company">
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs bg-transparent">
                  <Settings className="h-3 w-3 mr-2" />
                  Company Settings
                </Button>
              </Link>
            </div>
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
          <UserStatsChart />
          <SuitpaxRadarChart />
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Trips</p>
            <p className="text-xl sm:text-2xl font-medium tracking-tighter">0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Savings</p>
            <p className="text-xl sm:text-2xl font-medium tracking-tighter">$0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Expenses</p>
            <p className="text-xl sm:text-2xl font-medium tracking-tighter">$0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Team Size</p>
            <p className="text-xl sm:text-2xl font-medium tracking-tighter">1</p>
          </div>
        </div>
      </motion.div>

      {/* Top Destinations Card */}
      <TopDestinationsCard />

      {/* Suitpax AI Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24 }}
      >
        <Link href="/dashboard/suitpax-ai">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                  <div className="w-4 h-4 rounded-md overflow-hidden mr-1">
                    <Image
                      src="/suitpax-bl-logo.webp"
                      alt="Suitpax"
                      width={16}
                      height={16}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  AI Technology
                </span>
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
                  <span className="w-1 h-1 rounded-full bg-gray-600 animate-pulse mr-1"></span>
                  Available Now
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-gray-900 leading-none max-w-4xl mx-auto mb-4">
                Your AI travel assistant is ready
              </h3>

              <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mx-auto mb-6">
                Get instant help with flight bookings, expense management, travel policies, and more
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Smart Memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">AI Powered</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center bg-gray-900 text-white hover:bg-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium tracking-tighter transition-colors group-hover:shadow-md">
                  <span className="relative z-10">Start Conversation</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
