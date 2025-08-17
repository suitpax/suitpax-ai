"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useFlightSearch } from '@/hooks/use-flight-search'

interface Props {
  onResults?: (data: any) => void
  className?: string
}

export default function FlightSearchForm({ onResults, className = '' }: Props) {
  const { search, isLoading, error } = useFlightSearch()

  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [cabinClass, setCabinClass] = useState('economy')
  const [directOnly, setDirectOnly] = useState(false)
  const [airlines, setAirlines] = useState<string>('')

  const [originPreview, setOriginPreview] = useState<string>('')
  const [destinationPreview, setDestinationPreview] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      const q = origin.trim()
      if (!q) return setOriginPreview('')
      const res = await fetch(`/api/flights/duffel/airports?query=${encodeURIComponent(q)}`)
      const json = await res.json()
      const items = Array.isArray(json?.data) ? json.data : (json?.airports || [])
      const first = items[0]
      if (first) setOriginPreview(`${first.city?.name || first.city_name || ''} · ${first.name}`)
      else setOriginPreview('')
    }
    run()
  }, [origin])

  useEffect(() => {
    const run = async () => {
      const q = destination.trim()
      if (!q) return setDestinationPreview('')
      const res = await fetch(`/api/flights/duffel/airports?query=${encodeURIComponent(q)}`)
      const json = await res.json()
      const items = Array.isArray(json?.data) ? json.data : (json?.airports || [])
      const first = items[0]
      if (first) setDestinationPreview(`${first.city?.name || first.city_name || ''} · ${first.name}`)
      else setDestinationPreview('')
    }
    run()
  }, [destination])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await search({
      origin,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      passengers,
      cabinClass,
      loyaltyProgrammes: [],
      corporateDiscounts: false,
      directOnly,
      airlines,
    })
    onResults?.(res)
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <Label className="text-sm text-gray-800">Origin</Label>
          <Input value={origin} onChange={e => setOrigin(e.target.value.toUpperCase())} placeholder="From (IATA) e.g. JFK" className="bg-white text-gray-900 border border-gray-300 rounded-2xl" />
          {originPreview && <div className="mt-1 text-xs text-gray-500">{originPreview}</div>}
        </div>
        <div>
          <Label className="text-sm text-gray-800">Destination</Label>
          <Input value={destination} onChange={e => setDestination(e.target.value.toUpperCase())} placeholder="To (IATA) e.g. LAX" className="bg-white text-gray-900 border border-gray-300 rounded-2xl" />
          {destinationPreview && <div className="mt-1 text-xs text-gray-500">{destinationPreview}</div>}
        </div>
        <div>
          <Label className="text-sm text-gray-800">Departure</Label>
          <Input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="bg-white text-gray-900 border border-gray-300 rounded-2xl" />
        </div>
        <div>
          <Label className="text-sm text-gray-800">Return (optional)</Label>
          <Input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="bg-white text-gray-900 border border-gray-300 rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label className="text-sm text-gray-800">Passengers</Label>
          <Input type="number" min={1} max={9} value={passengers} onChange={e => setPassengers(parseInt(e.target.value || '1'))} className="bg-white text-gray-900 border border-gray-300 rounded-2xl" />
        </div>
        <div>
          <Label className="text-sm text-gray-800">Cabin</Label>
          <Select value={cabinClass} onValueChange={setCabinClass}>
            <SelectTrigger className="bg-white text-gray-900 border border-gray-300 rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border border-gray-200 rounded-2xl">
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium_economy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-3">
          <Checkbox id="direct" checked={directOnly} onCheckedChange={v => setDirectOnly(Boolean(v))} />
          <Label htmlFor="direct" className="text-sm text-gray-800">Direct flights only</Label>
        </div>
      </div>

      <div>
        <Label className="text-sm text-gray-800">Filter by airlines (IATA, comma separated)</Label>
        <Input value={airlines} onChange={e => setAirlines(e.target.value)} placeholder="AA, UA, DL" className="bg-white text-gray-900 border border-gray-300 rounded-2xl" />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex flex-col md:flex-row md:justify-end">
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-2xl">
          {isLoading ? 'Searching…' : 'Search flights'}
        </Button>
      </div>
    </form>
  )
}
