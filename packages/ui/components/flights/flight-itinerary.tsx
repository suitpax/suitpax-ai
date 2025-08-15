"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Clock, ArrowRight } from 'lucide-react'

interface Segment {
  origin: { iata_code: string; city_name: string; name: string }
  destination: { iata_code: string; city_name: string; name: string }
  departing_at: string
  arriving_at: string
  airline?: { name: string; logo_symbol_url?: string; logo_lockup_url?: string }
  marketing_carrier?: { name: string; iata_code?: string }
  flight_number: string
}

interface Slice {
  segments: Segment[]
  duration: string
}

interface FlightItineraryProps {
  slices: Slice[]
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const formatDuration = (duration: string) => {
  return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')
}

export default function FlightItinerary({ slices }: FlightItineraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Flight Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {slices.map((slice, index) => (
          <div key={index}>
            <h3 className="font-medium mb-2 text-lg">{index === 0 ? 'Outbound' : 'Return'}</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              {slice.segments.map((segment, segIndex) => (
                <div key={segIndex} className="flex items-center gap-4">
                  {(() => {
                    const name = segment.airline?.name || segment.marketing_carrier?.name || 'Airline'
                    const logo = segment.airline?.logo_symbol_url
                    const src = logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
                    return <img src={src} alt={name} className="h-8 w-8 rounded-full" />
                  })()}
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{segment.origin.iata_code} <ArrowRight className="inline h-4 w-4" /> {segment.destination.iata_code}</p>
                        <p className="text-sm text-gray-500">{segment.airline?.name || segment.marketing_carrier?.name} • {segment.flight_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDateTime(segment.departing_at)}</p>
                        <p className="text-sm text-gray-500">to {formatDateTime(segment.arriving_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-right text-sm text-gray-600 flex items-center justify-end gap-2">
                <Clock className="h-4 w-4" />
                Total duration: {formatDuration(slice.duration)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
