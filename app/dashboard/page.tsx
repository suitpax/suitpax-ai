"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { OnboardingPrompt } from "@/components/dashboard/onboarding-prompt"
import { EnhancedOnboarding } from "@/components/dashboard/enhanced-onboarding"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)

          // Check if user has completed onboarding
          const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

          if (profile) {
            setUserProfile(profile)
            // Show onboarding if not completed or if it's a new user
            if (!profile.onboarding_completed) {
              setShowOnboarding(true)
              setIsNewUser(!profile.first_name) // Consider new if no first name
            }
          } else {
            // Create user profile if it doesn't exist
            const { data: newProfile } = await supabase
              .from("users")
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  created_at: new Date().toISOString(),
                  onboarding_completed: false,
                },
              ])
              .select()
              .single()

            if (newProfile) {
              setUserProfile(newProfile)
              setShowOnboarding(true)
              setIsNewUser(true)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    // Refresh user profile
    const refreshProfile = async () => {
      if (user) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (profile) {
          setUserProfile(profile)
        }
      }
    }
    refreshProfile()
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (showOnboarding && user) {
    return (
      <div className="p-4 lg:p-6 min-h-screen bg-gray-50">
        <EnhancedOnboarding user={userProfile} isNewUser={isNewUser} onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none mb-2">
          <em className="font-serif italic">Welcome back</em>
          {userProfile?.first_name && <span className="text-gray-600">, {userProfile.first_name}</span>}
        </h1>
        <p className="text-gray-600 font-light text-sm md:text-base">Your AI-powered travel command center</p>
      </motion.div>

      {/* Onboarding Prompt for incomplete profiles */}
      {userProfile && !userProfile.onboarding_completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <OnboardingPrompt
            userName={userProfile.first_name || userProfile.email}
            onDismiss={() => setShowOnboarding(true)}
          />
        </motion.div>
      )}

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <StatsOverview />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <QuickActions />
      </motion.div>

      {/* AI Assistant Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium tracking-tighter">
            <em className="font-serif italic">Your AI Travel Assistant</em>
          </h2>
          <span className="inline-flex items-center rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse mr-1"></span>
            Active
          </span>
        </div>
        <p className="text-gray-600 font-light text-sm mb-4">
          Ready to help you plan, book, and manage your business travel with AI superpowers.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            Flight Booking
          </span>
          <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            Hotel Search
          </span>
          <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            Expense Tracking
          </span>
          <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            Policy Compliance
          </span>
        </div>
      </motion.div>
    </div>
  )
}
