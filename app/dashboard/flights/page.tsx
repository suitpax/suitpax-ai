"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowsRightLeftIcon, FunnelIcon, CalendarIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import FlightResults from "@/components/flights/results/results-list"
import SampleDemoRoutes from "@/components/flights/sample-demo-routes"
import FlightFilters, { FlightFiltersDisplay } from "@/components/flights/flight-filters"
import { Checkbox } from "@/components/ui/checkbox"
import PlacesLookup from "@/components/places-lookup/places-lookup"
import FilterControls from "@/components/flights/results/filter-controls/filter-controls"
import AirlinesSlider from "@/components/flights/results/airlines-slider"
 

interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
  tripType: "one_way" | "round_trip" | "multi_city"
}

interface SavedSearchItem {
  id: string
  name: string
  created_at: string
  search_params: SearchParams
}

export default function FlightsPage() {
  const router = useRouter()

  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: "JFK",
    destination: "LHR",
    departureDate: new Date().toISOString().split("T")[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "one_way",
  })

  const [directOnly, setDirectOnly] = useState(false)
  const [multiCityLegs, setMultiCityLegs] = useState<Array<{ origin: string; destination: string; date: string }>>([
    { origin: "", destination: "", date: "" },
    { origin: "", destination: "", date: "" },
  ])

  const [offers, setOffers] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([])
  const [filters, setFilters] = useState({
    priceRange: [0, 5000] as [number, number],
    maxStops: 3,
    airlines: [] as string[],
    departureTime: [] as string[],
    arrivalTime: [] as string[],
    duration: [0, 1440] as [number, number],
    cabinClass: [] as string[],
    refundable: false,
    changeable: false,
    directOnly: false,
  })
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [density, setDensity] = useState<'compact' | 'cozy'>('cozy')
  const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
  const [pageMeta, setPageMeta] = useState<any>({})
  const [loadingMore, setLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'duration'>('recommended')

  // Handlers
  const saveSearch = useCallback(() => {
    const item: SavedSearchItem = {
      id: `${Date.now()}`,
      name: `${searchParams.origin} → ${searchParams.destination} ${searchParams.departureDate}`,
      created_at: new Date().toISOString(),
      search_params: searchParams,
    }
    setSavedSearches((prev) => [item, ...prev].slice(0, 25))
    toast.success('Search saved')
  }, [searchParams])

  const searchFlights = useCallback(async () => {
    setSearching(true)
    try {
      const body: any = {
        origin: (searchParams.origin || '').toUpperCase(),
        destination: (searchParams.destination || '').toUpperCase(),
        departure_date: searchParams.departureDate,
        passengers: { adults: Math.max(1, Number(searchParams.passengers || 1)) },
        cabin_class: searchParams.cabinClass || 'economy',
      }
      if (searchParams.tripType === 'round_trip' && searchParams.returnDate) {
        body.return_date = searchParams.returnDate
      }
      if (directOnly) body.max_connections = 0

      // Support multi-city if user filled legs
      const legs = multiCityLegs.filter((l) => l.origin && l.destination && l.date)
      if (searchParams.tripType === 'multi_city' && legs.length > 0) {
        body.slices = legs.map((l) => ({ origin: l.origin.toUpperCase(), destination: l.destination.toUpperCase(), departure_date: l.date }))
      }

      const res = await fetch('/api/flights/duffel/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const items = Array.isArray(json?.data) ? json.data : (json?.offers || json?.data?.offers || [])
      setOffers(items || [])
      setOfferRequestId(json?.offer_request_id || null)
      setPageMeta(json?.meta || {})
    } catch (err: any) {
      toast.error(err?.message || 'Error searching flights')
    } finally {
      setSearching(false)
    }
  }, [searchParams, directOnly, multiCityLegs])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center text-center gap-3">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter">Flights</h1>
          <p className="text-sm text-gray-600 mt-1">Find the best routes, fares and schedules — compare in seconds.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-2xl px-5 h-11 bg-white/80 text-gray-900 border border-gray-300 hover:bg-white backdrop-blur-sm shadow-sm" onClick={saveSearch}>Save search</Button>
          <Button className="rounded-2xl px-6 h-11 bg-black text-white hover:bg-gray-900 backdrop-blur-sm shadow-sm" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search'}</Button>
        </div>
      </div>

      

      {/* Sample demo routes (static randomized) */}
      <SampleDemoRoutes />

      {/* Controls row: sorting, filters, etc. */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Sorted by: {sortBy}</div>
        <div>
          <FilterControls onChange={(v) => {
            if (v?.sort) setSortBy(v.sort)
          }} />
        </div>
      </div>

      {/* Results list */}
      {offers.length > 0 && (
        <div className="mt-4">
          <FlightResults
            offers={offers as any}
            sort={sortBy}
            onSelectOffer={(offer) => router.push(`/dashboard/flights/book/${offer.id}`)}
          />
        </div>
      )}

      {/* Badges row under subtitle (show two) */}
      {/* ... existing code continues ... */}
    </div>
  )
}