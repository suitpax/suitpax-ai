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
  CheckCircle,
  Clock,
  CreditCard,
  Users,
  Briefcase,
  PiggyBank,
  Receipt,
  Banknote,
  Target,
  Globe,
  Shield,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import DashboardOverviewV2 from "@/components/dashboard/dashboard-overview-v2"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { useOnboarding } from "@/hooks/use-onboarding"

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

  // Added onboarding hook
  const { shouldShowOnboarding, isLoading: onboardingLoading, markOnboardingComplete, skipOnboarding } = useOnboarding()

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

  const onboardingSteps = [
    {
      title: "Connect Your Bank",
      description: "Link accounts for expense tracking",
      icon: CreditCard,
      href: "/dashboard/finance",
    },
    {
      title: "Set Travel Policies",
      description: "Configure business travel rules",
      icon: Shield,
      href: "/dashboard/settings",
    },
    {
      title: "Book First Trip",
      description: "Start with AI-powered search",
      icon: Plane,
      href: "/dashboard/flights",
    },
  ]

  const quickActions = [
    {
      title: "Search Business Flights",
      description: "AI-powered flight search with corporate rates",
      icon: Plane,
      href: "/dashboard/flights",
      color: "bg-blue-100 text-blue-600",
      priority: true,
    },
    {
      title: "Track Expenses",
      description: "Upload receipts and manage business expenses",
      icon: Receipt,
      href: "/dashboard/expenses",
      color: "bg-green-100 text-green-600",
      priority: true,
    },
    {
      title: "Connect Banking",
      description: "Link corporate accounts for automated tracking",
      icon: Banknote,
      href: "/dashboard/finance",
      color: "bg-purple-100 text-purple-600",
      priority: false,
    },
    {
      title: "Invite Team Members",
      description: "Add colleagues to your travel workspace",
      icon: Users,
      href: "/dashboard/team",
      color: "bg-orange-100 text-orange-600",
      priority: false,
    },
  ]

  if (isLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      {/* Added onboarding flow */}
      <OnboardingFlow isOpen={shouldShowOnboarding} onClose={skipOnboarding} onComplete={markOnboardingComplete} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <DashboardOverviewV2 />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none text-gray-900">
                  Business Travel Hub
                </h1>
                <p className="text-lg font-light text-gray-600 mt-2">
                  Streamline corporate travel with AI-powered expense management
                </p>
              </div>
              <div className="hidden md:block">
                <div className="inline-flex items-center rounded-xl bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  <em className="font-serif italic">Enterprise Ready</em>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold tracking-tight mb-2 text-gray-900">Get Started in 3 Steps</h3>
                  <p className="text-sm font-light text-gray-600 mb-6">
                    Set up your corporate travel management system with AI-powered expense tracking
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {onboardingSteps.map((step, index) => (
                      <Link
                        key={index}
                        href={step.href}
                        className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">
                            {step.title}
                          </p>
                          <p className="text-xs font-light text-gray-600 mt-0.5">{step.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Business Trips</p>
                  <p className="text-3xl font-semibold text-gray-900 tracking-tight">{stats.totalTrips}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Target className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-blue-600 font-medium">Book your first trip</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Cost Savings</p>
                  <p className="text-3xl font-semibold text-gray-900 tracking-tight">
                    ${stats.totalSavings.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <PiggyBank className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">Start saving with AI</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Expense Reports</p>
                  <p className="text-3xl font-semibold text-gray-900 tracking-tight">0</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Receipt className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-600 font-medium">Upload first receipt</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Bank Connections</p>
                  <p className="text-3xl font-semibold text-gray-900 tracking-tight">0</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Banknote className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-orange-600 font-medium">Connect accounts</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">Corporate Travel Spending</h2>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Ready to track</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", amount: 0 },
                      { month: "Feb", amount: 0 },
                      { month: "Mar", amount: 0 },
                      { month: "Apr", amount: 0 },
                      { month: "May", amount: 0 },
                      { month: "Jun", amount: 0 },
                    ]}
                    margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
                      formatter={(v: any) => `$${Number(v).toLocaleString()}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold tracking-tight mb-6 text-gray-900">
                  <em className="font-serif italic">Quick Actions</em>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        action.priority
                          ? "border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold tracking-tight group-hover:text-black transition-colors text-gray-900">
                              {action.title}
                            </h3>
                            {action.priority && (
                              <div className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800">
                                Priority
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-light text-gray-600 mt-1">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold tracking-tight mb-6 text-gray-900">
                  <em className="font-serif italic">Recent Activity</em>
                </h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm tracking-tight text-gray-900">{activity.title}</p>
                          <p className="text-xs font-light text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp.toLocaleDateString()} at{" "}
                            {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-light text-gray-600">No activity yet</p>
                      <p className="text-xs text-gray-500 mt-1">Your business travel activity will appear here</p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-light text-gray-500">First business flight booking</p>
                          <p className="text-xs text-gray-400">Coming soon...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-light text-gray-500">Expense report submission</p>
                          <p className="text-xs text-gray-400">Coming soon...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
