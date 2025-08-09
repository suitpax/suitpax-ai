'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plane, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface FlightOffer {
  id: string
  total_amount: string
  total_currency: string
  primary_airline?: {
    name: string
    logo_lockup_url?: string
    logo_symbol_url?: string
    iata_code: string
  }
  slices: Array<{
    origin: {
      city: { name: string }
      iata_code: string
    }
    destination: {
      city: { name: string }
      iata_code: string
    }
    duration: string
    segments: Array<{
      departing_at: string
      arriving_at: string
      marketing_carrier: {
        name: string
        logo_lockup_url?: string
        logo_symbol_url?: string
        iata_code: string
      }
    }>
  }>
}

interface FlightCardProps {
  offer: FlightOffer
  onSelect: (offerId: string) => void
}

export function FlightCard({ offer, onSelect }: FlightCardProps) {
  const outboundSlice = offer.slices[0]
  const returnSlice = offer.slices[1]
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm')
  }
  
  const formatDuration = (duration: string) => {
    const matches = duration.match(/PT(?:(d+)H)?(?:(d+)M)?/)
    if (!matches) return duration
    
    const hours = matches[1] || '0'
    const minutes = matches[2] || '0'
    return `${hours}h ${minutes}m`
  }

  const AirlineLogo = ({ airline }: { airline: any }) => {
    if (airline?.logo_lockup_url) {
      return (
        <img 
          src={airline.logo_lockup_url} 
          alt={`${airline.name} logo`}
          className="h-8 w-auto object-contain"
          onError={(e) => {
            if (airline.logo_symbol_url) {
              e.currentTarget.src = airline.logo_symbol_url
            }
          }}
        />
      )
    }
    
    if (airline?.logo_symbol_url) {
      return (
        <img 
          src={airline.logo_symbol_url} 
          alt={`${airline.name} logo`}
          className="h-8 w-8 object-contain rounded"
        />
      )
    }
    
    return (
      <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
        <Plane className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AirlineLogo airline={offer.primary_airline} />
            <div>
              <p className="font-medium">{offer.primary_airline?.name || 'Unknown Airline'}</p>
              <p className="text-sm text-muted-foreground">
                {offer.primary_airline?.iata_code || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold">
              {offer.total_currency} {offer.total_amount}
            </p>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {outboundSlice.origin.city.name} ({outboundSlice.origin.iata_code})
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(outboundSlice.segments[0].departing_at)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center px-4">
              <Plane className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-1">
                {formatDuration(outboundSlice.duration)}
              </p>
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="min-w-0 text-right">
                <p className="font-medium truncate">
                  {outboundSlice.destination.city.name} ({outboundSlice.destination.iata_code})
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(outboundSlice.segments[outboundSlice.segments.length - 1].arriving_at)}
                </p>
              </div>
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>

          {returnSlice && (
            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {returnSlice.origin.city.name} ({returnSlice.origin.iata_code})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(returnSlice.segments[0].departing_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <Plane className="h-4 w-4 text-muted-foreground rotate-180" />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDuration(returnSlice.duration)}
                </p>
              </div>

              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="min-w-0 text-right">
                  <p className="font-medium truncate">
                    {returnSlice.destination.city.name} ({returnSlice.destination.iata_code})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(returnSlice.segments[returnSlice.segments.length - 1].arriving_at)}
                  </p>
                </div>
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          )}

          {outboundSlice.segments.length > 1 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {outboundSlice.segments.length - 1} stop{outboundSlice.segments.length > 2 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button 
            onClick={() => onSelect(offer.id)}
            className="w-full"
          >
            Select Flight
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
