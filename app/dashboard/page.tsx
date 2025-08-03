"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Plane,
  Hotel,
  CreditCard,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Zap,
  CheckCircle,
  ArrowRight,
  Plus,
  Users,
  Building,
  MapPin,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

// Interfaces
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

interface User {
  id: string
  email?: string
  created_at: string
  user_metadata?: {
    full_name?: string
  }
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

  // Configuración inicial para nuevos usuarios
  const initializeNewUser = useCallback(() => {
    const welcomeActivity: RecentActivity = {
      id: "welcome",
      type: "welcome",
      title: "Welcome to Suitpax!",
      description: "Your business travel account has been created successfully",
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
          // Todos los usuarios empiezan con estado cero
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

  // Acciones principales para empezar
  const quickActions = [
    {
      icon: Plane,
      title: "Book Your First Flight",
      description: "Start by booking your first business trip",
      href: "/dashboard/flights",
      color: "bg-gray-100 text-gray-800",
      priority: true,
    },
    {
      icon: Hotel,
      title: "Find Hotels",
      description: "Discover and book accommodations",
      href: "/dashboard/hotels",
      color: "bg-gray-100 text-gray-800",
      priority: true,
    },
    {
      icon: Users,
      title: "Invite Team",
      description: "Add team members to your account",
      href: "/dashboard/team",
      color: "bg-gray-100 text-gray-800",
      priority: false,
    },
    {
      icon: Building,
      title: "Company Setup",
      description: "Configure your company travel policies",
      href: "/dashboard/settings",
      color: "bg-gray-100 text-gray-800",
      priority: false,
    },
  ]

  // Pasos de onboarding
  const onboardingSteps = [
    {
      icon: CheckCircle,
      title: "Complete Your Profile",
      description: "Add your travel preferences and contact details",
      href: "/dashboard/profile",
      completed: false,
    },
    {
      icon: MapPin,
      title: "Set Travel Preferences",
      description: "Configure your preferred airlines, hotels, and travel class",
      href: "/dashboard/preferences",
      completed: false,
    },
    {
      icon: CreditCard,
      title: "Add Payment Method",
      description: "Secure payment setup for seamless bookings",
      href: "/dashboard/billing",
      completed: false,
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tighter leading-none">
                <em className="font-serif italic">Welcome to</em>
                <br />
                <span className="text-gray-900">Suitpax</span>
              </h1>
              <p className="text-lg font-light text-gray-600 mt-2">
                Let's get your business travel management set up
              </p>
            </div>
            <div className="hidden md:block">
              <div className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
                <em className="font-serif italic">New Account</em>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Getting Started Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium tracking-tighter mb-2">Get Started in 3 Simple Steps</h3>
                <p className="text-sm font-light text-gray-600 mb-6">
                  Complete your setup to unlock AI-powered business travel management
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {onboardingSteps.map((step, index) => (
                    <Link
                      key={index}
                      href={step.href}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                          {step.title}
                        </p>
                        <p className="text-xs font-light text-gray-600 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Estado Cero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Trips</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{stats.totalTrips}</p>
                <p className="text-xs text-gray-700 font-medium mt-1">Book your first trip →</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Plane className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Savings</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">${stats.totalSavings.toLocaleString()}</p>
                <p className="text-xs text-gray-700 font-medium mt-1">Start saving with AI →</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Upcoming Trips</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{stats.upcomingTrips}</p>
                <p className="text-xs text-gray-700 font-medium mt-1">Plan your trips →</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Bookings</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{stats.activeBookings}</p>
                <p className="text-xs text-gray-700 font-medium mt-1">Make first booking →</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Quick Actions</em>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                      action.priority 
                        ? 'border-gray-300 bg-gray-50 hover:border-gray-400' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium tracking-tighter group-hover:text-black transition-colors">
                            {action.title}
                          </h3>
                          {action.priority && (
                            <div className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-800">
                              Start Here
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

          {/* Recent Activity - Estado Inicial */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Activity</em>
              </h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm tracking-tighter">{activity.title}</p>
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
                    <p className="text-xs text-gray-500 mt-1">Your travel activity will appear here</p>
                  </div>
                )}
                
                {/* Placeholder for future activities */}
                <div className="border-t border-gray-100 pt-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 opacity-40">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Plane className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light text-gray-500">First flight booking</p>
                        <p className="text-xs text-gray-400">Coming soon...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-40">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Hotel className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light text-gray-500">Hotel reservation</p>
                        <p className="text-xs text-gray-400">Coming soon...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Assistant CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium tracking-tighter mb-2">
                  <em className="font-serif italic">Meet Zia, Your AI Travel Assistant</em>
                </h3>
                <p className="font-light text-gray-300">
                  Get personalized help with booking flights, finding hotels, and managing your travel expenses.
                </p>
              </div>
              <Link
                href="/dashboard/ai-chat"
                className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <em className="font-serif italic">Start Chatting</em>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
