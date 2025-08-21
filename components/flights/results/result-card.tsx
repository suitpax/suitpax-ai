"use client"

import CityImage from "@/components/flights/ui/city-image"
import CarrierLogo from "@/components/flights/ui/carrier-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlaneTakeoffIcon, PlaneIcon } from "@heroicons/react/24/outline"

interface FlightCardProps {
  offer: any
  onSelect: (offerId: string) => void
}

export default function FlightCard({ offer, onSelect }: FlightCardProps) {
  const firstSlice = offer.slices?.[0]
  const firstSeg = firstSlice?.segments?.[0]
  const airlineName = firstSeg?.airline?.name || firstSeg?.marketing_carrier?.name
  const airlineIata = firstSeg?.airline?.iata_code || firstSeg?.marketing_carrier?.iata_code
  const overallOrigin = offer.slices?.[0]?.origin?.iata_code
  const overallDestination = offer.slices?.[offer.slices.length - 1]?.destination
  const destCityName = overallDestination?.city?.name || overallDestination?.city_name || overallDestination?.name

  const manufacturerLogo = (aircraftName?: string) => {
    const name = (aircraftName || '').toLowerCase()
    if (name.includes('airbus')) return 'https://cdn.brandfetch.io/airbus.com/w/128/h/128/theme/dark/icon.png?c=1q2'
    if (name.includes('boeing')) return 'https://cdn.brandfetch.io/boeing.com/w/128/h/128/theme/dark/icon.png?c=1q2'
    return ''
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <CarrierLogo iata={airlineIata} name={airlineName} className="h-6 w-6" width={20} height={20} />
            <div className="truncate">
              <div className="leading-tight flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm md:text-base tracking-tight">{airlineName}</span>
                {airlineIata && (
                  <span className="inline-flex items-center rounded-md border border-gray-300 px-1.5 py-[2px] text-[10px] font-medium text-gray-700 bg-white">{airlineIata}</span>
                )}
                {firstSeg?.flight_number && <span className="text-gray-500 text-[11px]">{firstSeg.flight_number}</span>}
                {firstSeg?.airline?.conditions_of_carriage_url && (
                  <a href={firstSeg.airline.conditions_of_carriage_url} target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 underline hover:text-gray-700">conditions</a>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-gray-700 text-xs md:text-sm font-medium">
            {overallOrigin} → {overallDestination?.iata_code}
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-4xl font-bold text-gray-900 leading-none">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
            </div>
            <div className="text-[11px] text-gray-500">Total</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_220px] p-4">
          <div className="space-y-6">
            {offer.slices.map((slice: any, sliceIndex: number) => (
              <div key={slice.id} className="space-y-3">
                {offer.slices.length > 1 && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    {sliceIndex === 0 ? (
                      <PlaneTakeoffIcon className="h-4 w-4" />
                    ) : (
                      <PlaneIcon className="h-4 w-4 rotate-180" />
                    )}
                    <span className="font-medium">
                      {sliceIndex === 0 ? 'Outbound' : 'Return'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {slice.origin.iata_code}
                      </div>
                      <div className="text-xs text-gray-500">
                        {slice.origin.city?.name || slice.origin.city_name || slice.origin.name}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {slice.destination.iata_code}
                      </div>
                      <div className="text-xs text-gray-500">
                        {slice.destination.city?.name || slice.destination.city_name || slice.destination.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {slice.segments.map((segment: any) => {
                    const manuLogo = manufacturerLogo(segment.aircraft?.name)
                    return (
                      <Badge key={segment.id} variant="outline" className="rounded-xl flex items-center gap-2 border-gray-300">
                        {manuLogo && <img src={manuLogo} alt="manufacturer" className="h-3 w-3" />}
                        <span className="text-[11px]">
                          {(segment.airline?.name || segment.marketing_carrier?.name || '')} {segment.flight_number}
                          {segment.aircraft?.name && ` • ${segment.aircraft.name}`}
                        </span>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-end">
              <Button onClick={() => onSelect(offer.id)} className="h-10 rounded-2xl px-5 bg-black text-white hover:bg-gray-900 backdrop-blur-sm shadow-sm">
                Select Flight
              </Button>
            </div>
          </div>

          <div className="md:pl-1">
            <div className="relative w-full h-[160px] md:h-full min-h-[160px] rounded-xl overflow-hidden border border-gray-200">
              <CityImage city={destCityName} sizes="(min-width: 768px) 220px, 100vw" />
            </div>
            <div className="mt-1 text-center text-xs text-gray-600">{destCityName}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}