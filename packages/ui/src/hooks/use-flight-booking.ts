"use client"

import { useState } from "react"
import type { DuffelOrder } from "@/lib/duffel/client"

interface BookingPassenger {
  id: string
  given_name: string
  family_name: string
  title: string
  gender: string
  born_on: string
  phone_number: string
  email: string
}

export function useFlightBooking() {
  const [isLoading, setIsLoading] = useState(false)
  const [booking, setBooking] = useState<DuffelOrder | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (
    offerId: string,
    passengers: BookingPassenger[],
    paymentAmount: string,
    paymentCurrency: string,
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/flights/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer_id: offerId,
          passengers,
          payment_amount: paymentAmount,
          payment_currency: paymentCurrency,
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

  const getOffer = async (offerId: string) => {
    try {
      const response = await fetch(`/api/flights/offers/${offerId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get offer")
      }

      return data.offer
    } catch (err) {
      throw err
    }
  }

  return {
    createBooking,
    getOffer,
    isLoading,
    booking,
    error,
  }
}
