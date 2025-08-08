"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, User, CreditCard, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PassengerForm from "@/components/flights/passenger-form"
import FlightItinerary from "@/components/flights/flight-itinerary"
import BookingSummary from "@/components/flights/booking-summary"
import { toast } from "sonner"

// Interfaces
interface DuffelOffer {
  id: string
  total_amount: string
  total_currency: string
  passengers: Array<{ type: string }>
  slices: any[]
}

interface PassengerData {
  id?: string
  title: string
  given_name: string
  family_name: string
  born_on: string
  email: string
  phone_number: string
  type: 'adult' | 'child' | 'infant_without_seat'
}

export default function BookFlightPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params.offerId as string

  const [offer, setOffer] = useState<DuffelOffer | null>(null)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (!offerId) return

    const fetchOffer = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/flights/duffel/offers/${offerId}`)
        const data = await res.json()
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch flight details.")
        }
        setOffer(data.offer)
        // Initialize passenger forms based on the offer
        setPassengers(data.offer.passengers.map((p: any) => ({
          title: 'Mr',
          given_name: '',
          family_name: '',
          born_on: '',
          email: '',
          phone_number: '',
          type: p.type,
        })))
      } catch (error: any) {
        toast.error(error.message)
        router.push("/dashboard/flights")
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [offerId, router])

  const handlePassengerChange = (index: number, data: PassengerData) => {
    const newPassengers = [...passengers]
    newPassengers[index] = data
    setPassengers(newPassengers)
  }

  const handleBooking = async () => {
    // Basic validation
    for (const p of passengers) {
      if (!p.given_name || !p.family_name || !p.born_on || !p.email) {
        toast.error("Please fill all required fields for all passengers.")
        return
      }
    }

    setBooking(true)
    try {
      const res = await fetch("/api/flights/duffel/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, passengers }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Booking failed.")
      }

      toast.success("Booking successful! Redirecting to confirmation...")
      router.push(`/dashboard/flights/book/confirmation/${data.order.id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Could not load flight offer.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to results
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FlightItinerary slices={offer.slices} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-semibold">
                  <User className="h-5 w-5" />
                  Passenger Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {passengers.map((p, index) => (
                  <PassengerForm
                    key={index}
                    passengerNumber={index + 1}
                    passengerData={p}
                    onChange={(data) => handlePassengerChange(index, data)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <BookingSummary
              totalAmount={offer.total_amount}
              currency={offer.total_currency}
              passengersCount={offer.passengers.length}
            />
            <Button
              onClick={handleBooking}
              disabled={booking}
              className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl py-6 text-lg font-semibold"
            >
              {booking ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-5 w-5" />
              )}
              Confirm and Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
