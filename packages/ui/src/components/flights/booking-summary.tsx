"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Users, DollarSign } from 'lucide-react'

interface BookingSummaryProps {
  totalAmount: string
  currency: string
  passengersCount: number
}

export default function BookingSummary({ totalAmount, currency, passengersCount }: BookingSummaryProps) {
  const price = parseFloat(totalAmount)
  const taxes = price * 0.15 // Example tax calculation
  const basePrice = price - taxes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 flex items-center gap-2"><Users className="h-4 w-4" /> Passengers</p>
          <p className="font-medium">{passengersCount}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Base Fare</p>
          <p className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(basePrice)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Taxes and Fees</p>
          <p className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(taxes)}</p>
        </div>
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between items-center text-lg font-semibold">
          <p>Total</p>
          <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
