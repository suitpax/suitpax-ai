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
import { Hotel, CalendarIcon, Search, Filter, Star, Wifi, Coffee, Car, Utensils, Dumbbell } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface HotelSearchParams {
  destination: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  guests: number
  rooms: number
}

interface HotelResult {
  id: string
  name: string
  address: string
  city: string
  rating: number
  price: number
  originalPrice?: number
  currency: string
  amenities: string[]
  images: string[]
  description: string
  distance: string
  cancellation: "free" | "partial" | "none"
}

const SAMPLE_HOTELS: HotelResult[] = [
  {
    id: "1",
    name: "Hotel Marriott Madrid",
    address: "Calle de Alcalá, 164",
    city: "Madrid",
    rating: 4.5,
    price: 189,
    originalPrice: 220,
    currency: "EUR",
    amenities: ["wifi", "gym", "restaurant", "parking", "spa"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Elegante hotel de negocios en el centro de Madrid con todas las comodidades modernas.",
    distance: "0.5 km del centro",
    cancellation: "free",
  },
  {
    id: "2",
    name: "AC Hotel by Marriott",
    address: "Calle de Ríos Rosas, 52",
    city: "Madrid",
    rating: 4.3,
    price: 156,
    currency: "EUR",
    amenities: ["wifi", "gym", "restaurant", "business"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Hotel moderno perfecto para viajeros de negocios con excelente conectividad.",
    distance: "1.2 km del centro",
    cancellation: "free",
  },
  {
    id: "3",
    name: "NH Collection Madrid",
    address: "Paseo del Prado, 48",
    city: "Madrid",
    rating: 4.7,
    price: 245,
    originalPrice: 280,
    currency: "EUR",
    amenities: ["wifi", "spa", "restaurant", "parking", "concierge"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Hotel de lujo ubicado en el corazón cultural de Madrid, cerca de los principales museos.",
    distance: "0.3 km del centro",
    cancellation: "partial",
  },
]

const POPULAR_DESTINATIONS = [
  { code: "MAD", city: "Madrid", country: "España" },
  { code: "BCN", city: "Barcelona", country: "España" },
  { code: "LON", city: "Londres", country: "Reino Unido" },
  { code: "PAR", city: "París", country: "Francia" },
  { code: "BER", city: "Berlín", country: "Alemania" },
  { code: "ROM", city: "Roma", country: "Italia" },
]

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useState<HotelSearchParams>({
    destination: "",
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    rooms: 1,
  })
  const [hotels, setHotels] = useState<HotelResult[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [bookingHotel, setBookingHotel] = useState<string | null>(null)
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

  const searchHotels = async () => {
    if (!searchParams.destination || !searchParams.checkIn || !searchParams.checkOut) {
      toast.error("Por favor, completa todos los campos obligatorios")
      return
    }

    if (searchParams.checkIn >= searchParams.checkOut) {
      toast.error("La fecha de salida debe ser posterior a la fecha de entrada")
      return
    }

    setLoading(true)

    // Simular búsqueda de hoteles
    setTimeout(() => {
      setHotels(SAMPLE_HOTELS)
      setLoading(false)
      toast.success(`${SAMPLE_HOTELS.length} hoteles encontrados`)
    }, 2000)
  }

  const bookHotel = async (hotel: HotelResult) => {
    if (!user) {
      toast.error("Debes iniciar sesión para reservar")
      return
    }

    setBookingHotel(hotel.id)

    try {
      const nights = Math.ceil(
        (searchParams.checkOut!.getTime() - searchParams.checkIn!.getTime()) / (1000 * 60 * 60 * 24),
      )
      const totalPrice = hotel.price * nights * searchParams.rooms

      const { error } = await supabase.from("hotel_bookings").insert({
        user_id: user.id,
        hotel_name: hotel.name,
        hotel_address: hotel.address,
        city: hotel.city,
        check_in_date: searchParams.checkIn?.toISOString().split("T")[0],
        check_out_date: searchParams.checkOut?.toISOString().split("T")[0],
        guests: searchParams.guests,
        rooms: searchParams.rooms,
        nights: nights,
        price_per_night: hotel.price,
        total_price: totalPrice,
        currency: hotel.currency,
        status: "pending",
        booking_data: hotel,
      })

      if (error) throw error

      toast.success("¡Hotel reservado exitosamente! Recibirás un email de confirmación.")

      // Crear gasto automáticamente
      await supabase.from("expenses").insert({
        user_id: user.id,
        title: `Hotel ${hotel.name}`,
        description: `${nights} noches en ${hotel.city}`,
        amount: totalPrice,
        category: "Alojamiento",
        expense_date: searchParams.checkIn?.toISOString().split("T")[0],
        status: "submitted",
      })
    } catch (error) {
      console.error("Error al reservar hotel:", error)
      toast.error("Error al reservar el hotel. Inténtalo de nuevo.")
    } finally {
      setBookingHotel(null)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "gym":
        return <Dumbbell className="h-4 w-4" />
      case "restaurant":
        return <Utensils className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "spa":
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  const calculateNights = () => {
    if (searchParams.checkIn && searchParams.checkOut) {
      return Math.ceil((searchParams.checkOut.getTime() - searchParams.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Hotel className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-medium tracking-tighter">Reserva de Hoteles</h1>
            <p className="text-green-100 mt-1">Encuentra y reserva alojamiento para tus viajes de negocio</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Buscar Hoteles</TabsTrigger>
          <TabsTrigger value="bookings">Mis Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Hoteles
              </CardTitle>
              <CardDescription>Encuentra el alojamiento perfecto para tu viaje de negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Select
                    value={searchParams.destination}
                    onValueChange={(value) => setSearchParams((prev) => ({ ...prev, destination: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_DESTINATIONS.map((dest) => (
                        <SelectItem key={dest.code} value={dest.city}>
                          {dest.city}, {dest.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Huéspedes y habitaciones</Label>
                  <div className="flex gap-2">
                    <Select
                      value={searchParams.guests.toString()}
                      onValueChange={(value) =>
                        setSearchParams((prev) => ({ ...prev, guests: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} huésped{num > 1 ? "es" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={searchParams.rooms.toString()}
                      onValueChange={(value) => setSearchParams((prev) => ({ ...prev, rooms: Number.parseInt(value) }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} habitación{num > 1 ? "es" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de entrada</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.checkIn && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.checkIn ? (
                          format(searchParams.checkIn, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.checkIn}
                        onSelect={(date) => setSearchParams((prev) => ({ ...prev, checkIn: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Fecha de salida</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchParams.checkOut && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.checkOut ? (
                          format(searchParams.checkOut, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchParams.checkOut}
                        onSelect={(date) => setSearchParams((prev) => ({ ...prev, checkOut: date }))}
                        disabled={(date) => date <= (searchParams.checkIn || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {calculateNights() > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Duración: {calculateNights()} noche{calculateNights() > 1 ? "s" : ""}
                  </p>
                </div>
              )}

              <Button onClick={searchHotels} className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Buscando hoteles...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar hoteles
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Hotel Results */}
          {hotels.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium tracking-tighter">
                  Resultados de búsqueda ({hotels.length} hoteles)
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>

              {hotels.map((hotel) => (
                <Card key={hotel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      {/* Hotel Image */}
                      <div className="md:col-span-1">
                        <img
                          src={hotel.images[0] || "/placeholder.svg"}
                          alt={hotel.name}
                          className="w-full h-48 md:h-32 object-cover rounded-xl"
                        />
                      </div>

                      {/* Hotel Info */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium tracking-tighter">{hotel.name}</h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-sm text-gray-600">{hotel.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{hotel.address}</p>
                          <p className="text-xs text-gray-500">{hotel.distance}</p>
                        </div>

                        <p className="text-sm text-gray-700">{hotel.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                              {getAmenityIcon(amenity)}
                              <span className="capitalize">{amenity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              hotel.cancellation === "free"
                                ? "text-green-700 border-green-200"
                                : hotel.cancellation === "partial"
                                  ? "text-yellow-700 border-yellow-200"
                                  : "text-red-700 border-red-200"
                            }
                          >
                            {hotel.cancellation === "free"
                              ? "Cancelación gratuita"
                              : hotel.cancellation === "partial"
                                ? "Cancelación parcial"
                                : "Sin cancelación"}
                          </Badge>
                        </div>
                      </div>

                      {/* Price and Booking */}
                      <div className="md:col-span-1 text-right space-y-3">
                        <div>
                          {hotel.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">€{hotel.originalPrice}</p>
                          )}
                          <p className="text-2xl font-bold text-green-600">€{hotel.price}</p>
                          <p className="text-xs text-gray-600">por noche</p>
                          {calculateNights() > 0 && (
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              Total: €{hotel.price * calculateNights() * searchParams.rooms}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => bookHotel(hotel)}
                          disabled={bookingHotel === hotel.id}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {bookingHotel === hotel.id ? "Reservando..." : "Reservar"}
                        </Button>
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
              <CardTitle>Mis Reservas de Hotel</CardTitle>
              <CardDescription>Historial de reservas de alojamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tienes reservas de hotel aún</p>
                <p className="text-sm text-gray-500 mt-1">Tus reservas aparecerán aquí una vez que reserves un hotel</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
