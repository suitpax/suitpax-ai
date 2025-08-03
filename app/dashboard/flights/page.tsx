"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  FunnelIcon,
  StarIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Interfaces existentes...
interface DuffelAirport {
  id: string
  name: string
  iata_code: string
  city_name: string
  country_name: string
}

interface DuffelOffer {
  id: string
  slices: Array<{
    segments: Array<{
      aircraft: { name: string }
      airline: { name: string; iata_code: string }
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
  conditions: {
    change_before_departure?: any
    refund_before_departure?: any
  }
}

// Nueva interface para pasajeros
interface PassengerData {
  title: string
  given_name: string
  family_name: string
  born_on: string
  email: string
  phone_number: string
  type: 'adult' | 'child' | 'infant_without_seat'
  index: number
}

// Nueva interface para filtros
interface SearchFilters {
  maxPrice: number
  airlines: string[]
  maxStops: string
  departureTime: string
}

export default function FlightsPage() {
  // Estados existentes...
  const [searchParams, setSearchParams] = useState({
    origin: "JFK",
    destination: "LHR", 
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "one_way"
  })
  
  const [offers, setOffers] = useState<DuffelOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  
  // NUEVOS ESTADOS - Agregar después de los existentes
  const [user, setUser] = useState<any>(null)
  const [showPassengerForm, setShowPassengerForm] = useState(false)
  const [passengerData, setPassengerData] = useState<PassengerData[]>([])
  const [selectedOfferForBooking, setSelectedOfferForBooking] = useState<string | null>(null)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 5000,
    airlines: [],
    maxStops: "any",
    departureTime: "any"
  })

  const supabase = createClient()
  const router = useRouter()

  // Estados existentes continúan...
  const [searchResults, setSearchResults] = useState({
    origin: [] as DuffelAirport[],
    destination: [] as DuffelAirport[]
  })
  // ... resto de estados existentes

// Agregar después de los useEffects existentes

// Nuevo useEffect para obtener usuario
useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      loadSavedSearches(user.id)
    }
  }
  getUser()
}, [])

// Función para cargar búsquedas guardadas
const loadSavedSearches = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    setSavedSearches(data || [])
  } catch (error) {
    console.error('Error loading saved searches:', error)
  }
}

// Función para guardar búsqueda
const saveSearch = async () => {
  if (!user) return

  try {
    await supabase.from('saved_searches').insert({
      user_id: user.id,
      search_params: searchParams,
      name: `${searchParams.origin} → ${searchParams.destination}`,
      created_at: new Date().toISOString()
    })
    
    showToast('success', "Search saved successfully")
    loadSavedSearches(user.id)
  } catch (error) {
    console.error('Error saving search:', error)
    showToast('error', "Failed to save search")
  }
}

// REEMPLAZAR la función handleBookFlight existente con esta nueva versión

const handleBookFlight = async (offerId: string) => {
  if (!user) {
    showToast('error', "Please log in to book flights")
    router.push('/auth/login')
    return
  }

  const offer = offers.find(o => o.id === offerId)
  if (!offer) return

  // Configurar datos de pasajeros basado en la cantidad
  const initialPassengers: PassengerData[] = Array.from({ length: searchParams.passengers }, (_, index) => ({
    title: 'Mr',
    given_name: '',
    family_name: '',
    born_on: '',
    email: user.email || '',
    phone_number: '',
    type: 'adult' as const,
    index
  }))

  setPassengerData(initialPassengers)
  setSelectedOfferForBooking(offerId)
  setShowPassengerForm(true)
}

// Función para procesar la reserva real
const processBooking = async () => {
  if (!selectedOfferForBooking || !passengerData.length) return

  // Validar datos de pasajeros
  const isValid = passengerData.every(p => 
    p.given_name && p.family_name && p.born_on && p.email
  )

  if (!isValid) {
    showToast('error', "Please fill in all passenger information")
    return
  }

  setLoading(true)

  try {
    const bookingData = {
      offerId: selectedOfferForBooking,
      passengers: passengerData.map(p => ({
        title: p.title,
        given_name: p.given_name,
        family_name: p.family_name,
        born_on: p.born_on,
        email: p.email,
        phone_number: p.phone_number,
        type: p.type
      }))
    }

    const response = await fetch('/api/duffel/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })

    const data = await response.json()

    if (data.success) {
      showToast('success', `Flight booked successfully! Reference: ${data.order.booking_reference}`)
      setShowPassengerForm(false)
      setSelectedOfferForBooking(null)
      
      // Redirigir a página de confirmación o dashboard
      router.push(`/dashboard/bookings/${data.order.id}`)
    } else {
      showToast('error', data.error || "Booking failed")
    }
  } catch (error) {
    console.error("Booking error:", error)
    showToast('error', "Error processing booking. Please try again.")
  } finally {
    setLoading(false)
  }
}

// Función para aplicar filtros - Agregar después de las funciones existentes
const applyFilters = (filteredOffers: DuffelOffer[]) => {
  let filtered = [...filteredOffers]

  // Filtro por precio máximo
  if (filters.maxPrice < 5000) {
    filtered = filtered.filter(offer => 
      parseFloat(offer.total_amount) <= filters.maxPrice
    )
  }

  // Filtro por aerolíneas
  if (filters.airlines.length > 0) {
    filtered = filtered.filter(offer => {
      const airline = offer.slices[0]?.segments[0]?.airline?.iata_code
      return filters.airlines.includes(airline)
    })
  }

  // Filtro por paradas
  if (filters.maxStops !== "any") {
    const maxStops = parseInt(filters.maxStops)
    filtered = filtered.filter(offer => {
      const stops = offer.slices[0]?.segments?.length - 1 || 0
      return stops <= maxStops
    })
  }

  // Filtro por hora de salida
  if (filters.departureTime !== "any") {
    filtered = filtered.filter(offer => {
      const departureTime = new Date(offer.slices[0]?.segments[0]?.departing_at)
      const hour = departureTime.getHours()
      
      switch (filters.departureTime) {
        case "morning": return hour >= 6 && hour < 12
        case "afternoon": return hour >= 12 && hour < 18
        case "evening": return hour >= 18 && hour < 24
        case "night": return hour >= 0 && hour < 6
        default: return true
      }
    })
  }

  return filtered
}

// Componente de formulario de pasajeros - Agregar antes del return principal
const PassengerForm = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium tracking-tighter">Passenger Information</h2>
          <p className="text-sm text-gray-600">Enter details for all passengers</p>
        </div>
        <button
          onClick={() => setShowPassengerForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        {passengerData.map((passenger, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Passenger {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Title</Label>
                <Select
                  value={passenger.title}
                  onValueChange={(value) => {
                    const updated = [...passengerData]
                    updated[index].title = value
                    setPassengerData(updated)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>First Name</Label>
                <Input
                  value={passenger.given_name}
                  onChange={(e) => {
                    const updated = [...passengerData]
                    updated[index].given_name = e.target.value
                    setPassengerData(updated)
                  }}
                  placeholder="First name"
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  value={passenger.family_name}
                  onChange={(e) => {
                    const updated = [...passengerData]
                    updated[index].family_name = e.target.value
                    setPassengerData(updated)
                  }}
                  placeholder="Last name"
                />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={passenger.born_on}
                  onChange={(e) => {
                    const updated = [...passengerData]
                    updated[index].born_on = e.target.value
                    setPassengerData(updated)
                  }}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => {
                    const updated = [...passengerData]
                    updated[index].email = e.target.value
                    setPassengerData(updated)
                  }}
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={passenger.phone_number}
                  onChange={(e) => {
                    const updated = [...passengerData]
                    updated[index].phone_number = e.target.value
                    setPassengerData(updated)
                  }}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => setShowPassengerForm(false)}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={processBooking}
          disabled={loading}
          className="flex-1 bg-black text-white hover:bg-gray-800"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  </motion.div>
)

// Panel de filtros - Agregar después del componente PassengerForm
const FiltersPanel = () => (
  showFiltersPanel && (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-40 p-6"
    >
      <h3 className="text-lg font-medium mb-4">Filter Results</h3>
      
      <div className="space-y-6">
        <div>
          <Label>Max Price: ${filters.maxPrice}</Label>
          <input
            type="range"
            min="100"
            max="5000"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div>
          <Label>Max Stops</Label>
          <Select
            value={filters.maxStops}
            onValueChange={(value) => setFilters(prev => ({ ...prev, maxStops: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="0">Non-stop</SelectItem>
              <SelectItem value="1">1 stop</SelectItem>
              <SelectItem value="2">2+ stops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Departure Time</Label>
          <Select
            value={filters.departureTime}
            onValueChange={(value) => setFilters(prev => ({ ...prev, departureTime: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="morning">Morning (6-12)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12-18)</SelectItem>
              <SelectItem value="evening">Evening (18-24)</SelectItem>
              <SelectItem value="night">Night (0-6)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setShowFiltersPanel(false)}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          Apply Filters
        </Button>
      </div>
    </motion.div>
  )
)

// REEMPLAZAR el botón de filtros existente en el header con:
<div className="flex items-center space-x-2">
  <Button
    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
    variant="outline"
    className="rounded-xl border-gray-200 hover:bg-gray-50"
  >
    <FunnelIcon className="h-4 w-4 mr-2" />
    Filters
  </Button>
  {user && (
    <Button
      onClick={saveSearch}
      variant="outline"
      className="rounded-xl border-gray-200 hover:bg-gray-50"
    >
      Save Search
    </Button>
  )}
</div>

// AGREGAR al final del JSX, justo antes del cierre del div principal:

      {/* Passenger Form Modal */}
      {showPassengerForm && <PassengerForm />}

      {/* Filters Panel */}
      <FiltersPanel />

      {/* Backdrop for filters */}
      {showFiltersPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setShowFiltersPanel(false)}
        />
      )}
    </div>
  )
}

