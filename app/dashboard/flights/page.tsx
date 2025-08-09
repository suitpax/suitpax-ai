'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FlightCard } from '@/components/flights/flight-card'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AirportSearch from '@/components/flights/airport-search'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import type { FlightSearchParams, FlightOffer, FlightSearchResponse } from '@/types/flights'

interface SearchFormData {
  origin: string
  destination: string
  departure_date: string
  return_date: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  cabin_class: 'economy' | 'premium_economy' | 'business' | 'first'
}

interface FormErrors {
  origin?: string
  destination?: string
  departure_date?: string
  return_date?: string
  general?: string
}

export default function FlightsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [offers, setOffers] = useState<FlightOffer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    origin: '',
    destination: '',
    departure_date: '',
    return_date: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    cabin_class: 'economy'
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    // Validar origen
    if (!searchForm.origin) {
      errors.origin = 'Origin airport is required'
    } else if (searchForm.origin.length !== 3) {
      errors.origin = 'Origin must be a valid 3-letter IATA code'
    }
    
    // Validar destino
    if (!searchForm.destination) {
      errors.destination = 'Destination airport is required'
    } else if (searchForm.destination.length !== 3) {
      errors.destination = 'Destination must be a valid 3-letter IATA code'
    }
    
    // Validar mismo origen y destino
    if (searchForm.origin && searchForm.destination && searchForm.origin === searchForm.destination) {
      errors.destination = 'Destination must be different from origin'
    }
    
    // Validar fecha de salida
    if (!searchForm.departure_date) {
      errors.departure_date = 'Departure date is required'
    } else {
      const departureDate = new Date(searchForm.departure_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (departureDate < today) {
        errors.departure_date = 'Departure date cannot be in the past'
      }
    }
    
    // Validar fecha de regreso
    if (searchForm.return_date) {
      if (!searchForm.departure_date) {
        errors.return_date = 'Departure date is required when return date is specified'
      } else {
        const departureDate = new Date(searchForm.departure_date)
        const returnDate = new Date(searchForm.return_date)
        
        if (returnDate <= departureDate) {
          errors.return_date = 'Return date must be after departure date'
        }
      }
    }

    // Validar pasajeros
    const totalPassengers = searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants
    if (totalPassengers === 0) {
      errors.general = 'At least one passenger is required'
    } else if (totalPassengers > 9) {
      errors.general = 'Maximum 9 passengers allowed'
    }

    // Validar infantes vs adultos
    if (searchForm.passengers.infants > searchForm.passengers.adults) {
      errors.general = 'Number of infants cannot exceed number of adults'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSearch = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setSearchPerformed(true)
    
    try {
      const searchData: FlightSearchParams = {
        ...searchForm,
        // Solo enviar return_date si está especificada
        ...(searchForm.return_date ? { return_date: searchForm.return_date } : {})
      }
      
      console.log('Sending search request:', searchData)
      
      const response = await fetch('/api/flights/duffel/flight-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: FlightSearchResponse = await response.json()
      console.log('Search response:', data)
      
      if (data.success && data.data) {
        setOffers(data.data.offers || [])
        
        if (data.cached) {
          toast.info('Results loaded from cache for faster response')
        }
        
        if (data.data.offers?.length === 0) {
          setError('No flights found for your search criteria. Try different dates or airports.')
        } else {
          toast.success(`Found ${data.data.offers.length} flight options`)
        }
      } else {
        setError(data.error || 'Failed to search flights')
        setOffers([])
      }
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching'
      setError(`Search failed: ${errorMessage}. Please try again.`)
      setOffers([])
      toast.error('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFlight = (offerId: string) => {
    router.push(`/dashboard/flights/book/${offerId}`)
  }

  const handleAirportChange = (field: 'origin' | 'destination', code: string) => {
    setSearchForm(prev => ({ ...prev, [field]: code }))
    
    // Limpiar errores relacionados
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const isFormValid = searchForm.origin && searchForm.destination && searchForm.departure_date && Object.keys(formErrors).length === 0

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tighter leading-none">
            <em className="font-serif italic">Book</em>
            <br />
            <span className="text-gray-900">Flights</span>
          </h1>
          <p className="text-sm md:text-base font-light text-gray-600 mt-2">
            Real-time pricing and availability powered by Duffel
          </p>
        </div>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="tracking-tighter">Search Flights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Error */}
            {formErrors.general && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {formErrors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Route Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AirportSearch
                label="From"
                placeholder="Search departure airport..."
                value={searchForm.origin}
                onChange={(code) => handleAirportChange('origin', code)}
                error={formErrors.origin}
              />
              
              <AirportSearch
                label="To"
                placeholder="Search destination airport..."
                value={searchForm.destination}
                onChange={(code) => handleAirportChange('destination', code)}
                error={formErrors.destination}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure">Departure Date</Label>
                <Input
                  id="departure"
                  type="date"
                  value={searchForm.departure_date}
                  onChange={(e) => {
                    setSearchForm(prev => ({ ...prev, departure_date: e.target.value }))
                    if (formErrors.departure_date) {
                      setFormErrors(prev => ({ ...prev, departure_date: undefined }))
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={formErrors.departure_date ? 'border-red-500' : ''}
                />
                {formErrors.departure_date && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.departure_date}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="return">Return Date (optional)</Label>
                <Input
                  id="return"
                  type="date"
                  value={searchForm.return_date}
                  onChange={(e) => {
                    setSearchForm(prev => ({ ...prev, return_date: e.target.value }))
                    if (formErrors.return_date) {
                      setFormErrors(prev => ({ ...prev, return_date: undefined }))
                    }
                  }}
                  min={searchForm.departure_date || new Date().toISOString().split('T')[0]}
                  className={formErrors.return_date ? 'border-red-500' : ''}
                />
                {formErrors.return_date && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.return_date}</p>
                )}
              </div>
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="adults">Adults (18+)</Label>
                <Select 
                  value={searchForm.passengers.adults.toString()}
                  onValueChange={(value) => setSearchForm(prev => ({
                    ...prev,
                    passengers: { ...prev.passengers, adults: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(9)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="children">Children (2-17)</Label>
                <Select 
                  value={searchForm.passengers.children.toString()}
                  onValueChange={(value) => setSearchForm(prev => ({
                    ...prev,
                    passengers: { ...prev.passengers, children: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(9)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="infants">Infants (Under 2)</Label>
                <Select 
                  value={searchForm.passengers.infants.toString()}
                  onValueChange={(value) => setSearchForm(prev => ({
                    ...prev,
                    passengers: { ...prev.passengers, infants: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(searchForm.passengers.adults + 1, 5))].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cabin">Cabin Class</Label>
                <Select 
                  value={searchForm.cabin_class}
                  onValueChange={(value: any) => setSearchForm(prev => ({
                    ...prev,
                    cabin_class: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium_economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              disabled={!isFormValid || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search Flights
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {searchPerformed && (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-600">Searching for flights...</p>
                  <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
                </div>
              </div>
            ) : offers.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium tracking-tighter">
                    Flight Results ({offers.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    {searchForm.return_date ? 'Round trip' : 'One way'} • {searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants} passenger{(searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants) !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <FlightCard 
                      key={offer.id}
                      offer={offer}
                      onSelect={handleSelectFlight}
                    />
                  ))}
                </div>
              </>
            ) : !isLoading && searchPerformed ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No flights found</h3>
                  <p className="text-sm">Try adjusting your search criteria or different dates</p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}