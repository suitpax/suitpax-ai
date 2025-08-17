"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TravelDetails, CurrencyConversion } from "@/types/duffel-ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  offer: any
  details?: TravelDetails
  conversion?: CurrencyConversion
}

export default function BookingSummary({ offer, details }: Props) {
  const amount = parseFloat(offer?.total_amount || '0')
  const curr = offer?.total_currency || 'USD'
  const [target, setTarget] = useState<string>('USD')
  const [rate, setRate] = useState<number | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        if (!target || target === curr) { setRate(null); return }
        const url = new URL('/api/flights/currency', window.location.origin)
        url.searchParams.set('base', curr)
        url.searchParams.set('target', target)
        const res = await fetch(url.toString())
        const json = await res.json()
        if (res.ok) setRate(json?.data?.rate || null)
      } catch {}
    }
    run()
  }, [curr, target])

  const converted = rate ? amount * rate : null

  return (
    <Card className="border-gray-200 bg-white rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 text-base tracking-tighter">Summary</CardTitle>
          <div className="w-28">
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="bg-white text-gray-900 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                {[curr, 'USD','EUR','GBP'].filter((v, i, a) => a.indexOf(v) === i).map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
        {converted && (
          <div className="flex items-center justify-between text-gray-600">
            <div>≈ {target}</div>
            <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: target, maximumFractionDigits: 0 }).format(converted)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
