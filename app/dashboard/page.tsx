"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Onboarding } from "@/components/dashboard/onboarding"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, User, Building2 } from "lucide-react"
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

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
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
        toast.success("Welcome to Suitpax! Let's get you set up.")
      } else if (userError) {
        console.error("Error fetching user:", userError)
        toast.error("Error loading user data")
        return
      }

      if (userData) {
        setUser(userData)

        // Check if onboarding should be shown
        if (!userData.onboarding_completed || isNewUser) {
          setShowOnboarding(true)
        }

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

  const handleOnboardingComplete = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("users")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error completing onboarding:", error)
        toast.error("Error completing onboarding")
        return
      }

      setShowOnboarding(false)
      setUser({ ...user, onboarding_completed: true })
      toast.success("Welcome to Suitpax! You're all set up.")
    } catch (error) {
      console.error("Error in handleOnboardingComplete:", error)
      toast.error("Error completing onboarding")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
        <p className="text-gray-600 mb-6">There was an issue loading your profile. Please try refreshing the page.</p>
        <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800">
          Refresh Page
        </Button>
      </div>
    )
  }

  const getUserDisplayName = () => {
    if (user.full_name) {
      return user.full_name.split(" ")[0]
    }
    if (userProfile?.full_name) {
      return userProfile.full_name.split(" ")[0]
    }
    return "there"
  }

  const getCompanyName = () => {
    return user.company_name || userProfile?.company || "Your Company"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black">
            {isNewUser ? "Welcome to Suitpax" : `Welcome back, ${getUserDisplayName()}`}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="h-4 w-4 text-gray-500" />
            <p className="text-gray-600">
              {getCompanyName()} • {user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1)} Plan
            </p>
            {isNewUser && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
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
      </div>

      {/* Onboarding */}
      {showOnboarding && (
        <div className="mb-6">
          <Onboarding onComplete={handleOnboardingComplete} user={user} isNewUser={isNewUser} />
        </div>
      )}

      {/* Stats Overview */}
      <StatsOverview
        userPlan={user.plan_type}
        tokensUsed={user.ai_tokens_used}
        tokensLimit={user.ai_tokens_limit}
        travelSearches={user.travel_searches_used}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-medium tracking-tighter">Recent Activity</CardTitle>
          <CardDescription>Your latest travel activities and AI interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {isNewUser ? (
              <div>
                <p className="mb-2">Welcome to Suitpax! 🎉</p>
                <p className="text-sm">
                  Complete your onboarding above to get started with AI-powered business travel.
                </p>
              </div>
            ) : (
              <div>
                <p>No recent activity yet.</p>
                <p className="text-sm mt-1">Start by booking your first trip or chatting with the AI assistant.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
