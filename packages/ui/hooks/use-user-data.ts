"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  company_name: string | null
  job_title: string | null
  phone: string | null
  onboarding_completed: boolean | null
  subscription_plan: string | null
  subscription_status: string | null
  ai_tokens_used: number | null
  ai_tokens_limit: number | null
}

interface UserPreferences {
  currency: string | null
  timezone: string | null
  email_notifications: boolean | null
  push_notifications: boolean | null
  sms_notifications: boolean | null
  preferred_airlines: string[] | null
  preferred_airports: string[] | null
  class_preference: string | null
  seat_preference: string | null
  meal_preference: string | null
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchUserData() {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          setError(userError.message)
          return
        }

        if (!user) {
          setLoading(false)
          return
        }

        setUser(user)

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Profile fetch error:", profileError)
        } else if (profileData) {
          setProfile(profileData)
        }

        // Fetch user preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (preferencesError && preferencesError.code !== "PGRST116") {
          console.error("Preferences fetch error:", preferencesError)
        } else if (preferencesData) {
          setPreferences(preferencesData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        fetchUserData()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setPreferences(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: "No user found" }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    setProfile(data)
    return { data }
  }

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return { error: "No user found" }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("user_preferences")
      .upsert({ user_id: user.id, ...updates })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    setPreferences(data)
    return { data }
  }

  return {
    user,
    profile,
    preferences,
    loading,
    error,
    updateProfile,
    updatePreferences,
    displayName: profile?.full_name || profile?.first_name || user?.email?.split("@")[0] || "User",
    isOnboardingComplete: profile?.onboarding_completed || false,
    planType: profile?.subscription_plan || "free",
  }
}
