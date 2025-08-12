"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface SubscriptionStatus {
  planName: string
  aiTokensLimit: number
  aiTokensUsed: number
  teamMembersLimit: number
  travelSearchesLimit: number
  travelSearchesUsed: number
  features: {
    hasAiExpenseManagement: boolean
    hasCustomPolicies: boolean
    hasPrioritySupport: boolean
    hasBankIntegration: boolean
    hasCrmIntegration: boolean
  }
  usage: {
    aiTokensPercentage: number
    travelSearchesPercentage: number
  }
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("User not authenticated")
        return
      }

      const response = await fetch(`/api/subscriptions/status?userId=${user.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch subscription status")
      }

      const data = await response.json()
      setStatus(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const createCheckoutSession = async (priceId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const response = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  const manageBilling = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const response = await fetch("/api/subscriptions/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to create billing portal session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    createCheckoutSession,
    manageBilling,
  }
}
