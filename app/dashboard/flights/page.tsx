"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlightSearchForm } from "@/components/flights/flight-search-form"
import { PlaneIcon, ClockIcon, UsersIcon } from "lucide-react"
import { formatPrice, formatDuration, getStopDescription } from "@/lib/duffel/utils"
import type { DuffelOffer } from "@/lib/duffel/client"
import { SearchResultsLoading } from "@/components/flights/flight-result-skeleton"

export default function FlightsPage() {
  const [searchResults, setSearchResults] = useState<DuffelOffer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<DuffelOffer | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearchResults = (results: DuffelOffer[]) => {
    setSearchResults(results)
    setShowResults(true)
    setIsLoading(false)
  }

  const handleSelectOffer = (offer: DuffelOffer) => {
    setSelectedOffer(offer)
    // Navigate to booking flow
    window.location.href = `/dashboard/flights/book/${offer.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-2">
            Business Flights
          </h1>
          <p className="text-lg font-light text-gray-600">
            Search and book flights for your business travel with enterprise-grade tools
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <FlightSearchForm onResults={handleSearchResults} />
        </div>

        {/* Loading Skeleton */}
        {isLoading && <SearchResultsLoading />}

        {/* Search Results */}
        {showResults && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tighter">Flight Results ({searchResults.length})</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-gray-200 text-gray-700">
                  Best Price
                </Badge>
                <Badge variant="outline" className="bg-gray-200 text-gray-700">
                  Fastest
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {searchResults.length === 0 ? (
                <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
                  <CardContent className="p-12 text-center">
                    <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium tracking-tighter mb-2">No flights found</h3>
                    <p className="text-gray-600 font-light">Try adjusting your search criteria or dates</p>
                  </CardContent>
                </Card>
              ) : (
                searchResults.map((offer) => (
                  <FlightOfferCard key={offer.id} offer={offer} onSelect={() => handleSelectOffer(offer)} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showResults && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-tighter">
                  <PlaneIcon className="h-5 w-5 text-gray-700" />
                  Smart Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-gray-600">
                  AI-powered flight search finds the best options for your business travel needs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-tighter">
                  <UsersIcon className="h-5 w-5 text-gray-700" />
                  Team Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-gray-600">
                  Book flights for multiple team members with centralized billing and management
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-tighter">
                  <ClockIcon className="h-5 w-5 text-gray-700" />
                  Real-time Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-gray-600">
                  Get instant notifications about flight changes, delays, and gate updates
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

interface FlightOfferCardProps {
  offer: DuffelOffer
  onSelect: () => void
}

function FlightOfferCard({ offer, onSelect }: FlightOfferCardProps) {
  const outboundSlice = offer.slices[0]
  const returnSlice = offer.slices[1]
  const stopCount = Math.max(...offer.slices.map((slice) => slice.segments.length - 1))

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-4">
            {/* Outbound Flight */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-medium tracking-tighter">
                  {new Date(outboundSlice.segments[0].departing_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </div>
                <div className="text-xs font-medium text-gray-600">{outboundSlice.origin.iata_code}</div>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">{formatDuration(outboundSlice.duration)}</div>
                  <div className="text-xs text-gray-500">{getStopDescription(outboundSlice.segments.length - 1)}</div>
                </div>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <div className="text-center">
                <div className="text-lg font-medium tracking-tighter">
                  {new Date(outboundSlice.segments[outboundSlice.segments.length - 1].arriving_at).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    },
                  )}
                </div>
                <div className="text-xs font-medium text-gray-600">{outboundSlice.destination.iata_code}</div>
              </div>
            </div>

            {/* Return Flight */}
            {returnSlice && (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-medium tracking-tighter">
                    {new Date(returnSlice.segments[0].departing_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </div>
                  <div className="text-xs font-medium text-gray-600">{returnSlice.origin.iata_code}</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-600">{formatDuration(returnSlice.duration)}</div>
                    <div className="text-xs text-gray-500">{getStopDescription(returnSlice.segments.length - 1)}</div>
                  </div>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-medium tracking-tighter">
                    {new Date(returnSlice.segments[returnSlice.segments.length - 1].arriving_at).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      },
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-600">{returnSlice.destination.iata_code}</div>
                </div>
              </div>
            )}

            {/* Flight Details */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="font-medium">{outboundSlice.segments[0].marketing_carrier?.name || "Airline"}</span>
              {stopCount > 0 && (
                <Badge variant="outline" className="bg-gray-200 text-gray-700 text-[10px]">
                  {getStopDescription(stopCount)}
                </Badge>
              )}
            </div>
          </div>

          {/* Price and Book Button */}
          <div className="text-right space-y-2">
            <div className="text-2xl font-medium tracking-tighter">
              {formatPrice(offer.total_amount, offer.total_currency)}
            </div>
            <div className="text-xs text-gray-600 font-light">per person</div>
            <Button onClick={onSelect} className="w-full bg-black text-white hover:bg-gray-800">
              Select Flight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
