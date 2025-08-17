"use client"

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FlightOfferSegment {
  id: string
  origin: any
  destination: any
  departing_at: string
  arriving_at: string
  marketing_carrier: { iata_code?: string; name?: string }
  operating_carrier: any
  flight_number: string
  aircraft: any
  airline?: { name?: string; logo_symbol_url?: string; logo_lockup_url?: string; iata_code?: string }
}

interface FlightOfferSlice {
  id: string
  origin: any
  destination: any
  duration: string
  segments: FlightOfferSegment[]
}

interface FlightOffer {
  id: string
  total_amount: string
  total_currency: string
  expires_at: string
  slices: FlightOfferSlice[]
}

interface Props {
  offers: FlightOffer[]
  onSelectOffer?: (offer: FlightOffer) => void
  onTrackPrice?: (offerId: string) => void
  className?: string
}

export default function FlightResults({ offers, onSelectOffer, onTrackPrice, className = '' }: Props) {
  if (!offers || offers.length === 0) {
    return <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">No hay vuelos disponibles para estos criterios.</div>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {offers.map((offer) => (
        <Card key={offer.id} className="border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const seg = offer.slices?.[0]?.segments?.[0]
                const airlineName = seg?.airline?.name || seg?.marketing_carrier?.name
                const airlineIata = seg?.airline?.iata_code || seg?.marketing_carrier?.iata_code
                const logo = seg?.airline?.logo_lockup_url || seg?.airline?.logo_symbol_url
                if (!airlineName) return null
                return (
                  <div className="flex items-center gap-2">
                    {logo && <img src={logo} alt={airlineName} className="h-5" />}
                    <span className="text-sm text-gray-700">{airlineName} ({airlineIata})</span>
                  </div>
                )
              })()}
            </div>
            <div className="text-right">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {offer.total_amount} {offer.total_currency}
              </CardTitle>
              <div className="text-xs text-gray-500">Expira {new Date(offer.expires_at).toLocaleString()}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {offer.slices.map((slice, idx) => (
              <div key={slice.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between text-sm text-gray-800">
                  <div className="font-medium">Tramo {idx + 1}: {slice.origin?.iata_code} → {slice.destination?.iata_code}</div>
                  <div className="text-gray-600">Duración: {slice.duration?.replace('PT', '').toLowerCase()}</div>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {slice.segments.map(seg => (
                    <div key={seg.id} className="rounded-md bg-white border border-gray-200 p-2 text-xs text-gray-800">
                      <div className="flex items-center justify-between">
                        <div>{seg.origin?.iata_code} → {seg.destination?.iata_code}</div>
                        <div>{seg.marketing_carrier?.iata_code}{seg.flight_number}</div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-gray-600">
                        <div>Sale: {new Date(seg.departing_at).toLocaleString()}</div>
                        <div>Llega: {new Date(seg.arriving_at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={() => onTrackPrice?.(offer.id)}>
                Seguir precio
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={() => onSelectOffer?.(offer)}>
                Reservar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
