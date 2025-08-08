"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, ArrowRight, Calendar, Users, Search, Loader2, SlidersHorizontal, X, Heart, Building, Clock, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FlightFiltersDisplay } from "@/components/flights/flight-filters"
import { FlightStops } from "@/components/flights/flight-stops"
import { FlightConditionsDisplay } from "@/components/flights/flight-conditions"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

// Interfaces
interface DuffelOffer {
  id: string
  slices: Array<{
    segments: Array<{
      aircraft: { name: string }
      airline: { name: string; iata_code: string; logo_symbol_url?: string }
      flight_number: string
      origin: { city_name: string; iata_code: string; name: string }
      destination: { city_name: string; iata_code: string; name: string }
      departing_at: string
      arriving_at: string
      duration: string
    }>
    duration: string
  }>
  total_amount: string
  total_currency: string
  cabin_class: string
  owner: { name: string }
  conditions: any
  private_fares: any[]
}

interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  passengers: number
  cabinClass: string
  tripType: "one_way" | "round_trip"
}

interface FlightFiltersState {
  priceRange: [number, number]
  maxStops: number
  airlines: string[]
  departureTime: string[]
  arrivalTime: string[]
  duration: [number, number]
  cabinClass: string[]
  refundable: boolean
  changeable: boolean
  directOnly: boolean
}

// Skeleton Loader Component
const FlightOfferSkeleton = () => (
  <Card className="w-full animate-pulse">
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-300 rounded-lg w-28" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Flight Offer Card Component
const FlightOfferCard = ({ offer, isFavorite, onToggleFavorite }: { offer: DuffelOffer; isFavorite: boolean; onToggleFavorite: (id: string) => void }) => {
  const { slices, total_amount, total_currency, cabin_class, conditions, private_fares } = offer
  const mainSlice = slices[0]
  const returnSlice = slices.length > 1 ? slices[1] : null
  const airline = mainSlice.segments[0].airline

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-xl border border-gray-200/80">
        <div className="p-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img
                src={airline.logo_symbol_url || `https://ui-avatars.com/api/?name=${airline.name}&background=random`}
                alt={airline.name}
                className="h-10 w-10 rounded-full border border-gray-200 object-contain"
              />
              <div>
                <p className="font-semibold text-gray-900">{airline.name}</p>
                <p className="text-xs text-gray-500">{offer.owner.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-gray-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: total_currency }).format(parseFloat(total_amount))}
              </p>
              <p className="text-xs text-gray-500">Total price for all passengers</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-4">
          {/* Outbound flight */}
          <FlightSegmentDisplay slice={mainSlice} type="Outbound" />
          {/* Return flight */}
          {returnSlice && <FlightSegmentDisplay slice={returnSlice} type="Return" />}
        </div>

        <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
          <FlightConditionsDisplay
            conditions={conditions}
            privateFares={private_fares}
            cabinClass={cabin_class}
            totalAmount={total_amount}
            currency={total_currency}
          />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(offer.id)}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </Button>
            <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl">Select Flight</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const FlightSegmentDisplay = ({ slice, type }: { slice: DuffelOffer['slices'][0], type: 'Outbound' | 'Return' }) => {
  const firstSegment = slice.segments[0]
  const lastSegment = slice.segments[slice.segments.length - 1]

  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <p className="text-sm font-medium text-gray-800">{type} flight</p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="font-semibold text-lg">{formatTime(firstSegment.departing_at)}</p>
            <p className="text-gray-600">{firstSegment.origin.iata_code}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300" />
          <div className="text-center">
            <p className="font-semibold text-lg">{formatTime(lastSegment.arriving_at)}</p>
            <p className="text-gray-600">{lastSegment.destination.iata_code}</p>
          </div>
        </div>
        <div className="text-right">
          <FlightStops segments={slice.segments} />
        </div>
      </div>
    </div>
  )
}

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: "JFK",
    destination: "LHR",
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "one_way",
  })
  const [offers, setOffers] = useState<DuffelOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<DuffelOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [favoriteOffers, setFavoriteOffers] = useState<string[]>([])
  const [filters, setFilters] = useState<FlightFiltersState>({
    priceRange: [0, 10000],
    maxStops: 3,
    airlines: [],
    departureTime: [],
    arrivalTime: [],
    duration: [0, 2880],
    cabinClass: [],
    refundable: false,
    changeable: false,
    directOnly: false,
  })

  const supabase = createClient()

  useEffect(() => {
    const getUserAndFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data, error } = await supabase.from('favorite_offers').select('offer_id').eq('user_id', user.id)
        if (error) console.error("Error fetching favorites:", error)
        else setFavoriteOffers(data.map(fav => fav.offer_id))
      }
    }
    getUserAndFavorites()
  }, [supabase])

  const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination) {
      toast.error("Please enter origin and destination.")
      return
    }
    setLoading(true)
    setHasSearched(true)
    setOffers([])
    try {
      const response = await fetch('/api/flights/duffel/flight-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      })
      const data = await response.json()
      if (data.success) {
        setOffers(data.offers || [])
        toast.success(`Found ${data.offers?.length || 0} flights.`)
      } else {
        toast.error(data.error || "Failed to find flights.")
      }
    } catch (error) {
      toast.error("An error occurred while searching for flights.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback((offersToFilter: DuffelOffer[]) => {
    return offersToFilter.filter(offer => {
      const price = parseFloat(offer.total_amount)
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      if (filters.directOnly && offer.slices.some(s => s.segments.length > 1)) return false
      if (filters.airlines.length > 0 && !filters.airlines.includes(offer.slices[0].segments[0].airline.iata_code)) return false
      // Add more filter logic here
      return true
    })
  }, [filters])

  useEffect(() => {
    setFilteredOffers(applyFilters(offers))
  }, [offers, applyFilters])

  const handleToggleFavorite = async (offerId: string) => {
    if (!user) {
      toast.error("Please log in to save favorites.")
      return
    }
    const isFavorite = favoriteOffers.includes(offerId)
    if (isFavorite) {
      setFavoriteOffers(prev => prev.filter(id => id !== offerId))
      const { error } = await supabase.from('favorite_offers').delete().match({ user_id: user.id, offer_id: offerId })
      if (error) toast.error("Failed to remove favorite.")
      else toast.success("Removed from favorites.")
    } else {
      setFavoriteOffers(prev => [...prev, offerId])
      const { error } = await supabase.from('favorite_offers').insert({ user_id: user.id, offer_id: offerId })
      if (error) toast.error("Failed to add favorite.")
      else toast.success("Added to favorites.")
    }
  }

  const searchForm = (
    <Card className="shadow-lg border-gray-200/80">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin">From</Label>
              <Input id="origin" placeholder="JFK" value={searchParams.origin} onChange={e => setSearchParams(p => ({ ...p, origin: e.target.value.toUpperCase() }))} />
            </div>
            <div>
              <Label htmlFor="destination">To</Label>
              <Input id="destination" placeholder="LHR" value={searchParams.destination} onChange={e => setSearchParams(p => ({ ...p, destination: e.target.value.toUpperCase() }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="departureDate">Departure</Label>
            <Input id="departureDate" type="date" value={searchParams.departureDate} onChange={e => setSearchParams(p => ({ ...p, departureDate: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="passengers">Passengers</Label>
            <Select value={String(searchParams.passengers)} onValueChange={v => setSearchParams(p => ({ ...p, passengers: Number(v) }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Array.from({ length: 8 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n} passenger{n > 1 ? 's' : ''}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-xl">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search Flights
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900">Flight Search</h1>
          <p className="text-lg text-gray-500 mt-1">Find the best flights for your business needs.</p>
        </header>

        {searchForm}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-800">
              {hasSearched ? `Results (${filteredOffers.length})` : "Start your search"}
            </h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Filter Flights</SheetTitle></SheetHeader>
                <FlightFiltersDisplay offers={offers} filters={filters} onFiltersChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>

          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <FlightOfferSkeleton key={i} />)}
            </div>
          )}

          {!loading && hasSearched && filteredOffers.length === 0 && (
            <div className="text-center py-16">
              <Plane className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No flights found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && filteredOffers.length > 0 && (
            <div className="space-y-4">
              {filteredOffers.map(offer => (
                <FlightOfferCard
                  key={offer.id}
                  offer={offer}
                  isFavorite={favoriteOffers.includes(offer.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
