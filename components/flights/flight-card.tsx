'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  PlaneTakeoffIcon, 
  PlaneIcon, 
} from '@heroicons/react/24/outline'

interface FlightCardProps {
  offer: any
  onSelect: (offerId: string) => void
}

const CITY_KEYWORDS: Record<string, string> = {
  london: 'London Big Ben skyline',
  roma: 'Rome Colosseum skyline',
  rome: 'Rome Colosseum skyline',
  paris: 'Paris Eiffel Tower skyline',
  barcelona: 'Barcelona Sagrada Familia skyline',
  madrid: 'Madrid Cibeles skyline',
  berlin: 'Berlin Brandenburg Gate skyline',
  amsterdam: 'Amsterdam canals skyline',
}

const cityImageUrl = (city?: string, w = 640, h = 360) => {
  const key = (city || '').toLowerCase().trim()
  const q = CITY_KEYWORDS[key] || `${city || 'city'} skyline`
  return `https://source.unsplash.com/featured/${w}x${h}/?${encodeURIComponent(q)}`
}

export function FlightCard({ offer, onSelect }: FlightCardProps) {
  // Aerolínea principal y destino global
  const firstSlice = offer.slices?.[0]
  const firstSeg = firstSlice?.segments?.[0]
  const airlineName = firstSeg?.airline?.name || firstSeg?.marketing_carrier?.name
  const airlineIata = firstSeg?.airline?.iata_code || firstSeg?.marketing_carrier?.iata_code
  const overallOrigin = offer.slices?.[0]?.origin?.iata_code
  const overallDestination = offer.slices?.[offer.slices.length - 1]?.destination
  const destCityName = overallDestination?.city?.name || overallDestination?.city_name || overallDestination?.name
  const cityThumb = cityImageUrl(destCityName)

  const manufacturerLogo = (aircraftName?: string) => {
    const name = (aircraftName || '').toLowerCase()
    if (name.includes('airbus')) return 'https://cdn.brandfetch.io/airbus.com/w/128/h/128/theme/dark/icon.png?c=1q2'
    if (name.includes('boeing')) return 'https://cdn.brandfetch.io/boeing.com/w/128/h/128/theme/dark/icon.png?c=1q2'
    return ''
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header compacto */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            {airlineIata && (
              <Image
                src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${airlineIata}.svg`}
                width={56}
                height={22}
                alt={airlineName || airlineIata}
              />
            )}
            <div className="truncate text-sm text-gray-800">
              <span className="font-medium">{airlineName}</span>
              {airlineIata && <span className="text-gray-500"> ({airlineIata})</span>}
            </div>
          </div>
          <div className="hidden sm:block text-gray-700 text-sm font-medium">
            {overallOrigin} → {overallDestination?.iata_code}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 leading-none">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
            </div>
            <div className="text-[11px] text-gray-500">Total</div>
          </div>
        </div>

        {/* Body con grid: info + imagen ciudad */}
        <div className="grid gap-4 md:grid-cols-[1fr_220px] p-4">
          <div className="space-y-6">
            {offer.slices.map((slice: any, sliceIndex: number) => (
              <div key={slice.id} className="space-y-3">
                {offer.slices.length > 1 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    {/* Origin */}
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {slice.origin.iata_code}
                      </div>
                      <div className="text-xs text-gray-500">
                        {slice.origin.city?.name || slice.origin.city_name || slice.origin.name}
                      </div>
                    </div>

                    {/* Destination */}
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

                {/* Segment badges sin logos duplicados */}
                <div className="flex flex-wrap gap-2">
                  {slice.segments.map((segment: any) => {
                    const manuLogo = manufacturerLogo(segment.aircraft?.name)
                    return (
                      <Badge key={segment.id} variant="compact" className="rounded-xl flex items-center gap-2">
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

            {/* CTA */}
            <div className="flex items-center justify-end">
              <Button onClick={() => onSelect(offer.id)} className="bg-black text-white hover:bg-gray-800">
                Select Flight
              </Button>
            </div>
          </div>

          {/* Imagen única de la ciudad de destino */}
          <div className="md:pl-1">
            <div className="relative w-full h-[160px] md:h-full min-h-[160px] rounded-xl overflow-hidden border border-gray-200">
              <Image src={cityThumb} alt={destCityName || ''} fill sizes="(min-width: 768px) 220px, 100vw" className="object-cover" />
            </div>
            <div className="mt-1 text-center text-xs text-gray-600">{destCityName}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
