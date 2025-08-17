"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowsRightLeftIcon, FunnelIcon, MapPinIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline"
import FlightResults from "@/components/flights/flight-results"
import FlightFilters, { FlightFiltersDisplay } from "@/components/flights/flight-filters"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

interface DuffelAirport {
  id: string
  name: string
  iata_code: string
  city?: { name?: string }
  city_name?: string
  country_name?: string
}

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

  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [originResults, setOriginResults] = useState<DuffelAirport[]>([])
  const [destinationResults, setDestinationResults] = useState<DuffelAirport[]>([])
  const [showOriginResults, setShowOriginResults] = useState(false)
  const [showDestinationResults, setShowDestinationResults] = useState(false)

  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([])

  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
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

  const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
  const [pageMeta, setPageMeta] = useState<any>({})
  const [loadingMore, setLoadingMore] = useState(false)

  const [placesWarnings, setPlacesWarnings] = useState<any[]>([])

  // Load saved searches from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("suitpax_saved_searches")
      if (raw) setSavedSearches(JSON.parse(raw))
    } catch {}
  }, [])

  const persistSavedSearches = (next: SavedSearchItem[]) => {
    setSavedSearches(next)
    try {
      localStorage.setItem("suitpax_saved_searches", JSON.stringify(next))
    } catch {}
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
  useEffect(() => {
    try { localStorage.setItem('suitpax_flight_filters', JSON.stringify(filters)) } catch {}
  }, [filters])
  useEffect(() => {
    try { const raw = localStorage.getItem('suitpax_flight_filters'); if (raw) setFilters(JSON.parse(raw)) } catch {}
  }, [])

  // Build active chips for display
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

  // Airport suggestions via Duffel Places
  const fetchPlaces = useCallback(async (query: string) => {
    const res = await fetch(`/api/flights/duffel/places/suggestions?query=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const json = await res.json()
    setPlacesWarnings(json?.warnings || [])
    return Array.isArray(json?.data) ? json.data : []
  }, [])

  useEffect(() => {
    const q = originQuery.trim()
    if (!q) return setOriginResults([])
    const t = setTimeout(async () => {
      const items = await fetchPlaces(q)
      setOriginResults(items)
    }, 200)
    return () => clearTimeout(t)
  }, [originQuery, fetchPlaces])

  useEffect(() => {
    const q = destinationQuery.trim()
    if (!q) return setDestinationResults([])
    const t = setTimeout(async () => {
      const items = await fetchPlaces(q)
      setDestinationResults(items)
    }, 200)
    return () => clearTimeout(t)
  }, [destinationQuery, fetchPlaces])

  const selectAirport = (airport: any, type: "origin" | "destination") => {
    const code = (airport?.iata_code || '').toUpperCase()
    const cityCode = (airport?.iata_city_code || airport?.city?.iata_code || '').toUpperCase()
    const useCode = cityCode || code
    const city = (airport?.city_name || airport?.city?.name || '').toString()
    const name = airport?.name || city
    const label = `${city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : name} (${code || cityCode}) – ${name}`
    setSearchParams(prev => ({ ...prev, [type]: useCode }))
    if (type === "origin") {
      setOriginQuery(label)
      setShowOriginResults(false)
    } else {
      setDestinationQuery(label)
      setShowDestinationResults(false)
    }
  }

  const swapLocations = () => {
    setSearchParams(prev => ({ ...prev, origin: prev.destination, destination: prev.origin }))
    setOriginQuery(searchParams.destination)
    setDestinationQuery(searchParams.origin)
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
      const payload: any = {
        passengers: { adults: searchParams.passengers },
        cabin_class: searchParams.cabinClass,
      }
      if (directOnly) payload.max_connections = 0

      if (searchParams.tripType === 'multi_city') {
        const legs = multiCityLegs.filter(l => l.origin && l.destination && l.date)
        if (legs.length < 2) throw new Error('Please add at least 2 valid legs')
        payload.slices = legs.map(l => ({ origin: l.origin, destination: l.destination, departure_date: l.date }))
      } else {
        payload.origin = searchParams.origin
        payload.destination = searchParams.destination
        payload.departure_date = searchParams.departureDate
        if (searchParams.tripType === 'round_trip' && searchParams.returnDate) payload.return_date = searchParams.returnDate
      }

      const res = await fetch('/api/flights/duffel/optimized-search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Search failed')
      const results = Array.isArray(json?.data) ? json.data : json?.offers || []
      setOffers(results)
      setOfferRequestId(json?.offer_request_id || null)
      setPageMeta(json?.meta || {})
      toast.success(`Found ${results.length} flights`)
    } catch (e: any) {
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

  useEffect(() => {
    // Sync visible queries with current params on mount
    setOriginQuery(searchParams.origin)
    setDestinationQuery(searchParams.destination)
  }, [])

  const applyFilters = useCallback((offersToFilter: any[]) => {
    let filtered = [...offersToFilter]

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

    // Stops
    if (filters.directOnly) {
      filtered = filtered.filter(offer => (offer.slices?.[0]?.segments?.length || 1) - 1 === 0)
    } else if (filters.maxStops < 3) {
      filtered = filtered.filter(offer => (offer.slices?.[0]?.segments?.length || 1) - 1 <= filters.maxStops)
    }

    // Departure time
    if (filters.departureTime.length > 0) {
      filtered = filtered.filter(offer => {
        const dt = new Date(offer.slices?.[0]?.segments?.[0]?.departing_at)
        const hour = dt.getHours()
        return filters.departureTime.some(slot => {
          switch (slot) {
            case 'early-morning': return hour >= 5 && hour < 8
            case 'morning': return hour >= 8 && hour < 12
            case 'afternoon': return hour >= 12 && hour < 18
            case 'evening': return hour >= 18 && hour < 22
            case 'night': return hour >= 22 || hour < 5
            default: return true
          }
        })
      })
    }

    // Refundable / Changeable flags (if available)
    if (filters.refundable) {
      filtered = filtered.filter((o: any) => o.conditions?.refund_before_departure?.allowed === true)
    }
    if (filters.changeable) {
      filtered = filtered.filter((o: any) => o.conditions?.change_before_departure?.allowed === true)
    }

    return filtered
  }, [filters])

  const filteredOffers = useMemo(() => applyFilters(offers), [offers, applyFilters])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flights</h1>
          <p className="text-sm text-gray-600">Find and compare flights in real-time (Duffel)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={saveSearch}>Save search</Button>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search'}</Button>
        </div>
      </div>

      {/* Search Card */}
      <Card className="border-gray-200 bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base">Search parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Origin */}
            <div className="relative">
              <Label className="text-sm text-gray-700">Origin</Label>
              <div className="relative">
                <Input
                  value={originQuery}
                  onChange={e => setOriginQuery(e.target.value.toUpperCase())}
                  onFocus={() => setShowOriginResults(true)}
                  placeholder="JFK"
                  className="bg-white text-gray-900 pr-10 rounded-2xl"
                />
                <MapPinIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {showOriginResults && originResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-sm max-h-60 overflow-auto">
                  {originResults.slice(0, 8).map((p: any) => {
                    const city = (p.city_name || p.city?.name || '').toString()
                    const name = p.name || city
                    const iata = p.iata_code || p.airport?.iata_code || ''
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectAirport({ id: p.id, iata_code: iata, name, city_name: city } as any, 'origin')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="text-sm text-gray-900">{city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : name} ({iata})</div>
                        <div className="text-xs text-gray-600">{name}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Swap */}
            <div className="flex items-end md:justify-center">
              <Button type="button" variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={swapLocations}>
                <ArrowsRightLeftIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination */}
            <div className="relative">
              <Label className="text-sm text-gray-700">Destination</Label>
              <div className="relative">
                <Input
                  value={destinationQuery}
                  onChange={e => setDestinationQuery(e.target.value.toUpperCase())}
                  onFocus={() => setShowDestinationResults(true)}
                  placeholder="LHR"
                  className="bg-white text-gray-900 pr-10 rounded-2xl"
                />
                <MapPinIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {showDestinationResults && destinationResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-sm max-h-60 overflow-auto">
                  {destinationResults.slice(0, 8).map((p: any) => {
                    const city = (p.city_name || p.city?.name || '').toString()
                    const name = p.name || city
                    const iata = p.iata_code || p.airport?.iata_code || ''
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectAirport({ id: p.id, iata_code: iata, name, city_name: city } as any, 'destination')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="text-sm text-gray-900">{city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : name} ({iata})</div>
                        <div className="text-xs text-gray-600">{name}</div>
                      </button>
                    )
                  })}
                </div>
              )}
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
                <Button type="button" variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl" onClick={() => setMultiCityLegs(prev => [...prev, { origin: "", destination: "", date: "" }])}>Add leg</Button>
                {multiCityLegs.length > 2 && (
                  <Button type="button" variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl" onClick={() => setMultiCityLegs(prev => prev.slice(0, -1))}>Remove last</Button>
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
                <Input
                  type="date"
                  value={searchParams.returnDate || ""}
                  onChange={e => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                  disabled={searchParams.tripType !== 'round_trip'}
                  className="bg-white text-gray-900 pr-10 disabled:opacity-50 rounded-2xl"
                />
                <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <Label className="text-sm text-gray-700">Passengers</Label>
              <div className="relative">
                <Input type="number" min={1} max={9} value={searchParams.passengers} onChange={e => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value || '1') }))} className="bg-white text-gray-900 pr-10 rounded-2xl" />
                <UserIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="directOnly" checked={directOnly} onCheckedChange={v => setDirectOnly(Boolean(v))} />
                <Label htmlFor="directOnly" className="text-sm text-gray-700">Direct only</Label>
              </div>
              <Button variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl" onClick={saveSearch}>Save</Button>
              <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search'}</Button>
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

      <FlightFiltersDisplay
        filters={activeChips}
        onRemoveFilter={removeChip}
        onClearAll={() => setFilters({
          priceRange: [0, 5000], maxStops: 3, airlines: [], departureTime: [], arrivalTime: [], duration: [0, 1440], cabinClass: [], refundable: false, changeable: false, directOnly: false
        })}
      />

      <FlightFilters
        offers={offers}
        filters={filters}
        onFiltersChange={(f) => setFilters(f)}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">View</div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'secondary'} className={viewMode === 'list' ? 'bg-black text-white' : 'border-gray-300 bg-white text-gray-900'} onClick={() => setViewMode('list')}>List</Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'secondary'} className={viewMode === 'grid' ? 'bg-black text-white' : 'border-gray-300 bg-white text-gray-900'} onClick={() => setViewMode('grid')}>Grid</Button>
        </div>
      </div>

      {placesWarnings.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 p-3 text-sm">
          Some parameters are deprecated or will change soon. Using updated query field for suggestions.
        </div>
      )}

      <FlightResults
        offers={filteredOffers}
        onTrackPrice={(id) => toast.success(`Tracking price for ${id}`)}
        onSelectOffer={(offer) => toast.success(`Select flight ${offer.id}`)}
        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}
      />

      {pageMeta?.after && (
        <div className="flex justify-center py-4">
          <Button variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more…' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}