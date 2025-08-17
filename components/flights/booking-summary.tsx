"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TravelDetails, CurrencyConversion } from "@/types/duffel-ui"

interface Props {
  offer: any
  details?: TravelDetails
  conversion?: CurrencyConversion
}

export default function BookingSummary({ offer, details, conversion }: Props) {
  const amount = parseFloat(offer?.total_amount || '0')
  const curr = offer?.total_currency || 'USD'
  const converted = conversion ? amount * conversion.rate : null

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-800">
        {details && (
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="font-medium">{details.origin} → {details.destination}</div>
            <div className="text-gray-600">
              {details.departureDate}{details.returnDate ? ` • return ${details.returnDate}` : ''}
            </div>
            <div className="text-gray-600">
              {details.cabinClass} • {details.passengers.adults} adult{(details.passengers.adults || 1) > 1 ? 's' : ''}
              {details.passengers.children ? ` • ${details.passengers.children} child` : ''}
              {details.passengers.infants ? ` • ${details.passengers.infants} infant` : ''}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>Total</div>
          <div className="font-semibold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(amount)}
          </div>
        </div>
        {converted && conversion && (
          <div className="flex items-center justify-between text-gray-600">
            <div>≈ {conversion.target_currency}</div>
            <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: conversion.target_currency, maximumFractionDigits: 0 }).format(converted)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
