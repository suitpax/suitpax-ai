"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Trip = {
  id: string
  origin: string
  destination: string
  airline: { name: string; iata: string }
  teammates?: string[]
  company?: string
  event?: string
  date: string
}

const DEMO_TRIPS: Trip[] = [
  { id: 't1', origin: 'MAD', destination: 'LHR', airline: { name: 'British Airways', iata: 'BA' }, teammates: ['Ana', 'Luis'], company: 'Acme Ltd', event: 'Sales QBR', date: '2025-03-12' },
  { id: 't2', origin: 'JFK', destination: 'SFO', airline: { name: 'United Airlines', iata: 'UA' }, teammates: ['Mike'], company: 'Stripe', event: 'Partner Summit', date: '2025-02-02' },
  { id: 't3', origin: 'CDG', destination: 'AMS', airline: { name: 'Air France', iata: 'AF' }, teammates: ['Sara'], company: 'Booking', event: 'Product Workshop', date: '2025-01-20' },
]

export default function TripsPage() {
  const trips = useMemo(() => DEMO_TRIPS, [])

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter">Past Trips</h1>
        <p className="text-sm text-gray-600 mt-1">Your travel history at a glance</p>
      </div>

      {/* Map placeholder with badges */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base">Where you’ve been</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-72 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden">
            {/* Replace with real map. For now, badge clusters */}
            <div className="absolute inset-0 p-4 flex flex-wrap gap-2 items-start">
              {trips.map((t) => (
                <span key={t.id} className="inline-flex items-center rounded-full bg-white border border-gray-300 px-3 py-1 text-xs text-gray-800 shadow-sm">
                  {t.origin} → {t.destination} • {t.airline.iata}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip details list */}
      <div className="grid gap-4 md:grid-cols-3">
        {trips.map((t) => (
          <Card key={t.id} className="border-gray-200">
            <CardContent className="p-4 space-y-2">
              <div className="text-sm font-medium text-gray-900">{t.origin} → {t.destination} <span className="text-gray-500">({t.date})</span></div>
              <div className="text-xs text-gray-600">Airline: {t.airline.name} ({t.airline.iata})</div>
              {t.company && <div className="text-xs text-gray-600">Company: {t.company}</div>}
              {t.event && <div className="text-xs text-gray-600">Event: {t.event}</div>}
              {t.teammates && t.teammates.length > 0 && (
                <div className="text-xs text-gray-600">With: {t.teammates.join(', ')}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

