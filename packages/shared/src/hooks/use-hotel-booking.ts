"use client"

import { useState } from "react"

interface GuestInfo {
  given_name: string
  family_name: string
  born_on: string
  phone_number: string
  email: string
}

export function useHotelBooking() {
  const [isLoading, setIsLoading] = useState(false)
  const [booking, setBooking] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (quoteId: string, guestInfo: GuestInfo, specialRequests?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/hotels/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote_id: quoteId,
          guest_info: guestInfo,
          special_requests: specialRequests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      setBooking(data.booking)
      return data.booking
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createBooking,
    isLoading,
    booking,
    error,
  }
}
