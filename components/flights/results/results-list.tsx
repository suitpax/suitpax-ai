"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CarrierLogo from "@/components/flights/ui/carrier-logo"
import CityImage from "@/components/flights/ui/city-image"
import LegSummary from "@/components/flights/ui/leg-summary"
import SegmentMeta from "@/components/flights/ui/segment-meta"
import { formatDurationISO } from "./lib"

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
  sort?: 'recommended' | 'price' | 'duration'
}

function toMinutes(isoDuration?: string): number {
  if (!isoDuration) return Number.MAX_SAFE_INTEGER
  // Minimal ISO8601 PT#H#M parser
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?/i.exec(isoDuration)
  const hours = match?.[1] ? parseInt(match[1], 10) : 0
  const mins = match?.[2] ? parseInt(match[2], 10) : 0
  return hours * 60 + mins
}

function sortOffers(offers: FlightOffer[], sort?: 'recommended' | 'price' | 'duration'): FlightOffer[] {
  const list = [...offers]
  if (sort === 'price') {
    return list.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount))
  }
  if (sort === 'duration') {
    const totalDur = (o: FlightOffer) => (o.slices || []).reduce((sum, s) => sum + toMinutes(s.duration), 0)
    return list.sort((a, b) => totalDur(a) - totalDur(b))
  }
  // recommended: simple composite (price + penalty per stop)
  const score = (o: FlightOffer) => {
    const price = parseFloat(o.total_amount)
    const stops = (o.slices?.[0]?.segments?.length || 1) - 1
    return price + stops * 50
  }
  return list.sort((a, b) => score(a) - score(b))
}

export default function FlightResults({ offers, onSelectOffer, onTrackPrice, className = "", sort = 'recommended' }: Props) {
  if (!offers || offers.length === 0) {
    return <div className="rounded-3xl border border-gray-200 glass-card p-6 text-gray-600">No flights available for these criteria.</div>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {sortOffers(offers, sort).map((offer) => {
        const firstSlice = offer.slices?.[0]
        const firstSeg = firstSlice?.segments?.[0]
        const airlineName = firstSeg?.airline?.name || firstSeg?.marketing_carrier?.name || ""
        const airlineIata = firstSeg?.airline?.iata_code || firstSeg?.marketing_carrier?.iata_code || ""
        const overallOrigin = offer.slices?.[0]?.origin?.iata_code
        const overallDestination = offer.slices?.[offer.slices.length - 1]?.destination
        const destCityName = overallDestination?.city?.name || overallDestination?.city_name || overallDestination?.name

        return (
          <Card key={offer.id} className="glass-card hover-raise overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CarrierLogo iata={airlineIata} name={airlineName} lockup width={72} height={20} className="h-5 w-auto" />
                <div className="truncate text-sm text-gray-800 tracking-tight flex items-center gap-1">
                  <span className="font-medium">{airlineName}</span>
                  {airlineIata && (
                    <>
                      <span className="text-gray-500">({airlineIata})</span>
                      <CarrierLogo iata={airlineIata} name={airlineName} width={14} height={14} className="inline-block align-middle" />
                    </>
                  )}
                </div>
              </div>
              <div className="text-center text-gray-700 font-medium hidden sm:block">
                {overallOrigin} → {overallDestination?.iata_code}
              </div>
              <div className="text-right">
                <CardTitle className="text-3xl md:text-4xl font-semibold text-gray-900 leading-none">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
                </CardTitle>
                <div className="text-[11px] text-gray-500">Total</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Expires {new Date(offer.expires_at).toLocaleString()}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-[1fr_220px] items-stretch">
                <div>
                  {offer.slices.map((slice, idx) => (
                    <div key={slice.id} className="slice-summary py-2 first:pt-0 last:pb-0">
                      <LegSummary index={idx + 1} origin={slice.origin?.iata_code} destination={slice.destination?.iata_code} duration={formatDurationISO(slice.duration)} />

                      <div className="mt-2 space-y-2">
                        {slice.segments.map((seg) => (
                          <div key={seg.id} className="segment">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {(seg.origin?.city?.name || seg.origin?.city_name || seg.origin?.name)} ({seg.origin?.iata_code}) → {(seg.destination?.city?.name || seg.destination?.city_name || seg.destination?.name)} ({seg.destination?.iata_code})
                                </div>
                                <SegmentMeta
                                  airlineName={(seg.airline?.name || seg.marketing_carrier?.name || "")}
                                  flightNumber={seg.flight_number}
                                  departAt={new Date(seg.departing_at).toLocaleString()}
                                  arriveAt={new Date(seg.arriving_at).toLocaleString()}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:pl-2">
                  <div className="relative w-full h-[160px] md:h-full min-h-[160px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <CityImage city={destCityName || (overallDestination?.name as any)} sizes="(min-width: 768px) 220px, 100vw" />
                  </div>
                  <div className="mt-1 text-center text-xs text-gray-600">{destCityName}</div>
                </div>
              </div>

              {offer?.conditions && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  {offer.conditions.refund_before_departure && (
                    <span className={`dc-baggage-item ${offer.conditions.refund_before_departure.allowed ? "" : "opacity-60"}`}>Refundable</span>
                  )}
                  {offer.conditions.change_before_departure && (
                    <span className={`dc-baggage-item ${offer.conditions.change_before_departure.allowed ? "" : "opacity-60"}`}>Changeable</span>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-1">
                <Button variant="secondary" className="w-full sm:w-auto h-10 rounded-2xl px-5 bg-white/80 text-gray-900 border border-gray-300 hover:bg-white backdrop-blur-sm shadow-sm" onClick={() => onTrackPrice?.(offer.id)}>
                  Track price
                </Button>
                <Button className="w-full sm:w-auto h-10 rounded-2xl px-5 bg-black text-white hover:bg-gray-900 backdrop-blur-sm shadow-sm" onClick={() => onSelectOffer?.(offer)}>
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

