"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useOnboarding() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      // Check localStorage first for quick response
      const skipped = localStorage.getItem("suitpax_onboarding_skipped")
      const completed = localStorage.getItem("suitpax_onboarding_completed")

      if (skipped === "true" || completed === "true") {
        setShouldShowOnboarding(false)
        setIsLoading(false)
        return
      }

      // Check database for onboarding status
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed, created_at")
          .eq("id", user.id)
          .single()

        if (profile) {
          const isNewUser = new Date(profile.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Created within last 24 hours
          const hasCompletedOnboarding = profile.onboarding_completed

          setShouldShowOnboarding(isNewUser && !hasCompletedOnboarding)
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      setShouldShowOnboarding(false)
    } finally {
      setIsLoading(false)
    }
  }

  const markOnboardingComplete = () => {
    setShouldShowOnboarding(false)
    localStorage.setItem("suitpax_onboarding_completed", "true")
  }

  const skipOnboarding = () => {
    setShouldShowOnboarding(false)
    localStorage.setItem("suitpax_onboarding_skipped", "true")
  }

  return {
    shouldShowOnboarding,
    isLoading,
    markOnboardingComplete,
    skipOnboarding,
  }
}
