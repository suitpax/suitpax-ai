"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { z } from "zod"
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
import PlacesCommand from "@/components/ui/places-command"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import SheetFilters from "@/components/ui/sheet-filters"
const FilterControls = dynamic(() => import("@/components/flights/results/filter-controls/filter-controls"), { ssr: false })
const AirlinesSlider = dynamic(() => import("@/components/flights/results/airlines-slider"), { ssr: false })
const AirlinesModal = dynamic(() => import("@/components/flights/results/airlines-modal"), { ssr: false })
import GlobalPromptInput from "@/components/dashboard/global-prompt-input"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import FlightsSearchOverlay from "@/components/ui/flights-search-overlay"
import { getPlacesFromClient } from "@/components/places-lookup/lib/get-places-from-client"

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

const showToast = (message: string) => {
  return toast.custom(
    () => (
      <div className="inline-flex items-center gap-2 rounded-xl bg-gray-200 text-black border border-gray-300 px-3 py-2 shadow-sm">
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300 animate-pulse [animation-delay:150ms]" />
        </span>
        <span className="text-sm">{message}</span>
      </div>
    ),
    { duration: 2500 }
  )
}

const iataSchema = z.string().length(3).regex(/^[A-Z]{3}$/)
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const searchParamsSchema = z.object({
  origin: iataSchema,
  destination: iataSchema,
  departureDate: dateSchema,
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9),
  cabinClass: z.enum(["economy","premium_economy","business","first"]),
  tripType: z.enum(["one_way","round_trip","multi_city"]),
})

const validateSearchParams = (params: any, multiCityLegs?: Array<{ origin: string; destination: string; date: string }>) => {
  if (params.tripType === "multi_city") {
    const legs = (multiCityLegs || []).filter(l => l.origin && l.destination && l.date)
    if (legs.length < 2) return "Please add at least 2 valid legs"
    for (const l of legs) {
      if (!iataSchema.safeParse((l.origin || '').toUpperCase()).success) return "Invalid origin IATA in legs"
      if (!iataSchema.safeParse((l.destination || '').toUpperCase()).success) return "Invalid destination IATA in legs"
      if (!dateSchema.safeParse(l.date).success) return "Invalid date format in legs (YYYY-MM-DD)"
    }
    return null
  }
  const res = searchParamsSchema.safeParse({
    ...params,
    origin: (params.origin || '').toUpperCase(),
    destination: (params.destination || '').toUpperCase(),
  })
  if (!res.success) return res.error.errors[0]?.message || "Invalid search"
  if (params.tripType === "round_trip" && !params.returnDate) return "Please add a return date"
  return null
}

export default function FlightsPage() {
  const router = useRouter()
  const [aiQuery, setAiQuery] = useState("")
  const [travelMode, setTravelMode] = useState<'personal'|'business'>("business")

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
  const [airlinesOpen, setAirlinesOpen] = useState(false)
  const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
  const [pageMeta, setPageMeta] = useState<any>({})
  const [loadingMore, setLoadingMore] = useState(false)

  // Load saved searches
  useEffect(() => {
    // detect travel mode from query
    try {
      const sp = new URLSearchParams(window.location.search)
      const tt = (sp.get('tripType') || '').toLowerCase()
      if (tt === 'personal') setTravelMode('personal')
      else if (tt === 'corporate' || tt === 'business') setTravelMode('business')
    } catch {}
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
    showToast("Search saved")
  }
  const loadSavedSearch = (item: SavedSearchItem) => {
    setSearchParams(item.search_params)
    showToast("Loaded saved search")
  }

  // Persist filters
  useEffect(() => { try { localStorage.setItem('suitpax_flight_filters', JSON.stringify(filters)) } catch {} }, [filters])
  useEffect(() => { try { const raw = localStorage.getItem('suitpax_flight_filters'); if (raw) setFilters(JSON.parse(raw)) } catch {} }, [])

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; value: string }[] = []
    // Inline stops selector
    const selectedStops: number[] = Array.isArray((filters as any).stops) ? (filters as any).stops : []
    if (selectedStops.length > 0) {
      const label = selectedStops.length === 1 && selectedStops[0] === 0
        ? 'Direct only'
        : selectedStops.map(n => (n === 0 ? 'Non-stop' : `${n} stop`)).join(', ')
      chips.push({ id: 'stops', label: 'Stops', value: label })
    }
    if (filters.directOnly) chips.push({ id: 'directOnly', label: 'Stops', value: 'Direct only' })
    if (filters.maxStops < 3 && !filters.directOnly) chips.push({ id: 'maxStops', label: 'Stops', value: `${filters.maxStops} max` })
    if (filters.airlines.length > 0) chips.push({ id: 'airlines', label: 'Airlines', value: filters.airlines.join(', ') })
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) chips.push({ id: 'price', label: 'Price', value: `${filters.priceRange[0]}-${filters.priceRange[1]}` })
    // Inline departure time range
    const departs = (filters as any).departs as { from?: string; to?: string } | undefined
    if (departs?.from && departs?.to) chips.push({ id: 'departs', label: 'Departure', value: `${departs.from}–${departs.to}` })
    if (filters.departureTime.length > 0) chips.push({ id: 'dep', label: 'Departure', value: `${filters.departureTime.length} selected` })
    if (filters.refundable) chips.push({ id: 'ref', label: 'Refundable', value: 'Yes' })
    if (filters.changeable) chips.push({ id: 'chg', label: 'Changeable', value: 'Yes' })
    return chips
  }, [filters])

  const removeChip = (id: string) => {
    setFilters(prev => {
      const next = { ...prev }
      switch (id) {
        case 'stops': delete (next as any).stops; break
        case 'directOnly': next.directOnly = false; break
        case 'maxStops': next.maxStops = 3; break
        case 'airlines': next.airlines = []; break
        case 'price': next.priceRange = [0, 5000]; break
        case 'departs': delete (next as any).departs; break
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
    const validationError = validateSearchParams(searchParams, multiCityLegs)
    if (validationError) { showToast(validationError); return }

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
      showToast(`Found ${results.length} flights`)
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
      showToast(`Loaded ${more.length} more offers`) 
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

  // Pricing engine per mode (display only)
  const displayedOffers = useMemo(() => {
    const pctPersonal = Number(process.env.NEXT_PUBLIC_PERSONAL_MARKUP_PCT || 0.03)
    const minPersonal = Number(process.env.NEXT_PUBLIC_PERSONAL_MIN_FEE || 5)
    const pctBusiness = Number(process.env.NEXT_PUBLIC_BUSINESS_MARKUP_PCT || 0.01)
    const minBusiness = Number(process.env.NEXT_PUBLIC_BUSINESS_MIN_FEE || 2)
    return filteredOffers.map((o: any) => {
      const base = parseFloat(o.total_amount)
      if (!Number.isFinite(base)) return o
      const currency = o.total_currency || 'USD'
      if (travelMode === 'personal') {
        const fee = Math.max(minPersonal, Math.round(base * pctPersonal))
        const display = (base + fee).toFixed(0)
        return { ...o, display_total_amount: display, display_total_currency: currency, service_fee: fee, pricing_mode: 'personal' }
      }
      const fee = Math.max(minBusiness, Math.round(base * pctBusiness))
      const display = (base + fee).toFixed(0)
      return { ...o, display_total_amount: display, display_total_currency: currency, service_fee: fee, pricing_mode: 'business' }
    })
  }, [filteredOffers, travelMode])

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
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter">Flights</h1>
          <p className="text-sm text-gray-600 mt-1">Find the best routes, fares and schedules — compare in seconds.</p>
        </div>
        <div className="flex flex-col w-full max-w-sm md:max-w-none md:flex-row items-stretch md:items-center gap-2">
          <Button className="w-full md:w-auto rounded-full md:rounded-2xl px-6 h-10 bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 backdrop-blur-sm shadow-sm" onClick={() => router.push('/dashboard/suitpax-ai?tab=chat')}>Ask Suitpax AI</Button>
          <Button id="primary-search-btn" className="w-full md:w-auto rounded-full md:rounded-2xl px-8 h-10 bg-black text-white hover:bg-gray-900 backdrop-blur-sm shadow-sm" onClick={searchFlights} disabled={searching}>{searching ? 'Searching…' : 'Search flights'}</Button>
        </div>
      </div>

      {/* AI prompt (reused global input) */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <GlobalPromptInput
            placeholder="Ask Suitpax AI to plan your next flight (e.g., MAD → LHR Friday)"
            onSubmitNavigate={async (msg) => {
              // Parse natural language: origin, destination, date, time window
              const text = msg.trim()
              const iatas = (text.match(/\b([A-Z]{3})\b/g) || []).slice(0, 2)
              let origin = iatas[0] || ""
              let destination = iatas[1] || ""
              const dateIso = (() => {
                const iso = text.match(/\b(\d{4}-\d{2}-\d{2})\b/)
                if (iso) return iso[1]
                const dmy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/)
                if (dmy) {
                  const d = dmy[1].padStart(2, '0'); const m = dmy[2].padStart(2, '0'); const y = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3]
                  return `${y}-${m}-${d}`
                }
                const months: Record<string, string> = { enero:"01", febrero:"02", marzo:"03", abril:"04", mayo:"05", junio:"06", julio:"07", agosto:"08", septiembre:"09", setiembre:"09", octubre:"10", noviembre:"11", diciembre:"12",
                  january:"01", february:"02", march:"03", april:"04", may:"05", june:"06", july:"07", august:"08", september:"09", october:"10", november:"11", december:"12" }
                const md = text.match(/(\d{1,2})\s+de\s+([a-zA-Záéíóúñ]+)|([a-zA-Z]+)\s+(\d{1,2})/i)
                if (md) {
                  const day = (md[1] || md[4])?.padStart(2, '0')
                  const monKey = (md[2] || md[3] || '').toLowerCase()
                  const mon = months[monKey]
                  if (day && mon) {
                    const year = new Date().getFullYear().toString()
                    return `${year}-${mon}-${day}`
                  }
                }
                return ''
              })()
              const timeWindow = (() => {
                const m = text.match(/(\d{1,2})(?:[:h]\d{2})?\s*(?:a|to|\-)\s*(\d{1,2})(?:[:h]\d{2})?/i)
                if (!m) return null
                const from = m[1].padStart(2, '0')+":00"; const to = m[2].padStart(2, '0')+":00"
                return { from, to }
              })()
              // If IATAs missing, try extract by phrases "de X a Y" / "from X to Y"
              if (!origin || !destination) {
                const m = text.match(/(?:de|from)\s+([^,]+?)\s+(?:a|to)\s+([^,\.]+?)(?:\s|$)/i)
                if (m) {
                  const [_, fromStr, toStr] = m
                  try {
                    const [pf, pt] = await Promise.all([
                      getPlacesFromClient(fromStr.trim()),
                      getPlacesFromClient(toStr.trim()),
                    ])
                    origin = origin || (pf?.[0]?.iata_code || pf?.[0]?.airport?.iata_code || '').toUpperCase()
                    destination = destination || (pt?.[0]?.iata_code || pt?.[0]?.airport?.iata_code || '').toUpperCase()
                  } catch {}
                }
              }
              if (origin && destination) {
                setSearchParams(prev => ({ ...prev, origin, destination, departureDate: dateIso || prev.departureDate }))
                if (timeWindow) setFilters(prev => ({ ...prev, departs: timeWindow }))
                await searchFlights()
              } else {
                toast.error('Could not extract route. Please specify origin and destination.')
              }
            }}
            className="bg-white border border-gray-200"
          />
        </div>
      </div>

      {/* Airlines slider just under prompt */}
      <div className="mt-4 flex justify-center">
        <div className="w-full max-w-4xl">
          <button onClick={() => setAirlinesOpen(true)} className="w-full rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <AirlinesSlider />
          </button>
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
      <Card className="border-gray-200 glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base">Trip details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 relative">
            {/* Origin */}
            <div className="relative">
              <Label className="text-sm text-gray-700">Origin</Label>
              <div className="hidden md:block">
                <PlacesCommand value={searchParams.origin} onSelect={(item: any) => setSearchParams(prev => ({ ...prev, origin: (item?.iata_code || '').toUpperCase() }))} placeholder="Origin (city or airport)" />
              </div>
              <div className="md:hidden">
                <PlacesLookup value={searchParams.origin} onSelect={(item: any) => setSearchParams(prev => ({ ...prev, origin: (item?.iata_code || '').toUpperCase() }))} placeholder="Origin" />
              </div>
            </div>

            {/* Swap */}
            <div className="hidden md:flex items-end justify-center">
              <Button type="button" variant="secondary" className="h-11 w-11 p-0 rounded-full border-gray-300 bg-gray-200 text-black hover:bg-gray-300 backdrop-blur-sm shadow-sm" onClick={swapLocations} title="Swap">
                <ArrowsRightLeftIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination */}
            <div className="relative">
              <Label className="text-sm text-gray-700">Destination</Label>
              <div className="hidden md:block">
                <PlacesCommand value={searchParams.destination} onSelect={(item: any) => setSearchParams(prev => ({ ...prev, destination: (item?.iata_code || '').toUpperCase() }))} placeholder="Destination (city or airport)" />
              </div>
              <div className="md:hidden">
                <PlacesLookup value={searchParams.destination} onSelect={(item: any) => setSearchParams(prev => ({ ...prev, destination: (item?.iata_code || '').toUpperCase() }))} placeholder="Destination" />
              </div>
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
                  <PlacesLookup value={leg.origin} onSelect={(item: any) => {
                    const v = (item?.iata_code || '').toUpperCase(); setMultiCityLegs(prev => prev.map((l, i) => i === idx ? { ...l, origin: v } : l))
                  }} placeholder="Origin IATA or City" />
                  <PlacesLookup value={leg.destination} onSelect={(item: any) => {
                    const v = (item?.iata_code || '').toUpperCase(); setMultiCityLegs(prev => prev.map((l, i) => i === idx ? { ...l, destination: v } : l))
                  }} placeholder="Destination IATA or City" />
                  <Input type="date" value={leg.date} onChange={e => {
                    const v = e.target.value; setMultiCityLegs(prev => prev.map((l, i) => i === idx ? { ...l, date: v } : l))
                  }} className="bg-white text-gray-900 rounded-2xl" />
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="rounded-2xl px-5 h-10 bg-gray-200 text-black border border-gray-300 hover:bg-gray-300 backdrop-blur-sm shadow-sm" onClick={() => setMultiCityLegs(prev => [...prev, { origin: "", destination: "", date: "" }])}>Add leg</Button>
                {multiCityLegs.length > 2 && (
                  <Button type="button" variant="secondary" className="rounded-2xl px-5 h-10 bg-gray-200 text-black border border-gray-300 hover:bg-gray-300 backdrop-blur-sm shadow-sm" onClick={() => setMultiCityLegs(prev => prev.slice(0, -1))}>Remove last</Button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {/* Departure */}
            <div>
              <Label className="text-sm text-gray-700 mb-2 inline-block">Departure</Label>
              <DateRangePicker
                mode={searchParams.tripType === 'round_trip' ? 'range' : 'single'}
                value={searchParams.tripType === 'round_trip' ? { from: searchParams.departureDate ? new Date(searchParams.departureDate) : undefined, to: searchParams.returnDate ? new Date(searchParams.returnDate) : undefined } : (searchParams.departureDate ? new Date(searchParams.departureDate) : undefined)}
                onChange={(val: any) => {
                  if (searchParams.tripType === 'round_trip') {
                    setSearchParams(prev => ({ ...prev, departureDate: val?.from ? val.from.toISOString().split('T')[0] : prev.departureDate, returnDate: val?.to ? val.to.toISOString().split('T')[0] : '' }))
                  } else {
                    setSearchParams(prev => ({ ...prev, departureDate: val ? (val as Date).toISOString().split('T')[0] : prev.departureDate }))
                  }
                }}
              />
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
                <Button type="button" variant="secondary" className="h-9 w-9 border-gray-300 bg-gray-200 text-black hover:bg-gray-300 rounded-full" onClick={() => setSearchParams(prev => ({ ...prev, passengers: Math.max(1, (prev.passengers || 1) - 1) }))}>
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <div className="w-10 text-center text-gray-900">{searchParams.passengers}</div>
                <Button type="button" variant="secondary" className="h-9 w-9 border-gray-300 bg-gray-200 text-black hover:bg-gray-300 rounded-full" onClick={() => setSearchParams(prev => ({ ...prev, passengers: Math.min(9, (prev.passengers || 1) + 1) }))}>
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
              <Button variant="secondary" className="w-full rounded-full px-5 h-10 bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 backdrop-blur-sm shadow-sm" onClick={saveSearch}>Save search</Button>
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
              <Button key={item.id} variant="secondary" className="border-gray-300 bg-gray-200 text-black hover:bg-gray-300" onClick={() => loadSavedSearch(item)}>
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filters bar and panel */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{offers.length} results</div>
        <div className="hidden md:block">
          <Button variant="default" className="rounded-full h-9 px-4 bg-black text-white hover:bg-gray-900" onClick={() => setFiltersOpen(true)}>
            <FunnelIcon className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
        <div className="md:hidden">
          <SheetFilters
            trigger={
              <div className="flex items-center gap-2">
                <Button className="rounded-full h-9 px-4 bg-black text-white hover:bg-gray-900">
                  <FunnelIcon className="h-4 w-4 mr-2" /> Filters
                </Button>
                {activeChips.length > 0 && (
                  <span className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 text-[9px] font-medium text-gray-700 border border-black/10">
                    {activeChips.length} active
                  </span>
                )}
              </div>
            }
            renderFooter={(close) => (
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" className="rounded-full h-9 px-4" onClick={() => { setFilters({ priceRange: [0, 5000], maxStops: 3, airlines: [], departureTime: [], arrivalTime: [], duration: [0, 1440], cabinClass: [], refundable: false, changeable: false, directOnly: false }); close(); }}>Reset</Button>
                <Button className="rounded-full h-9 px-4 bg-black text-white hover:bg-gray-900" onClick={() => close()}>Apply</Button>
              </div>
            )}
          >
            <div className="p-2">
              <FlightFilters
                offers={offers}
                filters={{ ...filters, density }}
                onFiltersChange={(f) => { setFilters(f); if ((f as any).density) setDensity((f as any).density) }}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
          </SheetFilters>
        </div>
      </div>

      {/* Lightweight inline controls (time range, stops, sorting) */}
      <FilterControls onChange={(partial) => setFilters(prev => ({ ...prev, ...partial }))} airlines={airlineOptions} />

      <FlightFiltersDisplay
        filters={activeChips}
        onRemoveFilter={removeChip}
        onClearAll={() => setFilters({ priceRange: [0, 5000], maxStops: 3, airlines: [], departureTime: [], arrivalTime: [], duration: [0, 1440], cabinClass: [], refundable: false, changeable: false, directOnly: false })}
      />

      {/* Desktop side panel (opens from Filters button) */}
      {filtersOpen && (
        <div className="hidden md:block">
          <div className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[90%] md:w-[480px] bg-white shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-sm font-medium">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
                <FlightFilters
                  offers={offers}
                  filters={{ ...filters, density }}
                  onFiltersChange={(f) => { setFilters(f); if ((f as any).density) setDensity((f as any).density) }}
                  isOpen={true}
                  onClose={() => setFiltersOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Airlines modal */}
      <AirlinesModal
        open={airlinesOpen}
        onOpenChange={setAirlinesOpen}
        airlines={airlineOptions.map(a => ({ code: a.code, name: a.name, logo: `/logo/airlines/${a.code.toLowerCase()}.svg` }))}
        selected={filters.airlines}
        onChange={(codes) => setFilters(prev => ({ ...prev, airlines: codes }))}
      />

      {/* Mini pulse badge CTA */}
      <div className="flex justify-center mt-3">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] border border-gray-300 bg-white/80 text-gray-800">
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-500 animate-pulse [animation-delay:200ms]" />
          </span>
          Try Suitpax AI Voice
        </span>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">View</div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'secondary'} className={viewMode === 'list' ? 'bg-black text-white rounded-2xl' : 'border-gray-300 bg-gray-200 text-black rounded-2xl'} onClick={() => setViewMode('list')}>List</Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'secondary'} className={viewMode === 'grid' ? 'bg-black text-white rounded-2xl' : 'border-gray-300 bg-gray-200 text-black rounded-2xl'} onClick={() => setViewMode('grid')}>Grid</Button>
        </div>
      </div>

      <FlightResults
        offers={displayedOffers}
        onTrackPrice={(id) => showToast(`Tracking price for ${id}`)}
        onSelectOffer={(offer) => router.push(`/dashboard/flights/book/${offer.id}`)}
        className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2' : 'space-y-4'} ${density === 'compact' ? 'gap-3' : 'gap-6'}`}
      />

      {pageMeta?.after && (
        <div className="flex justify-center py-4">
          <Button variant="secondary" className="rounded-2xl px-6 h-11 bg-gray-200 text-black border border-gray-300 hover:bg-gray-300 backdrop-blur-sm shadow-sm" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more…' : 'Load more'}
          </Button>
        </div>
      )}

      <FlightsSearchOverlay open={searching} />
    </div>
  )
}