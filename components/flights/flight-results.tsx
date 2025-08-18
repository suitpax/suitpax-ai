"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { resolveCityImage } from '@/lib/utils'

// City -> landmark mapping (kept for Unsplash/CDN fallback)
const CITY_KEYWORDS: Record<string, string> = {
  london: 'London Big Ben skyline',
  roma: 'Rome Colosseum skyline',
  rome: 'Rome Colosseum skyline',
  paris: 'Paris Eiffel Tower skyline',
  barcelona: 'Barcelona Sagrada Familia skyline',
  madrid: 'Madrid Cibeles skyline',
  berlin: 'Berlin Brandenburg Gate skyline',
  amsterdam: 'Amsterdam canals skyline',
  lisbon: 'Lisbon Belem Tower skyline',
  vienna: 'Vienna St Stephen Cathedral skyline',
  prague: 'Prague Charles Bridge skyline',
  milan: 'Milan Duomo skyline',
  venice: 'Venice Grand Canal skyline',
  athens: 'Athens Acropolis skyline',
  dublin: 'Dublin Ha Penny Bridge skyline',
  copenhagen: 'Copenhagen Nyhavn skyline',
  stockholm: 'Stockholm Gamla Stan skyline',
  oslo: 'Oslo Opera House skyline',
  helsinki: 'Helsinki Cathedral skyline',
  budapest: 'Budapest Parliament skyline',
  istanbul: 'Istanbul Hagia Sophia skyline',
  zurich: 'Zurich lake skyline',
  geneva: 'Geneva Jet d Eau skyline',
  frankfurt: 'Frankfurt skyline',
  munich: 'Munich Marienplatz skyline',
}

function getCityImageUrl(cityName?: string, width = 640, height = 400) {
  const key = (cityName || '').toLowerCase().trim()
  const query = CITY_KEYWORDS[key] || cityName
  return resolveCityImage(query || 'city', { width, height })
}

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
    return <div className="rounded-3xl border border-gray-200 glass-card p-6 text-gray-600">No flights available for these criteria.</div>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {offers.map((offer) => {
        // Main airline (first segment of first slice)
        const firstSlice = offer.slices?.[0]
        const firstSeg = firstSlice?.segments?.[0]
        const airlineName = firstSeg?.airline?.name || firstSeg?.marketing_carrier?.name || ''
        const airlineIata = firstSeg?.airline?.iata_code || firstSeg?.marketing_carrier?.iata_code || ''
        // Global route
        const overallOrigin = offer.slices?.[0]?.origin?.iata_code
        const overallDestination = offer.slices?.[offer.slices.length - 1]?.destination
        const destCityName = overallDestination?.city?.name || overallDestination?.city_name || overallDestination?.name
        const cityImage = getCityImageUrl(destCityName)

        return (
          <Card key={offer.id} className="glass-card hover-raise overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {airlineIata ? (
                  <Image
                    src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${airlineIata}.svg`}
                    width={56}
                    height={22}
                    alt={airlineName || airlineIata}
                  />
                ) : null}
                <div className="truncate text-sm text-gray-800 tracking-tight">
                  <span className="font-medium">{airlineName}</span>
                  {airlineIata && <span className="text-gray-500"> ({airlineIata})</span>}
                </div>
              </div>
              <div className="text-center text-gray-700 font-medium hidden sm:block">
                {overallOrigin} → {overallDestination?.iata_code}
              </div>
              <div className="text-right">
                <CardTitle className="text-3xl md:text-4xl font-semibold text-gray-900 leading-none">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
                </CardTitle>
                <div className="text-[11px] text-gray-500">Total</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Expires {new Date(offer.expires_at).toLocaleString()}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-[1fr_220px] items-stretch">
                {/* Left column: slices and segments */}
                <div>
                  {offer.slices.map((slice, idx) => (
                    <div key={slice.id} className="slice-summary py-2 first:pt-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-800">
                        <div className="font-medium tracking-tighter">Leg {idx + 1}: {slice.origin?.iata_code} → {slice.destination?.iata_code}</div>
                        <div className="text-gray-600">Duration: {slice.duration?.replace('PT', '').toLowerCase()}</div>
                      </div>

                      <div className="mt-2 space-y-2">
                        {slice.segments.map(seg => (
                          <div key={seg.id} className="segment">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {(seg.origin?.city?.name || seg.origin?.city_name || seg.origin?.name)} ({seg.origin?.iata_code}) → {(seg.destination?.city?.name || seg.destination?.city_name || seg.destination?.name)} ({seg.destination?.iata_code})
                                </div>
                                <div className="segment-meta text-[11px] text-gray-600">
                                  {/* Carrier: full name and flight number */}
                                  {(seg.airline?.name || seg.marketing_carrier?.name || '')} {seg.flight_number}
                                </div>
                              </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-gray-600 text-[11px]">
                              <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0 text-[10px]">Departs: {new Date(seg.departing_at).toLocaleString()}</span>
                              <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0 text-[10px]">Arrives: {new Date(seg.arriving_at).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right column: destination image */}
                <div className="md:pl-2">
                  <div className="relative w-full h-[160px] md:h-full min-h-[160px] rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={cityImage}
                      alt={destCityName || ''}
                      fill
                      sizes="(min-width: 768px) 220px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-1 text-center text-xs text-gray-600">{destCityName}</div>
                </div>
              </div>

              {/* Conditions */}
              {offer?.conditions && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  {offer.conditions.refund_before_departure && (
                    <span className={`dc-baggage-item ${offer.conditions.refund_before_departure.allowed ? '' : 'opacity-60'}`}>Refundable</span>
                  )}
                  {offer.conditions.change_before_departure && (
                    <span className={`dc-baggage-item ${offer.conditions.change_before_departure.allowed ? '' : 'opacity-60'}`}>Changeable</span>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-1">
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => onTrackPrice?.(offer.id)}>
                  Track price
                </Button>
                <Button className="w-full sm:w-auto" onClick={() => onSelectOffer?.(offer)}>
                  Book now
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
