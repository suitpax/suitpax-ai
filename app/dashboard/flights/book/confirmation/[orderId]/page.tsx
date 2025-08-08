"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FlightItinerary from "@/components/flights/flight-itinerary"
import { toast } from "sonner"

interface DuffelOrder {
  id: string
  booking_reference: string
  total_amount: string
  total_currency: string
  passengers: Array<{ given_name: string; family_name: string }>
  slices: any[]
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<DuffelOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/flights/duffel/orders/${orderId}`)
        const data = await res.json()
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch order details.")
        }
        setOrder(data.order)
      } catch (error: any) {
        toast.error(error.message)
        router.push("/dashboard/flights")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Could not load booking confirmation.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your booking reference is <strong className="font-semibold text-gray-800">{order.booking_reference}</strong>.
          </p>
          <p className="text-sm text-gray-500">A confirmation email has been sent to you.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Flight Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <FlightItinerary slices={order.slices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passenger Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {order.passengers.map((p, index) => (
                <li key={index} className="py-3">
                  <p className="font-medium text-gray-800">{p.given_name} {p.family_name}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/dashboard/flights')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Flights
          </Button>
        </div>
      </div>
    </div>
  )
}
