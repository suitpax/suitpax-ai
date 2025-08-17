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

export function FlightCard({ offer, onSelect }: FlightCardProps) {
  const cityImageUrl = (city?: string) => {
    const q = encodeURIComponent(city || 'city skyline')
    return `https://source.unsplash.com/featured/300x200/?${q}`
  }

  const manufacturerLogo = (aircraftName?: string) => {
    const name = (aircraftName || '').toLowerCase()
    if (name.includes('airbus')) return 'https://cdn.brandfetch.io/airbus.com/w/128/h/128/theme/dark/icon.png?c=1q2'
    if (name.includes('boeing')) return 'https://cdn.brandfetch.io/boeing.com/w/128/h/128/theme/dark/icon.png?c=1q2'
    return ''
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-2xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          {offer.slices.map((slice: any, sliceIndex: number) => (
            <div key={slice.id} className="space-y-4">
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

                {/* Airline logo and city thumbnail */}
                {(() => {
                  const seg = slice.segments[0]
                  const name = seg.airline?.name || seg.marketing_carrier?.name
                  const iata = seg.airline?.iata_code || seg.marketing_carrier?.iata_code
                  const logo = seg.airline?.logo_lockup_url || seg.airline?.logo_symbol_url
                  const conditions = seg.airline?.conditions_of_carriage_url
                  if (!name) return null
                  const cityThumb = cityImageUrl(slice.destination.city_name)
                  return (
                    <div className="ml-4 hidden md:flex items-center gap-3">
                      {logo && <Image src={logo} alt={name} width={80} height={16} className="object-contain" />}
                      <div className="relative h-10 w-16 overflow-hidden rounded-md border border-gray-200">
                        <Image src={cityThumb} alt={slice.destination.city_name || ''} fill sizes="64px" className="object-cover" />
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Segment badges including aircraft logos */}
              <div className="flex flex-wrap gap-2">
                {slice.segments.map((segment: any) => {
                  const manuLogo = manufacturerLogo(segment.aircraft?.name)
                  return (
                    <Badge key={segment.id} variant="outline" className="rounded-xl flex items-center gap-2">
                      {manuLogo && <img src={manuLogo} alt="manufacturer" className="h-3 w-3" />}
                      <span className="text-[11px]">
                        {(segment.marketing_carrier?.iata_code || '')} {segment.flight_number}
                        {segment.aircraft?.name && ` • ${segment.aircraft.name}`}
                      </span>
                    </Badge>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">
                {offer.passengers.length} passenger{offer.passengers.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <Button onClick={() => onSelect(offer.id)} className="bg-black text-white hover:bg-gray-800">
                Select Flight
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
