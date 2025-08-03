"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  BookmarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plane, Users, Calendar, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Interfaces
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

interface SearchFilters {
  maxPrice: number
  airlines: string[]
  maxStops: string
  departureTime: string
}

interface SavedSearch {
  id: string
  user_id: string
  search_params: any
  name: string
  created_at: string
}

interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  passengers: number
  cabinClass: string
  tripType: string
}

export default function FlightsPage() {
  // Estados principales
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: "JFK",
    destination: "LHR", 
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "one_way"
  })
  
  // Estados de ofertas y búsqueda
  const [offers, setOffers] = useState<DuffelOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<DuffelOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  
  // Estados de usuario y autenticación
  const [user, setUser] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(true)
  
  // Estados de reserva
  const [showPassengerForm, setShowPassengerForm] = useState(false)
  const [passengerData, setPassengerData] = useState<PassengerData[]>([])
  const [selectedOfferForBooking, setSelectedOfferForBooking] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  
  // Estados de UI
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [favoriteOffers, setFavoriteOffers] = useState<string[]>([])
  
  // Estados de filtros
  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 5000,
    airlines: [],
    maxStops: "any",
    departureTime: "any"
  })

  // Estados de búsqueda de aeropuertos
  const [searchResults, setSearchResults] = useState({
    origin: [] as DuffelAirport[],
    destination: [] as DuffelAirport[]
  })
  const [showOriginResults, setShowOriginResults] = useState(false)
  const [showDestinationResults, setShowDestinationResults] = useState(false)

  // Hooks
  const supabase = createClient()
  const router = useRouter()

  // Función helper para mostrar toast
  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    if (type === 'success') {
      toast.success(message)
    } else if (type === 'error') {
      toast.error(message)
    } else {
      toast(message)
    }
  }, [])

// Effect para obtener usuario
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        
        setUser(user)
        if (user) {
          await Promise.all([
            loadSavedSearches(user.id),
            loadFavoriteOffers(user.id)
          ])
        }
      } catch (error) {
        console.error('Error loading user:', error)
        showToast('error', 'Error loading user data')
      } finally {
        setUserLoading(false)
      }
    }
    getUser()
  }, [supabase.auth, showToast])

  // Effect para aplicar filtros
  useEffect(() => {
    const filtered = applyFilters(offers)
    setFilteredOffers(filtered)
  }, [offers, filters])

  // Función para cargar búsquedas guardadas
  const loadSavedSearches = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      setSavedSearches(data || [])
    } catch (error) {
      console.error('Error loading saved searches:', error)
    }
  }

  // Función para cargar ofertas favoritas
  const loadFavoriteOffers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorite_offers')
        .select('offer_id')
        .eq('user_id', userId)
      
      if (error) throw error
      setFavoriteOffers(data?.map(item => item.offer_id) || [])
    } catch (error) {
      console.error('Error loading favorite offers:', error)
    }
  }

  // Función para guardar búsqueda
  const saveSearch = async () => {
    if (!user) {
      showToast('error', 'Please log in to save searches')
      return
    }

    try {
      const { error } = await supabase.from('saved_searches').insert({
        user_id: user.id,
        search_params: searchParams,
        name: `${searchParams.origin} → ${searchParams.destination}`,
        created_at: new Date().toISOString()
      })
      
      if (error) throw error
      
      showToast('success', "Search saved successfully")
      await loadSavedSearches(user.id)
    } catch (error) {
      console.error('Error saving search:', error)
      showToast('error', "Failed to save search")
    }
  }

  // Función para toggle favorito
  const toggleFavorite = async (offerId: string) => {
    if (!user) {
      showToast('error', 'Please log in to save favorites')
      return
    }

    const isFavorite = favoriteOffers.includes(offerId)
    
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_offers')
          .delete()
          .eq('user_id', user.id)
          .eq('offer_id', offerId)
        
        if (error) throw error
        setFavoriteOffers(prev => prev.filter(id => id !== offerId))
        showToast('success', 'Removed from favorites')
      } else {
        const { error } = await supabase
          .from('favorite_offers')
          .insert({ user_id: user.id, offer_id: offerId })
        
        if (error) throw error
        setFavoriteOffers(prev => [...prev, offerId])
        showToast('success', 'Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      showToast('error', 'Failed to update favorites')
    }
  }

// Función para buscar aeropuertos
  const searchAirports = async (query: string, type: 'origin' | 'destination') => {
    if (query.length < 2) {
      setSearchResults(prev => ({ ...prev, [type]: [] }))
      return
    }

    try {
      const response = await fetch(`/api/duffel/airports?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(prev => ({ ...prev, [type]: data.airports }))
      }
    } catch (error) {
      console.error('Error searching airports:', error)
    }
  }

  // Función para seleccionar aeropuerto
  const selectAirport = (airport: DuffelAirport, type: 'origin' | 'destination') => {
    setSearchParams(prev => ({ ...prev, [type]: airport.iata_code }))
    setSearchResults(prev => ({ ...prev, [type]: [] }))
    
    if (type === 'origin') {
      setShowOriginResults(false)
    } else {
      setShowDestinationResults(false)
    }
  }

  // Función para buscar vuelos
  const searchFlights = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      showToast('error', 'Please fill in all required fields')
      return
    }

    if (searchParams.tripType === 'round_trip' && !searchParams.returnDate) {
      showToast('error', 'Please select a return date for round trip')
      return
    }

    setSearching(true)
    setOffers([])

    try {
      const searchData = {
  origin: searchParams.origin,
  destination: searchParams.destination,
  departureDate: searchParams.departureDate,
  returnDate: searchParams.tripType === 'round_trip' ? searchParams.returnDate : undefined,
  passengers: searchParams.passengers,
  cabinClass: searchParams.cabinClass
}

      const response = await fetch('/api/duffel/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      })

      const data = await response.json()

      if (data.success) {
        setOffers(data.offers || [])
        showToast('success', `Found ${data.offers?.length || 0} flights`)
      } else {
        showToast('error', data.error || 'No flights found')
      }
    } catch (error) {
      console.error('Search error:', error)
      showToast('error', 'Error searching flights. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  // Función para intercambiar origen y destino
  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }))
  }

  // Función para aplicar filtros
  const applyFilters = useCallback((offersToFilter: DuffelOffer[]) => {
    let filtered = [...offersToFilter]

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
        return airline && filters.airlines.includes(airline)
      })
    }

    // Filtro por paradas
    if (filters.maxStops !== "any") {
      const maxStops = parseInt(filters.maxStops)
      filtered = filtered.filter(offer => {
        const stops = (offer.slices[0]?.segments?.length || 1) - 1
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
  }, [filters])

// Función para iniciar reserva
  const handleBookFlight = async (offerId: string) => {
    if (!user) {
      showToast('error', "Please log in to book flights")
      router.push('/auth/login')
      return
    }

    const offer = offers.find(o => o.id === offerId)
    if (!offer) {
      showToast('error', 'Offer not found')
      return
    }

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

  // Función para procesar la reserva
  const processBooking = async () => {
    if (!selectedOfferForBooking || !passengerData.length) {
      showToast('error', 'Missing booking data')
      return
    }

    // Validar datos de pasajeros
    const isValid = passengerData.every(p => 
      p.given_name.trim() && 
      p.family_name.trim() && 
      p.born_on && 
      p.email.trim() &&
      /\S+@\S+\.\S+/.test(p.email) // Validación básica de email
    )

    if (!isValid) {
      showToast('error', "Please fill in all required passenger information with valid data")
      return
    }

    setBookingLoading(true)

    try {
      const bookingData = {
        offerId: selectedOfferForBooking,
        passengers: passengerData.map(p => ({
          title: p.title,
          given_name: p.given_name.trim(),
          family_name: p.family_name.trim(),
          born_on: p.born_on,
          email: p.email.trim(),
          phone_number: p.phone_number.trim(),
          type: p.type
        }))
      }

      const response = await fetch('/api/duffel/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        showToast('success', `Flight booked successfully! Reference: ${data.order.booking_reference}`)
        setShowPassengerForm(false)
        setSelectedOfferForBooking(null)
        setPassengerData([])
        
        // Redirigir a página de confirmación
        router.push(`/dashboard/bookings/${data.order.id}`)
      } else {
        showToast('error', data.error || "Booking failed. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      showToast('error', "Error processing booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  // Función para cargar búsqueda guardada
  const loadSavedSearch = (search: SavedSearch) => {
    setSearchParams(search.search_params)
    showToast('info', `Loaded search: ${search.name}`)
  }

  // Función para formatear duración
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/)
    if (!match) return duration
    
    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    
    return `${hours}h ${minutes}m`
  }

  // Función para formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  // Función para actualizar datos de pasajero
  const updatePassengerData = (index: number, field: keyof PassengerData, value: string) => {
    setPassengerData(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

// Componente de formulario de pasajeros
  const PassengerForm = () => (
    <AnimatePresence>
      {showPassengerForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Passenger Information</h2>
                <p className="text-sm text-gray-600 mt-1">Enter details for all passengers</p>
              </div>
              <button
                onClick={() => setShowPassengerForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {passengerData.map((passenger, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Passenger {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`title-${index}`} className="text-sm font-medium text-gray-700">
                          Title *
                        </Label>
                        <Select
                          value={passenger.title}
                          onValueChange={(value) => updatePassengerData(index, 'title', value)}
                        >
                          <SelectTrigger className="mt-1">
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
                        <Label htmlFor={`given_name-${index}`} className="text-sm font-medium text-gray-700">
                          First Name *
                        </Label>
                        <Input
                          id={`given_name-${index}`}
                          value={passenger.given_name}
                          onChange={(e) => updatePassengerData(index, 'given_name', e.target.value)}
                          placeholder="First name"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`family_name-${index}`} className="text-sm font-medium text-gray-700">
                          Last Name *
                        </Label>
                        <Input
                          id={`family_name-${index}`}
                          value={passenger.family_name}
                          onChange={(e) => updatePassengerData(index, 'family_name', e.target.value)}
                          placeholder="Last name"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`born_on-${index}`} className="text-sm font-medium text-gray-700">
                          Date of Birth *
                        </Label>
                        <Input
                          id={`born_on-${index}`}
                          type="date"
                          value={passenger.born_on}
                          onChange={(e) => updatePassengerData(index, 'born_on', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`email-${index}`} className="text-sm font-medium text-gray-700">
                          Email *
                        </Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassengerData(index, 'email', e.target.value)}
                          placeholder="Email address"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`phone-${index}`} className="text-sm font-medium text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          id={`phone-${index}`}
                          value={passenger.phone_number}
                          onChange={(e) => updatePassengerData(index, 'phone_number', e.target.value)}
                          placeholder="Phone number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => setShowPassengerForm(false)}
                variant="outline"
                className="flex-1"
                disabled={bookingLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={processBooking}
                disabled={bookingLoading}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

// Panel de filtros
  const FiltersPanel = () => (
    <AnimatePresence>
      {showFiltersPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-30"
            onClick={() => setShowFiltersPanel(false)}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">

