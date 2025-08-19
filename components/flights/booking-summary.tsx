"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TravelDetails, CurrencyConversion } from "@/types/duffel-ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

const CITY_KEYWORDS: Record<string, string> = {
  london: 'London Big Ben skyline',
  roma: 'Rome Colosseum skyline',
  rome: 'Rome Colosseum skyline',
  paris: 'Paris Eiffel Tower skyline',
  barcelona: 'Barcelona Sagrada Familia skyline',
  madrid: 'Madrid Cibeles skyline',
  berlin: 'Berlin Brandenburg Gate skyline',
}

function getCityImageUrl(cityName?: string, width = 320, height = 200) {
  const key = (cityName || '').toLowerCase().trim()
  const query = CITY_KEYWORDS[key] || `${cityName || 'city'} skyline`
  return `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(query)}`
}

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
  const destCityName = details?.destination
  const cityImage = getCityImageUrl(destCityName)

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
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
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_200px] items-stretch">
          <div className="space-y-2 text-sm text-gray-800">
            {details && (
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="font-medium">{details.origin} → {details.destination}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0 text-[10px]">{details.departureDate}</span>
                  {details.returnDate && (
                    <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0 text-[10px]">return {details.returnDate}</span>
                  )}
                </div>
                <div className="text-gray-600 text-[11px] mt-1">
                  {details.cabinClass} • {details.passengers.adults} adult{(details.passengers.adults || 1) > 1 ? 's' : ''}
                  {details.passengers.children ? ` • ${details.passengers.children} child` : ''}
                  {details.passengers.infants ? ` • ${details.passengers.infants} infant` : ''}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-gray-700">Total</div>
              <div className="text-2xl font-semibold text-gray-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(amount)}
              </div>
            </div>
            {converted && (
              <div className="flex items-center justify-between text-gray-600 text-[11px]">
                <div>≈ {target}</div>
                <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: target, maximumFractionDigits: 0 }).format(converted)}</div>
              </div>
            )}
          </div>

          {/* Imagen del destino */}
          <div className="md:pl-2">
            <div className="relative w-full h-[140px] md:h-full min-h-[140px] rounded-xl overflow-hidden border border-gray-200">
              <Image src={cityImage} alt={destCityName || ''} fill sizes="(min-width: 768px) 200px, 100vw" className="object-cover" />
            </div>
            <div className="mt-1 text-center text-xs text-gray-600">{destCityName}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
