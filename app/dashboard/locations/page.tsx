"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Search,
  Star,
  Plane,
  Hotel,
  Car,
  Utensils,
  Coffee,
  Wifi,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Building,
} from "lucide-react"

interface Location {
  id: string
  name: string
  city: string
  country: string
  type: "office" | "hotel" | "airport" | "restaurant" | "coworking"
  address: string
  rating: number
  visits: number
  lastVisit?: string
  notes?: string
  amenities: string[]
  coordinates: { lat: number; lng: number }
  averageCost?: number
  preferredBy: string[]
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchUser()
    fetchLocations()
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

  const fetchLocations = async () => {
    try {
      // Sample locations data - in a real app, this would come from your database
      const sampleLocations: Location[] = [
        {
          id: "1",
          name: "Oficina Central Madrid",
          city: "Madrid",
          country: "España",
          type: "office",
          address: "Calle de Alcalá, 42, 28014 Madrid",
          rating: 4.8,
          visits: 25,
          lastVisit: "2025-01-15",
          notes: "Oficina principal con todas las facilidades",
          amenities: ["wifi", "parking", "cafeteria", "salas_reunion"],
          coordinates: { lat: 40.4168, lng: -3.7038 },
          preferredBy: ["Ana García", "Carlos Rodríguez"],
        },
        {
          id: "2",
          name: "Hotel Marriott Madrid",
          city: "Madrid",
          country: "España",
          type: "hotel",
          address: "Calle de Ríos Rosas, 52, 28003 Madrid",
          rating: 4.5,
          visits: 8,
          lastVisit: "2025-01-10",
          notes: "Excelente ubicación para reuniones de negocios",
          amenities: ["wifi", "gym", "spa", "restaurant", "business_center"],
          coordinates: { lat: 40.4378, lng: -3.6795 },
          averageCost: 189,
          preferredBy: ["María López"],
        },
        {
          id: "3",
          name: "Aeropuerto Madrid-Barajas",
          city: "Madrid",
          country: "España",
          type: "airport",
          address: "Av. de la Hispanidad, s/n, 28042 Madrid",
          rating: 4.2,
          visits: 15,
          lastVisit: "2025-01-20",
          notes: "Terminal 4 - Vuelos internacionales",
          amenities: ["wifi", "lounges", "shopping", "restaurants"],
          coordinates: { lat: 40.4719, lng: -3.5626 },
          preferredBy: ["Ana García", "Juan Martín"],
        },
        {
          id: "4",
          name: "Restaurante DiverXO",
          city: "Madrid",
          country: "España",
          type: "restaurant",
          address: "Calle de Padre Damián, 23, 28036 Madrid",
          rating: 4.9,
          visits: 3,
          lastVisit: "2024-12-15",
          notes: "Restaurante estrella Michelin - Reservar con anticipación",
          amenities: ["fine_dining", "wine_cellar", "private_rooms"],
          coordinates: { lat: 40.4378, lng: -3.6795 },
          averageCost: 250,
          preferredBy: ["Carlos Rodríguez"],
        },
        {
          id: "5",
          name: "WeWork Castellana",
          city: "Madrid",
          country: "España",
          type: "coworking",
          address: "Paseo de la Castellana, 77, 28046 Madrid",
          rating: 4.6,
          visits: 12,
          lastVisit: "2025-01-18",
          notes: "Espacio de coworking moderno con excelentes facilidades",
          amenities: ["wifi", "coffee", "meeting_rooms", "printing"],
          coordinates: { lat: 40.4378, lng: -3.6795 },
          averageCost: 45,
          preferredBy: ["María López", "Ana García"],
        },
      ]

      setLocations(sampleLocations)
    } catch (error) {
      console.error("Error fetching locations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "office":
        return <Building className="h-5 w-5 text-blue-600" />
      case "hotel":
        return <Hotel className="h-5 w-5 text-green-600" />
      case "airport":
        return <Plane className="h-5 w-5 text-purple-600" />
      case "restaurant":
        return <Utensils className="h-5 w-5 text-orange-600" />
      case "coworking":
        return <Coffee className="h-5 w-5 text-teal-600" />
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />
    }
  }

  const getLocationBadge = (type: string) => {
    switch (type) {
      case "office":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Oficina</Badge>
      case "hotel":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Hotel</Badge>
      case "airport":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Aeropuerto</Badge>
      case "restaurant":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Restaurante</Badge>
      case "coworking":
        return <Badge className="bg-teal-100 text-teal-800 border-teal-200">Coworking</Badge>
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "gym":
        return <TrendingUp className="h-4 w-4" />
      case "restaurant":
        return <Utensils className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      case "business_center":
        return <Building className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const locationsByType = (type: string) => filteredLocations.filter((location) => location.type === type)

  const totalLocations = locations.length
  const totalVisits = locations.reduce((sum, loc) => sum + loc.visits, 0)
  const averageRating = locations.reduce((sum, loc) => sum + loc.rating, 0) / locations.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-medium tracking-tighter">Ubicaciones Favoritas</h1>
              <p className="text-teal-100 mt-1">Gestiona y descubre los mejores lugares para tus viajes de negocio</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar ubicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ubicaciones</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{totalLocations}</p>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-teal-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitas</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{totalVisits}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rating Promedio</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{averageRating.toFixed(1)}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredLocations.length})</TabsTrigger>
          <TabsTrigger value="offices">Oficinas ({locationsByType("office").length})</TabsTrigger>
          <TabsTrigger value="hotels">Hoteles ({locationsByType("hotel").length})</TabsTrigger>
          <TabsTrigger value="airports">Aeropuertos ({locationsByType("airport").length})</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurantes ({locationsByType("restaurant").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {getLocationIcon(location.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium tracking-tighter">{location.name}</h3>
                          {getLocationBadge(location.type)}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{location.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {location.city}, {location.country}
                        </p>

                        {location.notes && <p className="text-sm text-gray-700 mb-3 italic">"{location.notes}"</p>}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {location.amenities.slice(0, 4).map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                            >
                              {getAmenityIcon(amenity)}
                              <span className="capitalize">{amenity.replace("_", " ")}</span>
                            </div>
                          ))}
                          {location.amenities.length > 4 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              +{location.amenities.length - 4} más
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{location.visits} visitas</span>
                          </div>
                          {location.lastVisit && (
                            <div className="flex items-center gap-1">
                              <span>Última visita: {new Date(location.lastVisit).toLocaleDateString("es-ES")}</span>
                            </div>
                          )}
                          {location.preferredBy.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                Preferido por {location.preferredBy.length} miembro
                                {location.preferredBy.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {location.averageCost && (
                        <div className="mb-2">
                          <p className="text-lg font-medium">€{location.averageCost}</p>
                          <p className="text-xs text-gray-500">promedio</p>
                        </div>
                      )}
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-700 mb-2">No se encontraron ubicaciones</h3>
                <p className="text-sm text-gray-500 mb-4">Intenta con otros términos de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offices">
          <div className="space-y-4">
            {locationsByType("office").map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium tracking-tighter">{location.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Oficina</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{location.visits} visitas</span>
                        <span>•</span>
                        <span>
                          Última visita:{" "}
                          {location.lastVisit ? new Date(location.lastVisit).toLocaleDateString("es-ES") : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hotels">
          <div className="space-y-4">
            {locationsByType("hotel").map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <Hotel className="h-6 w-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium tracking-tighter">{location.name}</h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Hotel</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{location.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{location.visits} estancias</span>
                          <span>•</span>
                          <span>
                            Última visita:{" "}
                            {location.lastVisit ? new Date(location.lastVisit).toLocaleDateString("es-ES") : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium">€{location.averageCost}</p>
                      <p className="text-xs text-gray-500">por noche</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="airports">
          <div className="space-y-4">
            {locationsByType("airport").map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Plane className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium tracking-tighter">{location.name}</h3>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">Aeropuerto</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{location.visits} vuelos</span>
                        <span>•</span>
                        <span>
                          Último vuelo:{" "}
                          {location.lastVisit ? new Date(location.lastVisit).toLocaleDateString("es-ES") : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restaurants">
          <div className="space-y-4">
            {locationsByType("restaurant").map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Utensils className="h-6 w-6 text-orange-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium tracking-tighter">{location.name}</h3>
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">Restaurante</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{location.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{location.visits} visitas</span>
                          <span>•</span>
                          <span>
                            Última visita:{" "}
                            {location.lastVisit ? new Date(location.lastVisit).toLocaleDateString("es-ES") : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium">€{location.averageCost}</p>
                      <p className="text-xs text-gray-500">promedio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
