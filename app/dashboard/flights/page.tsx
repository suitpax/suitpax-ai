"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plane,
  CalendarIcon,
  Search,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FlightSearchParams {
  from: string
  to: string
  departureDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  class: string
  tripType: "roundtrip" | "oneway"
}

interface FlightResult {
  id: string
  airline: string
  airlineLogo: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
    terminal?: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    terminal?: string
  }
  duration: string
  price: number
  originalPrice?: number
  class: string
  amenities: string[]
  stops: number
  aircraft: string
  carbonEmissions: number
  popularity: number
  dealType?: "best-price" | "fastest" | "recommended"
}

// Datos mejorados de vuelos con más realismo
const SAMPLE_FLIGHTS: FlightResult[] = [
  {
    id: "1",
    airline: "Iberia",
    airlineLogo: "/logos/iberia-logo.png",
    flightNumber: "IB3201",
    departure: { airport: "MAD", city: "Madrid", time: "08:30", terminal: "T4" },
    arrival: { airport: "LHR", city: "Londres", time: "10:15", terminal: "T5" },
    duration: "2h 45m",
    price: 245,
    originalPrice: 289,
    class: "economy",
    amenities: ["wifi", "meal", "entertainment"],
    stops: 0,
    aircraft: "Airbus A320",
    carbonEmissions: 180,
    popularity: 95,
    dealType: "recommended",
  },
  {
    id: "2",
    airline: "British Airways",
    airlineLogo: "/logos/ba-logo.png",
    flightNumber: "BA461",
    departure: { airport: "MAD", city: "Madrid", time: "14:20", terminal: "T4" },
    arrival: { airport: "LHR", city: "Londres", time: "16:05", terminal: "T5" },
    duration: "2h 45m",
    price: 289,
    class: "economy",
    amenities: ["wifi", "meal", "lounge"],
    stops: 0,
    aircraft: "Boeing 737",
    carbonEmissions: 195,
    popularity: 88,
    dealType: "fastest",
  },
  {
    id: "3",
    airline: "Lufthansa",
    airlineLogo: "/logos/lufthansa-logo.png",
    flightNumber: "LH1110",
    departure: { airport: "MAD", city: "Madrid", time: "11:15", terminal: "T1" },
    arrival: { airport: "LHR", city: "Londres", time: "15:30", terminal: "T2" },
    duration: "4h 15m",
    price: 198,
    class: "economy",
    amenities: ["wifi", "snack"],
    stops: 1,
    aircraft: "Airbus A321",
    carbonEmissions: 220,
    popularity: 72,
    dealType: "best-price",
  },
]

const POPULAR_DESTINATIONS = [
  { code: "LHR", city: "Londres", country: "Reino Unido", flag: "🇬🇧" },
  { code: "CDG", city: "París", country: "Francia", flag: "🇫🇷" },
  { code: "FRA", city: "Frankfurt", country: "Alemania", flag: "🇩🇪" },
  { code: "AMS", city: "Ámsterdam", country: "Países Bajos", flag: "🇳🇱" },
  { code: "ZUR", city: "Zúrich", country: "Suiza", flag: "🇨🇭" },
  { code: "MXP", city: "Milán", country: "Italia", flag: "🇮🇹" },
]

const SPANISH_CITIES = [
  { code: "MAD", city: "Madrid", flag: "🇪🇸" },
  { code: "BCN", city: "Barcelona", flag: "🇪🇸" },
  { code: "SVQ", city: "Sevilla", flag: "🇪🇸" },
  { code: "VLC", city: "Valencia", flag: "🇪🇸" },
  { code: "BIO", city: "Bilbao", flag: "🇪🇸" },
  { code: "PMI", city: "Palma", flag: "🇪🇸" },
]

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: "",
    to: "",
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    class: "economy",
    tripType: "roundtrip",
  })
  const [flights, setFlights] = useState<FlightResult[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [bookingFlight, setBookingFlight] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price" | "duration" | "popularity">("price")
  const [filterBy, setFilterBy] = useState<"all" | "direct" | "stops">("all")
  const supabase = createClient()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
      setUser(userData)
    }
  }

  const searchFlights = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
      alert("Por favor, completa todos los campos obligatorios")
      return
    }

    setLoading(true)

    // Simular búsqueda de vuelos con delay realista
    setTimeout(() => {
      setFlights(SAMPLE_FLIGHTS)
      setLoading(false)
    }, 2500)
  }

  const bookFlight = async (flight: FlightResult) => {
    if (!user) return

    setBookingFlight(flight.id)

    try {
      const { error } = await supabase.from("flight_bookings").insert({
        user_id: user.id,
        departure_city: flight.departure.city,
        arrival_city: flight.arrival.city,
        departure_date: searchParams.departureDate?.toISOString().split("T")[0],
        return_date: searchParams.returnDate?.toISOString().split("T")[0],
        passenger_name: user.full_name,
        passenger_email: user.email,
        airline: flight.airline,
        flight_number: flight.flightNumber,
        seat_class: flight.class,
        total_price: flight.price,
        status: "pending",
        booking_data: flight,
      })

      if (error) throw error

      alert("¡Vuelo reservado exitosamente! Recibirás un email de confirmación.")

      // Crear gasto automáticamente
      await supabase.from("expenses").insert({
        user_id: user.id,
        title: `Vuelo ${flight.departure.city} - ${flight.arrival.city}`,
        description: `${flight.airline} ${flight.flightNumber}`,
        amount: flight.price,
        category: "Transporte",
        expense_date: searchParams.departureDate?.toISOString().split("T")[0],
        status: "submitted",
      })
    } catch (error) {
      console.error("Error al reservar vuelo:", error)
      alert("Error al reservar el vuelo. Inténtalo de nuevo.")
    } finally {
      setBookingFlight(null)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "meal":
        return <Utensils className="h-4 w-4" />
      case "entertainment":
        return <Star className="h-4 w-4" />
      case "lounge":
        return <Coffee className="h-4 w-4" />
      case "snack":
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  const getDealBadge = (dealType?: string) => {
    switch (dealType) {
      case "best-price":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Mejor precio</Badge>
      case "fastest":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Más rápido</Badge>
      case "recommended":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Recomendado</Badge>
      default:
        return null
    }
  }

  const sortedAndFilteredFlights = flights
    .filter((flight) => {
      if (filterBy === "direct") return flight.stops === 0
      if (filterBy === "stops") return flight.stops > 0
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "duration":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        case "popularity":
          return b.popularity - a.popularity
        default:
          return 0
      }
    })

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/images/airplane-landing-sunset.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Plane className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Reserva de Vuelos</h1>
              <p className="text-gray-300 mt-2 text-lg font-light">
                Encuentra y reserva vuelos para tus viajes de negocio con IA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium">IA Optimizada</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Reserva Segura</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">Confirmación Instantánea</span>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="search" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-2xl">
          <TabsTrigger value="search" className="rounded-xl font-medium">
            Buscar Vuelos
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-xl font-medium">
            Mis Reservas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-8">
          {/* Search Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl font-medium tracking-tighter">
                  <Search className="h-6 w-6" />
                  Buscar Vuelos
                </CardTitle>
                <CardDescription className="text-base font-light">
                  Encuentra los mejores vuelos para tu viaje de negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Trip Type */}
                <div className="flex items-center space-x-4">
                  <Label className="text-sm font-medium">Tipo de viaje</Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="roundtrip"
                        checked={searchParams.tripType === "roundtrip"}
                        onChange={(e) =>
                          setSearchParams((prev) => ({ ...prev, tripType: e.target.value as "roundtrip" | "oneway" }))
                        }
                        className="text-gray-900"
                      />
                      <span className="text-sm font-medium">Ida y vuelta</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="oneway"
                        checked={searchParams.tripType === "oneway"}
                        onChange={(e) =>
                          setSearchParams((prev) => ({ ...prev, tripType: e.target.value as "roundtrip" | "oneway" }))
                        }
                        className="text-gray-900"
                      />
                      <span className="text-sm font-medium">Solo ida</span>
                    </label>
                  </div>
                </div>

                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="from" className="text-sm font-medium">
                      Origen
                    </Label>
                    <Select
                      value={searchParams.from}
                      onValueChange={(value) => setSearchParams((prev) => ({ ...prev, from: value }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200">
                        <SelectValue placeholder="Selecciona origen" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPANISH_CITIES.map((city) => (
                          <SelectItem key={city.code} value={city.code}>
                            <div className="flex items-center space-x-2">
                              <span>{city.flag}</span>
                              <span>
                                {city.city} ({city.code})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="to" className="text-sm font-medium">
                      Destino
                    </Label>
                    <Select
                      value={searchParams.to}
                      onValueChange={(value) => setSearchParams((prev) => ({ ...prev, to: value }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200">
                        <SelectValue placeholder="Selecciona destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {POPULAR_DESTINATIONS.map((dest) => (
                          <SelectItem key={dest.code} value={dest.code}>
                            <div className="flex items-center space-x-2">
                              <span>{dest.flag}</span>
                              <span>
                                {dest.city} ({dest.code})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dates and Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Fecha de salida</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 w-full justify-start text-left font-normal rounded-xl border-gray-200",
                            !searchParams.departureDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-3 h-4 w-4" />
                          {searchParams.departureDate ? (
                            format(searchParams.departureDate, "dd MMM yyyy", { locale: es })
                          ) : (
                            <span>Selecciona fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={searchParams.departureDate}
                          onSelect={(date) => setSearchParams((prev) => ({ ...prev, departureDate: date }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {searchParams.tripType === "roundtrip" && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Fecha de regreso</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal rounded-xl border-gray-200",
                              !searchParams.returnDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-3 h-4 w-4" />
                            {searchParams.returnDate ? (
                              format(searchParams.returnDate, "dd MMM yyyy", { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={searchParams.returnDate}
                            onSelect={(date) => setSearchParams((prev) => ({ ...prev, returnDate: date }))}
                            disabled={(date) => date < (searchParams.departureDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="passengers" className="text-sm font-medium">
                      Pasajeros
                    </Label>
                    <Select
                      value={searchParams.passengers.toString()}
                      onValueChange={(value) =>
                        setSearchParams((prev) => ({ ...prev, passengers: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {num} {num === 1 ? "pasajero" : "pasajeros"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="class" className="text-sm font-medium">
                      Clase
                    </Label>
                    <Select
                      value={searchParams.class}
                      onValueChange={(value) => setSearchParams((prev) => ({ ...prev, class: value }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Económica</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">Primera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={searchFlights}
                  className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-medium text-lg tracking-tight"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Search className="mr-3 h-5 w-5 animate-spin" />
                      Buscando vuelos...
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-5 w-5" />
                      Buscar vuelos
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Flight Results */}
          <AnimatePresence>
            {flights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-medium tracking-tighter">Resultados de búsqueda</h2>
                    <p className="text-gray-600 font-light mt-1">{flights.length} vuelos encontrados</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40 rounded-xl border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Precio</SelectItem>
                        <SelectItem value="duration">Duración</SelectItem>
                        <SelectItem value="popularity">Popularidad</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                      <SelectTrigger className="w-40 rounded-xl border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="direct">Directos</SelectItem>
                        <SelectItem value="stops">Con escalas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Flight Cards */}
                <div className="space-y-4">
                  {sortedAndFilteredFlights.map((flight, index) => (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-8">
                            {/* Deal Badge */}
                            {flight.dealType && <div className="mb-4">{getDealBadge(flight.dealType)}</div>}

                            <div className="flex items-center justify-between">
                              <div className="flex-1 space-y-6">
                                {/* Flight Route */}
                                <div className="flex items-center justify-between">
                                  <div className="text-center space-y-1">
                                    <p className="text-3xl font-bold tracking-tight">{flight.departure.time}</p>
                                    <p className="text-lg font-medium text-gray-900">{flight.departure.airport}</p>
                                    <p className="text-sm text-gray-600">{flight.departure.city}</p>
                                    {flight.departure.terminal && (
                                      <p className="text-xs text-gray-500">Terminal {flight.departure.terminal}</p>
                                    )}
                                  </div>

                                  <div className="flex-1 text-center px-8">
                                    <div className="flex items-center justify-center space-x-3 mb-2">
                                      <div className="h-px bg-gray-300 flex-1"></div>
                                      <div className="p-2 bg-gray-100 rounded-full">
                                        <Plane className="h-5 w-5 text-gray-600" />
                                      </div>
                                      <div className="h-px bg-gray-300 flex-1"></div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">{flight.duration}</p>
                                    {flight.stops > 0 ? (
                                      <p className="text-xs text-orange-600 font-medium mt-1">
                                        {flight.stops} escala{flight.stops > 1 ? "s" : ""}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-green-600 font-medium mt-1">Directo</p>
                                    )}
                                  </div>

                                  <div className="text-center space-y-1">
                                    <p className="text-3xl font-bold tracking-tight">{flight.arrival.time}</p>
                                    <p className="text-lg font-medium text-gray-900">{flight.arrival.airport}</p>
                                    <p className="text-sm text-gray-600">{flight.arrival.city}</p>
                                    {flight.arrival.terminal && (
                                      <p className="text-xs text-gray-500">Terminal {flight.arrival.terminal}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Flight Details */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Plane className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{flight.airline}</p>
                                        <p className="text-xs text-gray-600">{flight.flightNumber}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                      {flight.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center space-x-1 text-gray-600">
                                          {getAmenityIcon(amenity)}
                                          <span className="text-xs font-medium capitalize">{amenity}</span>
                                        </div>
                                      ))}
                                    </div>

                                    <Badge variant="outline" className="text-xs font-medium">
                                      {flight.aircraft}
                                    </Badge>
                                  </div>

                                  <div className="text-right space-y-2">
                                    <div>
                                      {flight.originalPrice && (
                                        <p className="text-sm text-gray-500 line-through">€{flight.originalPrice}</p>
                                      )}
                                      <p className="text-3xl font-bold text-green-600">€{flight.price}</p>
                                      <p className="text-xs text-gray-600">por persona</p>
                                    </div>
                                    <Button
                                      onClick={() => bookFlight(flight)}
                                      disabled={bookingFlight === flight.id}
                                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-2 font-medium"
                                    >
                                      {bookingFlight === flight.id ? (
                                        <>
                                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                                          Reservando...
                                        </>
                                      ) : (
                                        <>
                                          Reservar
                                          <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="inline-flex items-center space-x-3 bg-gray-50 px-6 py-4 rounded-2xl">
                <Search className="h-6 w-6 animate-spin text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Buscando vuelos...</p>
                  <p className="text-sm text-gray-600">Comparando precios en tiempo real</p>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="bookings">
          <Card className="border-gray-200 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-medium tracking-tighter">Mis Reservas</CardTitle>
              <CardDescription className="text-base font-light">Historial de reservas de vuelos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reservas aún</h3>
                <p className="text-gray-600 font-light">Tus reservas aparecerán aquí una vez que reserves un vuelo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
