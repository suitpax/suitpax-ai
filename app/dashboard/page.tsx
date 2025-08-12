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
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import AiSearchInput from "@/components/ui/ai-search-input"
import Image from "next/image"
import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"

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
  const [chatQuery, setChatQuery] = useState("")

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

  const handleChatSubmit = (query: string) => {
    console.log("Chat query:", query)
    // Here you would integrate with your AI chat system
  }

  const handleCardReorder = (newOrder: string[]) => {
    console.log("Dashboard cards reordered:", newOrder)
    // Here you could save the order to your backend if needed
  }

  // Define dashboard cards for drag and drop
  const dashboardCards = [
    {
      id: "profile-card",
      title: "Profile Card",
      component: (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-gray-200 rounded-md">
                <AvatarImage
                  src={userProfile?.avatar_url || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="rounded-md"
                />
                <AvatarFallback className="bg-gray-900 text-white text-xl font-medium rounded-md">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tighter text-gray-900">{getDisplayName()}</h3>
                  <span className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                    Free Plan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-medium">Active Now</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Position</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userProfile?.job_title || "Business Traveler"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Company</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{userProfile?.company || "Not Set"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(user?.created_at || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Account Type</p>
                  <p className="text-sm font-medium text-gray-900">Personal</p>
                </div>
              </div>

              {/* Plan Details and Features */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">F</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Free Plan</h4>
                      <p className="text-xs text-gray-500">Basic travel management</p>
                    </div>
                  </div>
                  <Link href="/dashboard/company">
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs">
                      Upgrade
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">5 trips/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Basic AI chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-400">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-400">Team features</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">0</span>
                    <span>trips completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">$0</span>
                    <span>saved this year</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Last active: Now</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col gap-2">
              <Link href="/dashboard/company">
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs bg-transparent rounded-xl">
                  <Settings className="h-3 w-3 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs bg-transparent rounded-xl">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "charts-section",
      title: "Charts Section",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <UserStatsChart />
          <SuitpaxRadarChart />
          <div className="lg:col-span-2 xl:col-span-1">
            <ExpenseTrendsChart />
          </div>
        </div>
      ),
    },
    {
      id: "kpis-section",
      title: "KPIs Section",
      component: (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Trips</p>
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-medium tracking-tighter text-gray-900 mb-1">0</p>
            <p className="text-xs text-gray-500 font-light">This year</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Savings</p>
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-medium tracking-tighter text-gray-900 mb-1">$0</p>
            <p className="text-xs text-gray-500 font-light">Cost optimized</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Expenses</p>
              <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-medium tracking-tighter text-gray-900 mb-1">$0</p>
            <p className="text-xs text-gray-500 font-light">All categories</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Team Members</p>
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-medium tracking-tighter text-gray-900 mb-1">1</p>
            <p className="text-xs text-gray-500 font-light">Active users</p>
          </div>
        </div>
      ),
    },
    {
      id: "top-destinations",
      title: "Top Destinations",
      component: <TopDestinationsCard />,
    },
    {
      id: "suitpax-ai-card",
      title: "Suitpax AI Assistant",
      component: (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          {/* AI Assistant Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-medium text-white/90">
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
                <span className="inline-flex items-center rounded-xl bg-emerald-500/20 backdrop-blur-sm px-2.5 py-0.5 text-[8px] font-medium text-emerald-300">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                  Available Now
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter leading-none max-w-4xl mx-auto mb-4 text-center">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse">
                  Your AI travel assistant is ready
                </span>
              </h3>

              <p className="text-xs sm:text-sm font-medium text-white/70 max-w-2xl mx-auto mb-6 text-center">
                Get instant help with flight bookings, expense management, travel policies, and more
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
                  <span className="text-xs sm:text-sm text-white/80 font-medium">Smart Memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
                  <span className="text-xs sm:text-sm text-white/80 font-medium">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
                  <span className="text-xs sm:text-sm text-white/80 font-medium">AI Powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Chat Section */}
          <div className="p-6 sm:p-8 bg-gray-50/50">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h4 className="text-lg font-medium tracking-tighter text-gray-900 mb-2">Start a conversation</h4>
                <p className="text-sm text-gray-600">
                  Ask anything about your travel plans, expenses, or company policies
                </p>
              </div>

              <div className="space-y-4">
                <AiSearchInput
                  placeholder="Ask me about flights, hotels, expenses..."
                  onSubmit={handleChatSubmit}
                  className="w-full"
                />

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="flex-1 text-left p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm">
                    <span className="text-gray-600">💼</span>
                    <span className="ml-2 text-gray-700">Book a flight to NYC next week</span>
                  </button>
                  <button className="flex-1 text-left p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm">
                    <span className="text-gray-600">📊</span>
                    <span className="ml-2 text-gray-700">Show my expense summary</span>
                  </button>
                </div>

                <div className="text-center">
                  <Link href="/dashboard/suitpax-ai">
                    <Button className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium tracking-tighter">
                      Open Full Chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

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

      {/* Draggable Dashboard Cards */}
      <DraggableDashboard cards={dashboardCards} onReorder={handleCardReorder} />
    </div>
  )
}
