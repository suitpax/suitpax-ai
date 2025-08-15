"use client"

import { useEffect } from "react"
import Intercom from "@intercom/messenger-js-sdk"

type IntercomProviderProps = {
  user?: {
    id?: string
    name?: string
    email?: string
    createdAt?: number
  }
}

export default function IntercomProvider({ user }: IntercomProviderProps) {
  useEffect(() => {
    // Only initialize Intercom on the client side
    if (typeof window !== "undefined") {
      // Initialize Intercom with the app ID and user data if available
      Intercom({
        app_id: "t7e59vcn",
        user_id: user?.id, // Use optional chaining to safely access user data
        name: user?.name,
        email: user?.email,
        created_at: user?.createdAt,
      })

      // Clean up function to shut down Intercom when component unmounts
      return () => {
        if (typeof window !== "undefined" && window.Intercom) {
          window.Intercom("shutdown")
        }
      }
    }
  }, [user]) // Re-initialize when user data changes

  // This component doesn't render anything visible
  return null
}
