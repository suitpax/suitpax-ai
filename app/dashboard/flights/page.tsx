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
import { Plane, CalendarIcon, Search, Filter, Star, Wifi, Coffee, Utensils } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface FlightSearchParams {
  from: string
  to: string
  departureDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  class: string
}

interface FlightResult {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
  }
  arrival: {
    airport: string
    city: string
    time: string
  }
  duration: string
  price: number
  class: string
  amenities: string[]
  stops: number
}

// Datos de ejemplo de vuelos
const SAMPLE_FLIGHTS: FlightResult[] = [
  {
    id: "1",
    airline: "Iberia",
    flightNumber: "IB3201",
    departure: { airport: "MAD", city: "Madrid", time: "08:30" },
    arrival: { airport: "LHR", city: "Londres", time: "10:15" },
    duration: "2h 45m",
    price: 245,
    class: "economy",
    amenities: ["wifi", "meal", "entertainment"],
    stops: 0,
  },
  {
    id: "2",
    airline: "British Airways",
    flightNumber: "BA461",
    departure: { airport: "MAD", city: "Madrid", time: "14:20" },
    arrival: { airport: "LHR", city: "Londres", time: "16:05" },
    duration: "2h 45m",
    price: 289,
    class: "economy",
    amenities: ["wifi", "meal", "lounge"],
    stops: 0,
  },
  {
    id: "3",
    airline: "Lufthansa",
    flightNumber: "LH1110",
    departure: { airport: "MAD", city: "Madrid", time: "11:15" },
    arrival: { airport: "LHR", city: "Londres", time: "15:30" },
    duration: "4h 15m",
    price: 198,
    class: "economy",
    amenities: ["wifi", "snack"],
    stops: 1,
  },
]

const POPULAR_DESTINATIONS = [
  { code: "LHR", city: "Londres", country: "Reino Unido" },
  { code: "CDG", city: "París", country: "Francia" },
  { code: "FRA", city: "Frankfurt", country: "Alemania" },
  { code: "AMS", city: "Ámsterdam", country: "Países Bajos" },
  { code: "ZUR", city: "Zúrich", country: "Suiza" },
  { code: "MXP", city: "Milán", country: "Italia" },
]

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: "",
    to: "",
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    class: "economy",
  })
  const [flights, setFlights] = useState<FlightResult[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [bookingFlight, setBookingFlight] = useState<string | null>(null)
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

    // Simular búsqueda de vuelos
    setTimeout(() => {
      setFlights(SAMPLE_FLIGHTS)
      setLoading(false)
    }, 2000)
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
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Plane className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-medium tracking-tighter">Reserva de Vuelos</h1>
            <p className="text-blue-100 mt-1">Encuentra y reserva vuelos para tus viajes de negocio</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Buscar Vuelos</TabsTrigger>
          <TabsTrigger value="bookings">Mis Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Vuelos
              </CardTitle>
              <CardDescription>Encuentra los mejores vuelos para tu viaje de negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Origen</Label>
                  <Select
                    value={searchParams.from}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, from: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona origen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">Madrid (MAD)</SelectItem>
                      <SelectItem value="BCN">Barcelona (BCN)</SelectItem>
                      <SelectItem value="SVQ">Sevilla (SVQ)</SelectItem>
                      <SelectItem value="VLC">Valencia (VLC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">Destino</Label>
                  <Select
                    value={searchParams.to}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, to: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_DESTINATIONS.map((dest) => (
                        <SelectItem key={dest.code} value={dest.code}>
                          {dest.city} ({dest.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de salida</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.departureDate ? (
                          format(searchParams.departureDate, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
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

                <div className="space-y-2">
                  <Label>Fecha de regreso (opcional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.returnDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.returnDate ? (
                          format(searchParams.returnDate, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
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

                <div className="space-y-2">
                  <Label htmlFor="class">Clase</Label>
                  <Select
                    value={searchParams.class}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, class: value }))}
                  >
                    <SelectTrigger>
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

              <Button onClick={searchFlights} className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Buscando vuelos...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar vuelos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Flight Results */}
          {flights.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium tracking-tighter">
                  Resultados de búsqueda ({flights.length} vuelos)
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>

              {flights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold">{flight.departure.time}</p>
                              <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                              <p className="text-xs text-gray-500">{flight.departure.city}</p>
                            </div>

                            <div className="flex-1 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="h-px bg-gray-300 flex-1"></div>
                                <Plane className="h-4 w-4 text-gray-400" />
                                <div className="h-px bg-gray-300 flex-1"></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{flight.duration}</p>
                              {flight.stops > 0 && <p className="text-xs text-orange-600">{flight.stops} escala(s)</p>}
                            </div>

                            <div className="text-center">
                              <p className="text-2xl font-bold">{flight.arrival.time}</p>
                              <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                              <p className="text-xs text-gray-500">{flight.arrival.city}</p>
                            </div>
                          </div>

                          <div className="text-right space-y-2">
                            <div>
                              <p className="text-2xl font-bold text-green-600">€{flight.price}</p>
                              <p className="text-sm text-gray-600">{flight.airline}</p>
                              <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                            </div>
                            <Button
                              onClick={() => bookFlight(flight)}
                              disabled={bookingFlight === flight.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {bookingFlight === flight.id ? "Reservando..." : "Reservar"}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 pt-2 border-t">
                          <Badge variant="outline" className="text-xs">
                            {flight.class === "economy"
                              ? "Económica"
                              : flight.class === "business"
                                ? "Business"
                                : "Primera"}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            {flight.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center space-x-1 text-gray-600">
                                {getAmenityIcon(amenity)}
                                <span className="text-xs capitalize">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Mis Reservas</CardTitle>
              <CardDescription>Historial de reservas de vuelos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tienes reservas de vuelos aún</p>
                <p className="text-sm text-gray-500 mt-1">Tus reservas aparecerán aquí una vez que reserves un vuelo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
