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
  tripType: "one_way" | "round_trip"
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

  const [offers, setOffers] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [originResults, setOriginResults] = useState<DuffelAirport[]>([])
  const [destinationResults, setDestinationResults] = useState<DuffelAirport[]>([])
  const [showOriginResults, setShowOriginResults] = useState(false)
  const [showDestinationResults, setShowDestinationResults] = useState(false)

  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([])

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

  // Airport search helpers
  const fetchAirports = useCallback(async (query: string) => {
    const res = await fetch(`/api/flights/duffel/airports?query=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const json = await res.json()
    const items = Array.isArray(json?.data) ? json.data : json?.airports || []
    return items as DuffelAirport[]
  }, [])

  useEffect(() => {
    const q = originQuery.trim()
    if (!q) return setOriginResults([])
    const t = setTimeout(async () => {
      const items = await fetchAirports(q)
      setOriginResults(items)
    }, 200)
    return () => clearTimeout(t)
  }, [originQuery, fetchAirports])

  useEffect(() => {
    const q = destinationQuery.trim()
    if (!q) return setDestinationResults([])
    const t = setTimeout(async () => {
      const items = await fetchAirports(q)
      setDestinationResults(items)
    }, 200)
    return () => clearTimeout(t)
  }, [destinationQuery, fetchAirports])

  const selectAirport = (airport: DuffelAirport, type: "origin" | "destination") => {
    setSearchParams(prev => ({ ...prev, [type]: airport.iata_code }))
    if (type === "origin") {
      setOriginQuery(airport.iata_code)
      setShowOriginResults(false)
    } else {
      setDestinationQuery(airport.iata_code)
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
      toast.error("Please fill in origin, destination and date")
      return
    }
    if (searchParams.tripType === "round_trip" && !searchParams.returnDate) {
      toast.error("Please add a return date")
      return
    }

    setSearching(true)
    setOffers([])

    try {
      const payload: any = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate,
        passengers: { adults: searchParams.passengers },
        cabin_class: searchParams.cabinClass,
      }
      if (searchParams.tripType === "round_trip" && searchParams.returnDate) {
        payload.return_date = searchParams.returnDate
      }

      const res = await fetch('/api/flights/duffel/optimized-search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Search failed')
      const results = Array.isArray(json?.data) ? json.data : json?.offers || []
      setOffers(results)
      toast.success(`Found ${results.length} flights`)
    } catch (e: any) {
      toast.error(e?.message || 'Error searching flights')
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    // Sync visible queries with current params on mount
    setOriginQuery(searchParams.origin)
    setDestinationQuery(searchParams.destination)
  }, [])

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
      <Card className="border-gray-200 bg-white">
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
                  className="bg-white text-gray-900 pr-10"
                />
                <MapPinIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {showOriginResults && originResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-sm max-h-60 overflow-auto">
                  {originResults.slice(0, 8).map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => selectAirport(a, 'origin')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      <div className="text-sm text-gray-900">{a.city?.name || a.city_name} ({a.iata_code})</div>
                      <div className="text-xs text-gray-600">{a.name}</div>
                    </button>
                  ))}
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
                  className="bg-white text-gray-900 pr-10"
                />
                <MapPinIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {showDestinationResults && destinationResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-sm max-h-60 overflow-auto">
                  {destinationResults.slice(0, 8).map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => selectAirport(a, 'destination')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      <div className="text-sm text-gray-900">{a.city?.name || a.city_name} ({a.iata_code})</div>
                      <div className="text-xs text-gray-600">{a.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trip type */}
            <div>
              <Label className="text-sm text-gray-700">Trip</Label>
              <Select value={searchParams.tripType} onValueChange={v => setSearchParams(prev => ({ ...prev, tripType: v as any }))}>
                <SelectTrigger className="bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  <SelectItem value="one_way">One way</SelectItem>
                  <SelectItem value="round_trip">Round trip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cabin */}
            <div>
              <Label className="text-sm text-gray-700">Cabin</Label>
              <Select value={searchParams.cabinClass} onValueChange={v => setSearchParams(prev => ({ ...prev, cabinClass: v }))}>
                <SelectTrigger className="bg-white text-gray-900">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Departure */}
            <div>
              <Label className="text-sm text-gray-700">Departure</Label>
              <div className="relative">
                <Input type="date" value={searchParams.departureDate} onChange={e => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))} className="bg-white text-gray-900 pr-10" />
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
                  className="bg-white text-gray-900 pr-10 disabled:opacity-50"
                />
                <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <Label className="text-sm text-gray-700">Passengers</Label>
              <div className="relative">
                <Input type="number" min={1} max={9} value={searchParams.passengers} onChange={e => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value || '1') }))} className="bg-white text-gray-900 pr-10" />
                <UserIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <Button variant="secondary" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={saveSearch}>Save</Button>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search'}</Button>
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

      {/* Results */}
      <FlightResults
        offers={offers}
        onTrackPrice={(id) => toast.success(`Tracking price for ${id}`)}
        onSelectOffer={(offer) => toast.success(`Select flight ${offer.id}`)}
      />
    </div>
  )
}