"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Onboarding } from "@/components/dashboard/onboarding"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UserData {
  id: string
  full_name: string
  company_name: string
  plan_type: string
  ai_tokens_used: number
  ai_tokens_limit: number
  travel_searches_used: number
  onboarding_completed: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (userData) {
            setUser(userData)
            setShowOnboarding(!userData.onboarding_completed)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const handleOnboardingComplete = async () => {
    if (user) {
      await supabase.from("users").update({ onboarding_completed: true }).eq("id", user.id)

      setShowOnboarding(false)
      setUser({ ...user, onboarding_completed: true })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load user data. Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black">
            Welcome back, {user.full_name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.company_name} • {user.plan_type} Plan
          </p>
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
          <Onboarding onComplete={handleOnboardingComplete} />
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
            <p>No recent activity yet.</p>
            <p className="text-sm mt-1">Start by booking your first trip or chatting with the AI assistant.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
