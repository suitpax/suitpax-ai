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
import dynamic from "next/dynamic"
const FlightResults = dynamic(() => import("@/components/flights/results/results-list"), { ssr: false })
const FlightFilters = dynamic(() => import("@/components/flights/flight-filters"), { ssr: false })
const FlightFiltersDisplay = dynamic(() => import("@/components/flights/flight-filters").then(m => m.FlightFiltersDisplay), { ssr: false })
import { Checkbox } from "@/components/ui/checkbox"
import PlacesLookup from "@/components/places-lookup/places-lookup"
const FilterControls = dynamic(() => import("@/components/flights/results/filter-controls/filter-controls"), { ssr: false })
const AirlinesSlider = dynamic(() => import("@/components/flights/results/airlines-slider"), { ssr: false })
import GlobalPromptInput from "@/components/dashboard/global-prompt-input"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import FlightsSearchOverlay from "@/components/ui/flights-search-overlay"

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
  const [aiQuery, setAiQuery] = useState("")

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

  // Load saved searches
  useEffect(() => {
    try { const raw = localStorage.getItem("suitpax_saved_searches"); if (raw) setSavedSearches(JSON.parse(raw)) } catch {}
  }, [])
  const persistSavedSearches = (next: SavedSearchItem[]) => {
    setSavedSearches(next)
    try { localStorage.setItem("suitpax_saved_searches", JSON.stringify(next)) } catch {}
  }
  const saveSearch = () => {
    const item: SavedSearchItem = {
      id: `${Date.now()}`,
      name: `${searchParams.origin} → ${searchParams.destination}`,
      created_at: new Date().toISOString(),
      search_params: searchParams,
    }
    const next = [item, ...savedSearches].slice(0, 6)
    persistSavedSearches(next)
    toast.success("Search saved")
  }
  const loadSavedSearch = (item: SavedSearchItem) => {
    setSearchParams(item.search_params)
    toast("Loaded saved search")
  }

  // Persist filters
  useEffect(() => { try { localStorage.setItem('suitpax_flight_filters', JSON.stringify(filters)) } catch {} }, [filters])
  useEffect(() => { try { const raw = localStorage.getItem('suitpax_flight_filters'); if (raw) setFilters(JSON.parse(raw)) } catch {} }, [])

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; value: string }[] = []
    if (filters.directOnly) chips.push({ id: 'directOnly', label: 'Stops', value: 'Direct only' })
    if (filters.maxStops < 3 && !filters.directOnly) chips.push({ id: 'maxStops', label: 'Stops', value: `${filters.maxStops} max` })
    if (filters.airlines.length > 0) chips.push({ id: 'airlines', label: 'Airlines', value: filters.airlines.join(', ') })
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) chips.push({ id: 'price', label: 'Price', value: `${filters.priceRange[0]}-${filters.priceRange[1]}` })
    if (filters.departureTime.length > 0) chips.push({ id: 'dep', label: 'Departure', value: `${filters.departureTime.length} selected` })
    if (filters.refundable) chips.push({ id: 'ref', label: 'Refundable', value: 'Yes' })
    if (filters.changeable) chips.push({ id: 'chg', label: 'Changeable', value: 'Yes' })
    return chips
  }, [filters])

  const removeChip = (id: string) => {
    setFilters(prev => {
      const next = { ...prev }
      switch (id) {
        case 'directOnly': next.directOnly = false; break
        case 'maxStops': next.maxStops = 3; break
        case 'airlines': next.airlines = []; break
        case 'price': next.priceRange = [0, 5000]; break
        case 'dep': next.departureTime = []; break
        case 'ref': next.refundable = false; break
        case 'chg': next.changeable = false; break
      }
      return next
    })
  }

  const swapLocations = () => {
    setSearchParams(prev => ({ ...prev, origin: prev.destination, destination: prev.origin }))
  }

  const searchFlights = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      if (searchParams.tripType !== 'multi_city') {
        toast.error("Please fill in origin, destination and date")
        return
      }
    }
    if (searchParams.tripType === "round_trip" && !searchParams.returnDate) {
      toast.error("Please add a return date")
      return
    }

    setSearching(true)
    setOffers([])
    setOfferRequestId(null)
    setPageMeta({})
    try {
      const payload: any = { passengers: { adults: searchParams.passengers }, cabin_class: searchParams.cabinClass }
      if (directOnly) payload.max_connections = 0
      if (searchParams.tripType === 'multi_city') {
        const legs = multiCityLegs.filter(l => l.origin && l.destination && l.date)
        if (legs.length < 2) throw new Error('Please add at least 2 valid legs')
        payload.slices = legs.map(l => ({ origin: l.origin.toUpperCase(), destination: l.destination.toUpperCase(), departure_date: l.date }))
      } else {
        payload.origin = searchParams.origin.toUpperCase()
        payload.destination = searchParams.destination.toUpperCase()
        payload.departure_date = searchParams.departureDate
        if (searchParams.tripType === 'round_trip' && searchParams.returnDate) payload.return_date = searchParams.returnDate
      }

      const res = await fetch('/api/flights/duffel/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      let json: any = null
      try { json = await res.json() } catch {}
      if (!res.ok) throw new Error(json?.error || 'Search failed')
      const results = Array.isArray(json?.data) ? json.data : json?.offers || []
      setOffers(results)
      setOfferRequestId(json?.offer_request_id || null)
      setPageMeta(json?.meta || {})
      toast.success(`Found ${results.length} flights`)
    } catch (e: any) {
      console.error('search error', e)
      toast.error(e?.message || 'Error searching flights')
    } finally {
      setSearching(false)
    }
  }

  const loadMore = async () => {
    if (!offerRequestId || !pageMeta?.after) return
    setLoadingMore(true)
    try {
      const url = new URL('/api/flights/duffel/offers', window.location.origin)
      url.searchParams.set('offer_request_id', offerRequestId)
      url.searchParams.set('after', pageMeta.after)
      url.searchParams.set('limit', '20')
      const res = await fetch(url.toString())
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to load more')
      const more = Array.isArray(json?.data) ? json.data : []
      setOffers(prev => [...prev, ...more])
      setPageMeta(json?.meta || {})
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load more')
    } finally {
      setLoadingMore(false)
    }
  }

  const applyFilters = useCallback((offersToFilter: any[]) => {
    let filtered = [...offersToFilter]

    const timeStringToMinutes = (t?: string) => {
      if (!t) return null
      const [h, m] = t.split(":").map(Number)
      if (Number.isNaN(h) || Number.isNaN(m)) return null
      return h * 60 + m
    }

    // Price
    filtered = filtered.filter(offer => {
      const price = parseFloat(offer.total_amount)
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Airlines
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(offer => {
        const seg = offer.slices?.[0]?.segments?.[0]
        const code = seg?.airline?.iata_code || seg?.marketing_carrier?.iata_code
        return code && filters.airlines.includes(code)
      })
    }

    // Stops (inline)
    const selectedStops: number[] = Array.isArray((filters as any).stops) ? (filters as any).stops : []
    if (selectedStops.length > 0) {
      filtered = filtered.filter(offer => {
        const numStops = ((offer.slices?.[0]?.segments?.length || 1) - 1)
        return selectedStops.includes(numStops)
      })
    } else if (filters.directOnly) {
      filtered = filtered.filter(offer => (offer.slices?.[0]?.segments?.length || 1) - 1 === 0)
    } else if (filters.maxStops < 3) {
      filtered = filtered.filter(offer => (offer.slices?.[0]?.segments?.length || 1) - 1 <= filters.maxStops)
    }

    // Departure time (inline)
    const departs = (filters as any).departs as { from?: string; to?: string } | undefined
    if (departs?.from && departs?.to) {
      const fromMin = timeStringToMinutes(departs.from)
      const toMin = timeStringToMinutes(departs.to)
      if (fromMin !== null && toMin !== null) {
        filtered = filtered.filter(offer => {
          const dt = new Date(offer.slices?.[0]?.segments?.[0]?.departing_at)
          const mins = dt.getHours() * 60 + dt.getMinutes()
          if (fromMin <= toMin) return mins >= fromMin && mins <= toMin
          return mins >= fromMin || mins <= toMin
        })
      }
    }

    // Refundable / Changeable flags
    if (filters.refundable) {
      filtered = filtered.filter((o: any) => o.conditions?.refund_before_departure?.allowed === true)
    }
    if (filters.changeable) {
      filtered = filtered.filter((o: any) => o.conditions?.change_before_departure?.allowed === true)
    }

    return filtered
  }, [filters])

  const filteredOffers = useMemo(() => {
    const list = applyFilters(offers)
    const sortKey = (filters as any).sort as 'recommended' | 'price' | 'duration' | undefined
    if (!sortKey) return list
    const toMinutes = (iso?: string) => {
      if (!iso) return Number.POSITIVE_INFINITY
      const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
      if (!m) return Number.POSITIVE_INFINITY
      const h = m[1] ? parseInt(m[1], 10) : 0
      const mins = m[2] ? parseInt(m[2], 10) : 0
      return h * 60 + mins
    }
    const copy = [...list]
    if (sortKey === 'price' || sortKey === 'recommended') {
      copy.sort((a: any, b: any) => parseFloat(a.total_amount) - parseFloat(b.total_amount))
    } else if (sortKey === 'duration') {
      copy.sort((a: any, b: any) => {
        const ad = (a.slices || []).reduce((sum: number, s: any) => sum + toMinutes(s.duration), 0)
        const bd = (b.slices || []).reduce((sum: number, s: any) => sum + toMinutes(s.duration), 0)
        return ad - bd
      })
    }
    return copy
  }, [offers, applyFilters, filters])

  // Airline options for inline selector
  const airlineOptions = useMemo(() => {
    return Array.from(new Set(offers.map(o => {
      const seg = o?.slices?.[0]?.segments?.[0]
      const code = seg?.airline?.iata_code || seg?.marketing_carrier?.iata_code
      const name = seg?.airline?.name || seg?.marketing_carrier?.name
      return code ? `${code}|${name || code}` : ''
    }).filter(Boolean))).map(s => ({ code: s.split('|')[0], name: s.split('|')[1] }))
  }, [offers])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center text-center gap-3">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter">Flights</h1>
          <p className="text-sm text-gray-600 mt-1">Find the best routes, fares and schedules — compare in seconds.</p>
        </div>
        <div className="flex flex-col w-full max-w-sm md:max-w-none md:flex-row items-stretch md:items-center gap-2">
          <Button className="w-full md:w-auto rounded-full md:rounded-2xl px-6 h-10 bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-700 backdrop-blur-sm shadow-sm" onClick={() => router.push('/dashboard/suitpax-ai?tab=chat')}>Ask Suitpax AI</Button>
          <Button id="primary-search-btn" className="w-full md:w-auto rounded-full md:rounded-2xl px-8 h-10 bg-black text-white hover:bg-gray-900 backdrop-blur-sm shadow-sm" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search flights'}</Button>
        </div>
      </div>

      {/* AI prompt (reused global input) */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <GlobalPromptInput placeholder="Ask Suitpax AI to plan your next flight (e.g., MAD → LHR Friday)" onSubmitNavigate={(v) => {
            window.location.href = `/dashboard/ai-center?tab=chat&prompt=${encodeURIComponent(v)}`
          }} />
        </div>
      </div>

      {/* Airlines slider just under prompt */}
      <div className="mt-4 flex justify-center">
        <div className="w-full max-w-4xl">
          <AirlinesSlider />
        </div>
      </div>

      {/* Badges row under subtitle (show two) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          'AI-optimized results',
          'Real seat maps',
        ].map((b) => (
          <span key={b} className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-gray-300 bg-white/70 text-gray-800">{b}</span>
        ))}
      </div>

      {/* Shimmer headline variation */}
      <div className="flex justify-center">
        <div className="mt-2 text-center text-sm font-medium bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent animate-hero-shimmer">
          {[
            'Search flights with Suitpax AI',
            'Plan your next business trip in seconds',
            'Ask for the best fares today',
            'Track prices and rebook instantly',
            'Save time with one-click booking',
          ].sort(() => 0.5 - Math.random())[0]}
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        :global(.animate-hero-shimmer) { animation: shimmer 2.5s linear infinite; background-size: 200% 100%; }
      `}</style>

      {/* Search Card */}
      <Card className="border-gray-200 glass-card">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base">Trip details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 relative">
            {/* Origin */}
            <div className="relative">
              <Label className="text-sm text-gray-700">Origin</Label>
              <PlacesLookup value={searchParams.origin} onSelect={(item: any) => setSearchParams(prev => ({ ...prev, origin: (item?.iata_code || '').toUpperCase() }))} placeholder="JFK" />
            </div>

            {/* Swap */}
            <div className="hidden md:flex items-end justify-center">
              <Button type="button" variant="secondary" className="h-11 w-11 p-0 rounded-full border-gray-300 bg-white/80 text-gray-900 hover:bg-white backdrop-blur-sm shadow-sm" onClick={swapLocations} title="Swap">
                <ArrowsRightLeftIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination */}
            <div className="relative">
              <Label className="text-sm text-gray-700">Destination</Label>
              <PlacesLookup value={searchParams.destination} onSelect={(item: any) => setSearchParams(prev => ({ ...prev, destination: (item?.iata_code || '').toUpperCase() }))} placeholder="LHR" />
            </div>

            {/* Trip type */}
            <div>
              <Label className="text-sm text-gray-700">Trip</Label>
              <Select value={searchParams.tripType} onValueChange={v => setSearchParams(prev => ({ ...prev, tripType: v as any }))}>
                <SelectTrigger className="bg-white text-gray-900 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  <SelectItem value="one_way">One way</SelectItem>
                  <SelectItem value="round_trip">Round trip</SelectItem>
                  <SelectItem value="multi_city">Multi-city</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cabin */}
            <div>
              <Label className="text-sm text-gray-700">Cabin</Label>
              <Select value={searchParams.cabinClass} onValueChange={v => setSearchParams(prev => ({ ...prev, cabinClass: v }))}>
                <SelectTrigger className="bg-white text-gray-900 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {searchParams.tripType === 'multi_city' && (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">Multi-city legs</div>
              {multiCityLegs.map((leg, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Origin IATA or City" value={leg.origin} onChange={e => {
                    const v = e.target.value.toUpperCase(); setMultiCityLegs(prev => prev.map((l, i) => i === idx ? { ...l, origin: v } : l))
                  }} className="bg-white text-gray-900 rounded-2xl" />
                  <Input placeholder="Destination IATA or City" value={leg.destination} onChange={e => {
                    const v = e.target.value.toUpperCase(); setMultiCityLegs(prev => prev.map((l, i) => i === idx ? { ...l, destination: v } : l))
                  }} className="bg-white text-gray-900 rounded-2xl" />
                  <Input type="date" value={leg.date} onChange={e => {
                    const v = e.target.value; setMultiCityLegs(prev => prev.map((l, i) => i === idx ? { ...l, date: v } : l))
                  }} className="bg-white text-gray-900 rounded-2xl" />
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="rounded-2xl px-5 h-10 bg-white/80 text-gray-900 border border-gray-300 hover:bg-white backdrop-blur-sm shadow-sm" onClick={() => setMultiCityLegs(prev => [...prev, { origin: "", destination: "", date: "" }])}>Add leg</Button>
                {multiCityLegs.length > 2 && (
                  <Button type="button" variant="secondary" className="rounded-2xl px-5 h-10 bg-white/80 text-gray-900 border border-gray-300 hover:bg-white backdrop-blur-sm shadow-sm" onClick={() => setMultiCityLegs(prev => prev.slice(0, -1))}>Remove last</Button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Departure */}
            <div>
              <Label className="text-sm text-gray-700">Departure</Label>
              <div className="relative">
                <Input type="date" value={searchParams.departureDate} onChange={e => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))} className="bg-white text-gray-900 pr-10 rounded-2xl" />
                <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Return (conditional) */}
            <div>
              <Label className="text-sm text-gray-700">Return (optional)</Label>
              <div className="relative">
                <Input type="date" value={searchParams.returnDate || ""} onChange={e => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))} disabled={searchParams.tripType !== 'round_trip'} className="bg-white text-gray-900 pr-10 disabled:opacity-50 rounded-2xl" />
                <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <Label className="text-sm text-gray-700">Passengers</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" className="h-9 w-9 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 rounded-full" onClick={() => setSearchParams(prev => ({ ...prev, passengers: Math.max(1, (prev.passengers || 1) - 1) }))}>
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <div className="w-10 text-center text-gray-900">{searchParams.passengers}</div>
                <Button type="button" variant="secondary" className="h-9 w-9 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 rounded-full" onClick={() => setSearchParams(prev => ({ ...prev, passengers: Math.min(9, (prev.passengers || 1) + 1) }))}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions - stacked and long */}
            <div className="flex flex-col items-stretch gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="directOnly" checked={directOnly} onCheckedChange={v => setDirectOnly(Boolean(v))} />
                <Label htmlFor="directOnly" className="text-sm text-gray-700">Direct only</Label>
              </div>
              <Button variant="secondary" className="w-full rounded-full px-5 h-10 bg-gray-100 text-gray-900 border border-gray-900/50 hover:bg-white backdrop-blur-sm shadow-sm" onClick={saveSearch}>Save search</Button>
              <Button className="w-full rounded-full px-6 h-10 bg-black text-white hover:bg-gray-900 backdrop-blur-sm shadow-sm" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search flights'}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Recent searches</div>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map(item => (
              <Button key={item.id} variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={() => loadSavedSearch(item)}>
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filters bar and panel */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{offers.length} results</div>
        <Button variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={() => setFiltersOpen(true)}>
          <FunnelIcon className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>

      {/* Lightweight inline controls (time range, stops, sorting) */}
      <FilterControls onChange={(partial) => setFilters(prev => ({ ...prev, ...partial }))} airlines={airlineOptions} />

      <FlightFiltersDisplay
        filters={activeChips}
        onRemoveFilter={removeChip}
        onClearAll={() => setFilters({ priceRange: [0, 5000], maxStops: 3, airlines: [], departureTime: [], arrivalTime: [], duration: [0, 1440], cabinClass: [], refundable: false, changeable: false, directOnly: false })}
      />

      <FlightFilters
        offers={offers}
        filters={{ ...filters, density }}
        onFiltersChange={(f) => { setFilters(f); if ((f as any).density) setDensity((f as any).density) }}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      {/* Inline controls */}
      <AirlinesSlider className="mt-2" />
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        {[
          'Policy-aware',
          'Price tracking',
        ].map((b) => (
          <span key={b} className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-gray-300 bg-white/70 text-gray-800">{b}</span>
        ))}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">View</div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'secondary'} className={viewMode === 'list' ? 'bg-black text-white rounded-2xl' : 'border-gray-300 bg-white text-gray-900 rounded-2xl'} onClick={() => setViewMode('list')}>List</Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'secondary'} className={viewMode === 'grid' ? 'bg-black text-white rounded-2xl' : 'border-gray-300 bg-white text-gray-900 rounded-2xl'} onClick={() => setViewMode('grid')}>Grid</Button>
        </div>
      </div>

      <FlightResults
        offers={filteredOffers}
        onTrackPrice={(id) => toast.success(`Tracking price for ${id}`)}
        onSelectOffer={(offer) => router.push(`/dashboard/flights/book/${offer.id}`)}
        className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2' : 'space-y-4'} ${density === 'compact' ? 'gap-3' : 'gap-6'}`}
      />

      {pageMeta?.after && (
        <div className="flex justify-center py-4">
          <Button variant="secondary" className="rounded-2xl px-6 h-11 bg-white/80 text-gray-900 border border-gray-300 hover:bg-white backdrop-blur-sm shadow-sm" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more…' : 'Load more'}
          </Button>
        </div>
      )}

      <FlightsSearchOverlay open={searching} />
    </div>
  )
}