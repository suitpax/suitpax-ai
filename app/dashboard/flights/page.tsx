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
import { PromptInput } from "@/components/prompt-kit/prompt-input"

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
  const [promptValue, setPromptValue] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [density, setDensity] = useState<'compact' | 'cozy'>('cozy')
  const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
  const [pageMeta, setPageMeta] = useState<any>({})
  const [loadingMore, setLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'duration'>('recommended')

  // ... existing code ...

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

      {/* AI prompt with video placeholder */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-gray-200">
              <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center">
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4" type="video/mp4" />
              </video>
            </div>
            <input
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Ask Suitpax AI to plan your next flight (e.g., MAD → LHR Friday)"
              className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none h-8"
            />
            <button
              className="h-9 w-9 rounded-xl bg-black text-white hover:bg-black/90 flex items-center justify-center"
              onClick={() => {
                const q = (promptValue || '').trim() || 'MAD to LHR Friday morning, return Sunday'
                window.location.href = `/dashboard/suitpax-ai?query=${encodeURIComponent(q)}`
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sample demo routes (real Duffel when available; always 3) */}
      <SampleDemoRoutes seedQuery={promptValue} />

      {/* Controls row: sorting, filters, etc. */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Sorted by: {sortBy}</div>
        <div>
          <FilterControls onChange={(v) => {
            if (v?.sort) setSortBy(v.sort)
          }} />
        </div>
      </div>

      {/* Results list sample — pass sortBy if offers are present in your state */}
      {/* Example usage: <FlightResults offers={offers} sort={sortBy} onSelectOffer={...} /> */}

      {/* Badges row under subtitle (show two) */}
      {/* ... existing code continues ... */}
    </div>
  )
}