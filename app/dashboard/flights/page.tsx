"use client"

import { useState } from 'react'
import FlightSearchForm from '@/components/flights/flight-search-form'
import FlightResults from '@/components/flights/flight-results'

export default function FlightsPage() {
  const [offers, setOffers] = useState<any[]>([])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Flights</h1>
        <p className="text-sm text-neutral-500">Busca vuelos en tiempo real con integración a Duffel</p>
      </div>

      <FlightSearchForm onResults={(data) => {
        const results = Array.isArray(data?.data) ? data.data : (data?.offers || data?.data?.offers || [])
        setOffers(results || [])
      }} />

      <FlightResults offers={offers} />
    </div>
  )
}