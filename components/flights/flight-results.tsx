"use client"

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
  conditions?: any
}

interface Props {
  offers: FlightOffer[]
  onSelectOffer?: (offer: FlightOffer) => void
  onTrackPrice?: (offerId: string) => void
  className?: string
}

export default function FlightResults({ offers, onSelectOffer, onTrackPrice, className = '' }: Props) {
  if (!offers || offers.length === 0) {
    return <div className="rounded-3xl border border-gray-200 glass-card p-6 text-gray-600">No hay vuelos disponibles para estos criterios.</div>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {offers.map((offer) => (
        <Card key={offer.id} className="glass-card hover-raise">
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
                    <span className="text-sm text-gray-700 tracking-tighter">{airlineName} ({airlineIata})</span>
                  </div>
                )
              })()}
            </div>
            <div className="text-right">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
              </CardTitle>
              <div className="text-xs text-gray-500">Expira {new Date(offer.expires_at).toLocaleString()}</div>
              {offer?.conditions && (
                <div className="mt-1 flex items-center justify-end gap-2">
                  {offer.conditions.refund_before_departure && (
                    <span className={`dc-baggage-item ${offer.conditions.refund_before_departure.allowed ? '' : 'opacity-60'}`}>Refundable</span>
                  )}
                  {offer.conditions.change_before_departure && (
                    <span className={`dc-baggage-item ${offer.conditions.change_before_departure.allowed ? '' : 'opacity-60'}`}>Changeable</span>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {offer.slices.map((slice, idx) => (
              <div key={slice.id} className="slice-summary">
                <div className="flex items-center justify-between text-sm text-gray-800">
                  <div className="font-medium tracking-tighter">Tramo {idx + 1}: {slice.origin?.iata_code} → {slice.destination?.iata_code}</div>
                  <div className="text-gray-600">Duración: {slice.duration?.replace('PT', '').toLowerCase()}</div>
                </div>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {slice.segments.map(seg => {
                    const destCity = seg.destination?.city?.name || seg.destination?.city_name || seg.destination?.name
                    const cityThumb = destCity ? `https://source.unsplash.com/96x64/?${encodeURIComponent(destCity + ' skyline')}` : ''
                    const logo = seg.airline?.logo_symbol_url || seg.airline?.logo_lockup_url
                    return (
                      <div key={seg.id} className="segment">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {(seg.origin?.city?.name || seg.origin?.city_name || seg.origin?.name)} ({seg.origin?.iata_code}) → {(seg.destination?.city?.name || seg.destination?.city_name || seg.destination?.name)} ({seg.destination?.iata_code})
                            </div>
                            <div className="segment-meta">{seg.marketing_carrier?.iata_code}{seg.flight_number}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {cityThumb && (
                              <img
                                src={cityThumb}
                                alt={destCity || ''}
                                className="h-10 w-16 rounded-md object-cover border border-gray-200"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&h=64&w=96' }}
                              />
                            )}
                            {logo ? (
                              <img src={logo} alt={seg.airline?.name || ''} className="h-4" />
                            ) : (
                              <span className="text-xs text-gray-600">{seg.marketing_carrier?.iata_code}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-gray-600 text-xs">
                          <div>Sale: {new Date(seg.departing_at).toLocaleString()}</div>
                          <div>Llega: {new Date(seg.arriving_at).toLocaleString()}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3">
              <Button variant="secondary" className="dc-button-secondary w-full sm:w-auto" onClick={() => onTrackPrice?.(offer.id)}>
                Seguir precio
              </Button>
              <Button className="dc-button-primary w-full sm:w-auto" onClick={() => onSelectOffer?.(offer)}>
                Reservar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
