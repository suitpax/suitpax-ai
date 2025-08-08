'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FlightCard } from '@/components/flights/flight-card'
import { FlightFiltersDisplay } from '@/components/flights/flight-filters'
import { Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FlightsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [offers, setOffers] = useState([])
  const [filters, setFilters] = useState([])
  
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    return_date: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    cabin_class: 'economy' as const
  })

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/flights/duffel/flight-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchForm),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOffers(data.data.offers || [])
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFlight = (offerId: string) => {
    router.push(`/dashboard/flights/book/${offerId}`)
  }

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId))
  }

  const clearAllFilters = () => {
    setFilters([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Flight Search</h1>
        <p className="text-muted-foreground">
          Search and book flights with real-time pricing and availability
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="origin">From</Label>
              <Input
                id="origin"
                placeholder="JFK"
                value={searchForm.origin}
                onChange={(e) => setSearchForm({
                  ...searchForm,
                  origin: e.target.value.toUpperCase()
                })}
                maxLength={3}
              />
            </div>
            
            <div>
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="LAX"
                value={searchForm.destination}
                onChange={(e) => setSearchForm({
                  ...searchForm,
                  destination: e.target.value.toUpperCase()
                })}
                maxLength={3}
              />
            </div>
            
            <div>
              <Label htmlFor="departure">Departure</Label>
              <Input
                id="departure"
                type="date"
                value={searchForm.departure_date}
                onChange={(e) => setSearchForm({
                  ...searchForm,
                  departure_date: e.target.value
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="return">Return (optional)</Label>
              <Input
                id="return"
                type="date"
                value={searchForm.return_date}
                onChange={(e) => setSearchForm({
                  ...searchForm,
                  return_date: e.target.value
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Select 
                value={searchForm.passengers.adults.toString()}
                onValueChange={(value) => setSearchForm({
                  ...searchForm,
                  passengers: { ...searchForm.passengers, adults: parseInt(value) }
                })}
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
              <Label htmlFor="children">Children</Label>
              <Select 
                value={searchForm.passengers.children.toString()}
                onValueChange={(value) => setSearchForm({
                  ...searchForm,
                  passengers: { ...searchForm.passengers, children: parseInt(value) }
                })}
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
              <Label htmlFor="infants">Infants</Label>
              <Select 
                value={searchForm.passengers.infants.toString()}
                onValueChange={(value) => setSearchForm({
                  ...searchForm,
                  passengers: { ...searchForm.passengers, infants: parseInt(value) }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(3)].map((_, i) => (
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
                onValueChange={(value: any) => setSearchForm({
                  ...searchForm,
                  cabin_class: value
                })}
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
            disabled={!searchForm.origin || !searchForm.destination || !searchForm.departure_date || isLoading}
            className="w-full"
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

      <FlightFiltersDisplay 
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
      />

      {offers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Flight Results ({offers.length})
          </h2>
          <div className="space-y-4">
            {offers.map((offer: any) => (
              <FlightCard 
                key={offer.id}
                offer={offer}
                onSelect={handleSelectFlight}
              />
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  )
}