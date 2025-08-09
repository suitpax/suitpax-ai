"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, User, CreditCard, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PassengerForm from "@/components/flights/passenger-form"
import FlightItinerary from "@/components/flights/flight-itinerary"
import BookingSummary from "@/components/flights/booking-summary"
import { StripePaymentForm } from "@/components/flights/stripe-payment-form"
import { toast } from "sonner"

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
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'confirmation'>('details')
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null)

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
        setPassengers(data.offer.passengers.map((p: any) => ({
          title: 'mr',
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

  const validatePassengers = () => {
    for (const p of passengers) {
      if (!p.given_name || !p.family_name || !p.born_on || !p.email) {
        toast.error("Please fill all required fields for all passengers.")
        return false
      }
    }
    return true
  }

  const handleContinueToPayment = async () => {
    if (!validatePassengers() || !offer) return

    setBooking(true)
    try {
      const res = await fetch("/api/flights/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          offerId, 
          passengers,
          amount: Math.round(parseFloat(offer.total_amount) * 100),
          currency: offer.total_currency.toLowerCase()
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create payment intent.")
      }

      setPaymentIntent(data.clientSecret)
      setCurrentStep('payment')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setBooking(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setBooking(true)
    try {
      const res = await fetch("/api/flights/duffel/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          offerId, 
          passengers,
          paymentIntentId 
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Booking failed.")
      }

      toast.success("Booking successful! Redirecting to confirmation...")
      router.push(`/dashboard/flights/book/confirmation/${data.order.id}`)
    } catch (error: any) {
      toast.error(error.message)
      setCurrentStep('details')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 font-light">Loading flight details...</p>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium">Could not load flight offer</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/flights")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to results
          </Button>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tighter leading-none">
              <em className="font-serif italic">Complete</em>
              <br />
              <span className="text-gray-900">Your Booking</span>
            </h1>
            <p className="text-sm md:text-base font-light text-gray-600 mt-2">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'details' ? 'text-gray-900' : currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-gray-900 text-white' : currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {currentStep === 'payment' || currentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Passenger Details</span>
            </div>
            
            <div className={`w-16 h-px ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-gray-900' : currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-gray-900 text-white' : currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {currentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            
            <div className={`w-16 h-px ${currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {currentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FlightItinerary slices={offer.slices} />
            
            {currentStep === 'details' && (
              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-medium tracking-tighter">
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
            )}

            {currentStep === 'payment' && paymentIntent && (
              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-medium tracking-tighter">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StripePaymentForm
                    clientSecret={paymentIntent}
                    amount={parseFloat(offer.total_amount)}
                    currency={offer.total_currency}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      toast.error(error)
                      setCurrentStep('details')
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <BookingSummary
              totalAmount={offer.total_amount}
              currency={offer.total_currency}
              passengersCount={offer.passengers.length}
            />
            
            {currentStep === 'details' && (
              <Button
                onClick={handleContinueToPayment}
                disabled={booking}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-6 text-lg font-medium tracking-tight"
              >
                {booking ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>Continue to Payment</>
                )}
              </Button>
            )}
            
            {currentStep === 'payment' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Your payment is secured by Stripe. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
