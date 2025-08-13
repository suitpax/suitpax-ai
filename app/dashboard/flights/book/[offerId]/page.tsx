"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlaneIcon, CreditCardIcon, UserIcon } from "lucide-react"
import { formatPrice, formatDuration, getStopDescription } from "@/lib/duffel/utils"
import type { DuffelOffer } from "@/lib/duffel/client"

export default function FlightBookingPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params.offerId as string

  const [offer, setOffer] = useState<DuffelOffer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [passengers, setPassengers] = useState([
    {
      given_name: "",
      family_name: "",
      title: "mr",
      gender: "male",
      born_on: "",
      phone_number: "",
      email: "",
    },
  ])

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`/api/flights/offers/${offerId}`)
        const data = await response.json()
        setOffer(data.offer)
      } catch (error) {
        console.error("Error fetching offer:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOffer()
  }, [offerId])

  const handleBooking = async () => {
    if (!offer) return

    setIsBooking(true)
    try {
      const response = await fetch("/api/flights/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer_id: offerId,
          passengers,
          payment_amount: offer.total_amount,
          payment_currency: offer.total_currency,
        }),
      })

      const data = await response.json()
      if (data.success) {
        router.push(`/dashboard/flights/confirmation/${data.order.id}`)
      }
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Flight not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-medium tracking-tighter leading-none mb-2">Complete Your Booking</h1>
          <p className="text-lg font-light text-gray-600">Review flight details and passenger information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneIcon className="h-5 w-5" />
                  Flight Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {offer.slices.map((slice, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{index === 0 ? "Outbound" : "Return"} Flight</h3>
                      <div className="text-sm text-gray-600">
                        {formatDuration(slice.duration)} • {getStopDescription(slice.segments.length - 1)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-medium">
                          {new Date(slice.segments[0].departing_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                        <div className="text-sm text-gray-600">{slice.origin.iata_code}</div>
                      </div>

                      <div className="flex-1 flex items-center">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <PlaneIcon className="h-4 w-4 text-gray-400 mx-2" />
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-medium">
                          {new Date(slice.segments[slice.segments.length - 1].arriving_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                        <div className="text-sm text-gray-600">{slice.destination.iata_code}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Passenger Details */}
            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Passenger Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="md:col-span-2">
                      <h4 className="font-medium mb-4">Passenger {index + 1}</h4>
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Select
                        value={passenger.title}
                        onValueChange={(value) => {
                          const updated = [...passengers]
                          updated[index].title = value
                          setPassengers(updated)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr</SelectItem>
                          <SelectItem value="ms">Ms</SelectItem>
                          <SelectItem value="mrs">Mrs</SelectItem>
                          <SelectItem value="dr">Dr</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={passenger.given_name}
                        onChange={(e) => {
                          const updated = [...passengers]
                          updated[index].given_name = e.target.value
                          setPassengers(updated)
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={passenger.family_name}
                        onChange={(e) => {
                          const updated = [...passengers]
                          updated[index].family_name = e.target.value
                          setPassengers(updated)
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={passenger.born_on}
                        onChange={(e) => {
                          const updated = [...passengers]
                          updated[index].born_on = e.target.value
                          setPassengers(updated)
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => {
                          const updated = [...passengers]
                          updated[index].email = e.target.value
                          setPassengers(updated)
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={passenger.phone_number}
                        onChange={(e) => {
                          const updated = [...passengers]
                          updated[index].phone_number = e.target.value
                          setPassengers(updated)
                        }}
                        required
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Flight Price</span>
                  <span className="font-medium">{formatPrice(offer.total_amount, offer.total_currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>{formatPrice(offer.total_amount, offer.total_currency)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  {isBooking ? "Processing..." : "Complete Booking"}
                </Button>

                <p className="text-xs text-gray-600 text-center">By booking, you agree to our terms and conditions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
