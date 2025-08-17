'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  PlaneTakeoffIcon, 
  PlaneIcon, 
  ClockIcon, 
  MapPinIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'
import { formatDuration, formatTime, formatDate } from '@/lib/date-utils'

interface FlightCardProps {
  offer: {
    id: string
    total_amount: string
    total_currency: string
    expires_at: string
    slices: Array<{
      id: string
      origin: {
        iata_code: string
        name: string
        city_name?: string
      }
      destination: {
        iata_code: string
        name: string
        city_name?: string
      }
      duration: string
      segments: Array<{
        id: string
        origin: {
          iata_code: string
          name: string
        }
        destination: {
          iata_code: string
          name: string
        }
        departing_at: string
        arriving_at: string
        marketing_carrier?: {
          iata_code: string
          name: string
        }
        airline?: { name: string; logo_symbol_url?: string }
        flight_number: string
        aircraft?: {
          name: string
        }
      }>
    }>
    passengers: Array<{
      type: string
    }>
  }
  onSelect: (offerId: string) => void
}

export function FlightCard({ offer, onSelect }: FlightCardProps) {
  const formatPrice = (amount: string, currency: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStopCount = (segments: any[]) => {
    const stops = segments.length - 1
    if (stops === 0) return 'Direct'
    if (stops === 1) return '1 stop'
    return `${stops} stops`
  }

  const formatFlightDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return duration
    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const cityImageUrl = (city?: string) => {
    const q = encodeURIComponent(city || 'city skyline')
    // Unsplash source, already whitelisted
    return `https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=300&q=60&city=${q}`
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {offer.slices.map((slice, sliceIndex) => (
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
                    <div className="text-2xl font-bold text-gray-900">
                      {formatDateTime(slice.segments[0].departing_at).time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(slice.segments[0].departing_at).date}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {slice.origin.iata_code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {slice.origin.city_name || slice.origin.name}
                    </div>
                  </div>

                  {/* Flight Path */}
                  <div className="flex-1 px-4">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatFlightDuration(slice.duration)}
                      </div>
                      <div className="w-full h-px bg-gray-300 relative">
                        <PlaneIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 bg-white" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getStopCount(slice.segments)}
                      </div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatDateTime(slice.segments[slice.segments.length - 1].arriving_at).time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(slice.segments[slice.segments.length - 1].arriving_at).date}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {slice.destination.iata_code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {slice.destination.city_name || slice.destination.name}
                    </div>
                  </div>
                </div>

                {/* Airline logo for first segment */}
                {(() => {
                  const seg = slice.segments[0]
                  const name = seg.airline?.name || seg.marketing_carrier?.name
                  const logo = seg.airline?.logo_symbol_url
                  if (!name) return null
                  const src = logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
                  return (
                    <div className="ml-4 hidden md:flex items-center gap-3">
                      <Image src={src} alt={name} width={32} height={32} className="rounded-full" />
                      <div className="relative h-8 w-12 overflow-hidden rounded-md border border-gray-200">
                        <Image src={cityImageUrl(slice.destination.city_name)} alt={slice.destination.city_name || ''} fill sizes="48px" className="object-cover" />
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="flex flex-wrap gap-2">
                {slice.segments.map((segment) => (
                  <Badge key={segment.id} variant="outline" className="rounded-xl">
                    <span className="text-[11px]">
                      {(segment.marketing_carrier?.iata_code || "")} {segment.flight_number}
                      {segment.aircraft?.name && ` • ${segment.aircraft.name}`}
                    </span>
                  </Badge>
                ))}
              </div>

              {slice.segments.length > 1 && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Stops: </span>
                  {slice.segments.slice(0, -1).map((segment, idx) => (
                    <span key={idx}>
                      {segment.destination.iata_code}
                      {idx < slice.segments.length - 2 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">
                {offer.passengers.length} passenger{offer.passengers.length > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500">
                Expires: {new Date(offer.expires_at).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(offer.total_amount, offer.total_currency)}
                </div>
                <div className="text-xs text-gray-500">
                  Total for all passengers
                </div>
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
