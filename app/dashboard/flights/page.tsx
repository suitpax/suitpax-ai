"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plane, Loader2, MapPin, CurrencyDollarIcon, HeartIcon, HeartIcon as HeartSolidIcon, FunnelIcon, Users } from "lucide-react"
import FlightFilters from "@/components/flights/flight-filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Interfaces (adaptadas)
interface DuffelOffer {
  id: string
  slices: Array<{
    segments: Array<{
      airline: { name: string; iata_code: string; logo_symbol_url?: string }
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
  conditions: { change_before_departure?: any; refund_before_departure?: any }
}
interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
  tripType: string
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

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: "",
    destination: "",
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "one_way"
  })
  const [offers, setOffers] = useState<DuffelOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<DuffelOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [favoriteOffers, setFavoriteOffers] = useState<string[]>([])
  const [filters, setFilters] = useState<FlightFiltersState>({
    priceRange: [0, 5000],
    maxStops: 3,
    airlines: [],
    departureTime: [],
    arrivalTime: [],
    duration: [0, 1440],
    cabinClass: [],
    refundable: false,
    changeable: false,
    directOnly: false
  })

  // Buscar vuelos en Duffel API
  const searchFlights = async () => {
    setLoading(true)
    setOffers([])
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
      })
      const data = await res.json()
      if (!data.success || !data.offers) throw new Error(data.error || "No offers found")
      setOffers(data.offers)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros en frontend
  useEffect(() => {
    setFilteredOffers(applyFilters(offers))
  }, [offers, filters])

  function applyFilters(offers: DuffelOffer[]): DuffelOffer[] {
    return offers.filter(offer => {
      const price = parseFloat(offer.total_amount)
      const mainSegment = offer.slices[0]?.segments[0]
      const airlineCode = mainSegment?.airline?.iata_code
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      if (filters.airlines.length > 0 && !filters.airlines.includes(airlineCode)) return false
      if (filters.directOnly && (offer.slices[0].segments.length - 1 > 0)) return false
      if (filters.cabinClass.length > 0 && !filters.cabinClass.includes(offer.cabin_class)) return false
      // Otros filtros aquí...
      return true
    })
  }

  function formatDuration(duration: string): string {
    // PTxh ym → xh ym
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    const h = parseInt(match?.[1] || "0", 10)
    const m = parseInt(match?.[2] || "0", 10)
    return h ? `${h}h ${m}m` : `${m}m`
  }

  const toggleFavorite = (id: string) => {
    setFavoriteOffers(current =>
      current.includes(id) ? current.filter(f => f !== id) : [...current, id]
    )
  }

  // Componente Card oferta (con logo)
  const renderOfferCard = (offer: DuffelOffer) => {
    const mainSlice = offer.slices[0]
    const firstSegment = mainSlice.segments[0]
    const lastSegment = mainSlice.segments[mainSlice.segments.length - 1]
    const airlineLogo =
      firstSegment.airline.logo_symbol_url ||
      `https://content.duffel.com/airlines/structures/logos/${firstSegment.airline.iata_code}.svg`
    return (
      <Card key={offer.id} className="mb-6 shadow rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src={airlineLogo}
              alt={firstSegment.airline.name}
              className="h-8 w-8 object-contain rounded-full border"
              style={{ background: "#fff" }}
              onError={e => { (e.target as HTMLImageElement).src = "/airline-placeholder.svg" }}
            />
            <span className="font-semibold">{firstSegment.airline.name}</span>
            <Badge variant="outline" className="ml-2">{firstSegment.airline.iata_code}</Badge>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => toggleFavorite(offer.id)}>
              {favoriteOffers.includes(offer.id)
                ? <HeartSolidIcon className="h-5 w-5 text-pink-500" />
                : <HeartIcon className="h-5 w-5 text-gray-500" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 px-6">
          <div className="grid grid-cols-5 gap-2 items-center">
            {/* Origen */}
            <div className="flex flex-col items-center">
              <MapPin className="h-4 w-4 mb-1 text-gray-400" />
              <span className="font-semibold">{firstSegment.origin.iata_code}</span>
              <span className="text-xs text-gray-500">{firstSegment.origin.city_name}</span>
              <span className="text-xs text-gray-400">{firstSegment.origin.name}</span>
              <span className="text-xs mt-1">{firstSegment.departing_at.slice(11, 16)}</span>
            </div>
            {/* Duración y clase */}
            <div className="flex flex-col items-center col-span-1">
              <Users className="h-5 w-5 text-black mb-1" />
              <span className="text-xs font-semibold text-gray-700">{formatDuration(mainSlice.duration)}</span>
              <Badge variant="outline" className="mt-1">{offer.cabin_class.charAt(0).toUpperCase() + offer.cabin_class.slice(1)}</Badge>
            </div>
            {/* Destino */}
            <div className="flex flex-col items-center">
              <MapPin className="h-4 w-4 mb-1 text-gray-400" />
              <span className="font-semibold">{lastSegment.destination.iata_code}</span>
              <span className="text-xs text-gray-500">{lastSegment.destination.city_name}</span>
              <span className="text-xs text-gray-400">{lastSegment.destination.name}</span>
              <span className="text-xs mt-1">{lastSegment.arriving_at.slice(11, 16)}</span>
            </div>
            {/* Paradas/reglas */}
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mt-1">{mainSlice.segments.length - 1} stops</Badge>
              <Badge variant="default" className="mt-1">
                {offer.conditions?.refund_before_departure?.allowed ? "Refundable" : "Non-refundable"}
              </Badge>
              <Badge variant="default" className="mt-1">
                {offer.conditions?.change_before_departure?.allowed ? "Changeable" : "Non-changeable"}
              </Badge>
            </div>
            {/* Precio y botón */}
            <div className="flex flex-col items-center gap-1">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 mb-1" />
              <span className="font-bold text-xl text-black">${offer.total_amount}</span>
              <span className="text-xs text-gray-500">{offer.total_currency}</span>
              <Button size="sm" variant="default" className="mt-1">
                Reservar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render principal
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg border bg-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Plane className="h-5 w-5 text-black" /> Search flights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Formulario búsqueda profesional aquí */}
          <div className="flex flex-row gap-4">
            {/* Inputs: Origen, Destino, Fecha, Pasajeros, Clase, etc... */}
            <div className="flex-1">
              {/* Puedes crear los inputs y selects a tu gusto, por ejemplo: */}
              <input
                type="text"
                placeholder="Origin"
                value={searchParams.origin}
                onChange={e =>
                  setSearchParams(prev => ({ ...prev, origin: e.target.value.toUpperCase() }))
                }
                className="border p-2 rounded w-full mb-3"
              />
              <input
                type="text"
                placeholder="Destination"
                value={searchParams.destination}
                onChange={e =>
                  setSearchParams(prev => ({ ...prev, destination: e.target.value.toUpperCase() }))
                }
                className="border p-2 rounded w-full mb-3"
              />
              <input
                type="date"
                placeholder="Departure"
                value={searchParams.departureDate}
                onChange={e =>
                  setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))
                }
                className="border p-2 rounded w-full mb-3"
              />
              {/* ...otros campos aquí... */}
            </div>
            <div>
              <Button
                size="default"
                variant="default"
                disabled={loading}
                onClick={searchFlights}
                className="min-w-[160px]"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <>Buscar</>}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="ml-2"
                onClick={() => setShowFiltersPanel((prev) => !prev)}
                aria-label="Filters"
              >
                <FunnelIcon className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <FlightFilters
        offers={offers}
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={showFiltersPanel}
        onClose={() => setShowFiltersPanel(false)}
      />

      {/* Loader, error, mensajes */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 py-4">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          Searching offers...
        </div>
      )}
      {!loading && filteredOffers.length === 0 && offers.length > 0 && (
        <div className="text-center text-gray-500 py-6">
          No offers match your filters.
        </div>
      )}
      <div className="mt-4 mb-16">
        {filteredOffers.map(renderOfferCard)}
      </div>
    </div>
  )
}
