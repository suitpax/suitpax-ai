"use client"

import { useState } from 'react'
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
    })
    onResults?.(res)
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4 ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <Label className="text-sm text-neutral-300">Origen</Label>
          <Input value={origin} onChange={e => setOrigin(e.target.value.toUpperCase())} placeholder="JFK" className="bg-neutral-900 text-white" />
        </div>
        <div>
          <Label className="text-sm text-neutral-300">Destino</Label>
          <Input value={destination} onChange={e => setDestination(e.target.value.toUpperCase())} placeholder="LAX" className="bg-neutral-900 text-white" />
        </div>
        <div>
          <Label className="text-sm text-neutral-300">Salida</Label>
          <Input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="bg-neutral-900 text-white" />
        </div>
        <div>
          <Label className="text-sm text-neutral-300">Regreso (opcional)</Label>
          <Input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="bg-neutral-900 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label className="text-sm text-neutral-300">Pasajeros</Label>
          <Input type="number" min={1} max={9} value={passengers} onChange={e => setPassengers(parseInt(e.target.value || '1'))} className="bg-neutral-900 text-white" />
        </div>
        <div>
          <Label className="text-sm text-neutral-300">Cabina</Label>
          <Select value={cabinClass} onValueChange={setCabinClass}>
            <SelectTrigger className="bg-neutral-900 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 text-white">
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium_economy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-3">
          <Checkbox id="direct" checked={directOnly} onCheckedChange={v => setDirectOnly(Boolean(v))} />
          <Label htmlFor="direct" className="text-sm text-neutral-300">Solo vuelos directos</Label>
        </div>
      </div>

      <div>
        <Label className="text-sm text-neutral-300">Filtrar por aerolíneas (IATA, separadas por coma)</Label>
        <Input value={airlines} onChange={e => setAirlines(e.target.value)} placeholder="AA,UA,DL" className="bg-neutral-900 text-white" />
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-neutral-200">
          {isLoading ? 'Buscando…' : 'Buscar vuelos'}
        </Button>
      </div>
    </form>
  )
}