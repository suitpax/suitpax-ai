"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Passenger {
  given_name: string
  family_name: string
  born_on: string
  title?: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr'
  gender?: 'male' | 'female'
  phone_number: string
  email: string
  seat_preference?: string
  meal_preference?: string
  loyalty_programme_accounts?: Array<{ airline_iata_code: string; account_number: string }>
}

interface Props {
  onSubmit: (passengers: Passenger[]) => void
  initial?: Passenger[]
}

export default function PassengerDetails({ onSubmit, initial = [] }: Props) {
  const [passengers, setPassengers] = useState<Passenger[]>(initial.length ? initial : [{
    given_name: '', family_name: '', born_on: '', phone_number: '', email: '',
  }])

  const update = (idx: number, patch: Partial<Passenger>) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p))
  }

  const addPassenger = () => setPassengers(prev => [...prev, { given_name: '', family_name: '', born_on: '', phone_number: '', email: '' }])
  const removePassenger = (idx: number) => setPassengers(prev => prev.filter((_, i) => i !== idx))

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      {passengers.map((p, idx) => (
        <div key={idx} className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <div className="mb-3 text-sm font-medium text-neutral-200">Pasajero {idx + 1}</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-neutral-300">Nombre</Label>
              <Input value={p.given_name} onChange={e => update(idx, { given_name: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
            <div>
              <Label className="text-sm text-neutral-300">Apellido</Label>
              <Input value={p.family_name} onChange={e => update(idx, { family_name: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
            <div>
              <Label className="text-sm text-neutral-300">Fecha de nacimiento</Label>
              <Input type="date" value={p.born_on} onChange={e => update(idx, { born_on: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-neutral-300">Teléfono</Label>
              <Input value={p.phone_number} onChange={e => update(idx, { phone_number: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
            <div>
              <Label className="text-sm text-neutral-300">Email</Label>
              <Input type="email" value={p.email} onChange={e => update(idx, { email: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
            <div>
              <Label className="text-sm text-neutral-300">Preferencia de asiento</Label>
              <Input placeholder="aisle/window/middle" value={p.seat_preference || ''} onChange={e => update(idx, { seat_preference: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-neutral-300">Preferencia de comida</Label>
              <Input placeholder="vegetarian/vegan/halal/..." value={p.meal_preference || ''} onChange={e => update(idx, { meal_preference: e.target.value })} className="bg-neutral-800 text-white" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-neutral-300">Programa de fidelidad (IATA - Número)</Label>
              <Input placeholder="AA-123456, BA-987654" onBlur={e => {
                const val = e.target.value.trim()
                if (!val) return update(idx, { loyalty_programme_accounts: [] })
                const accounts = val.split(',').map(p => p.trim()).filter(Boolean).map(pair => {
                  const [air, acc] = pair.split('-').map(s => s.trim())
                  return { airline_iata_code: (air || '').toUpperCase(), account_number: acc || '' }
                }).filter(a => a.airline_iata_code && a.account_number)
                update(idx, { loyalty_programme_accounts: accounts })
              }} className="bg-neutral-800 text-white" />
            </div>
          </div>

          {passengers.length > 1 && (
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={() => removePassenger(idx)} className="border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700">Quitar</Button>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={addPassenger} className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800">Añadir pasajero</Button>
        <Button onClick={() => onSubmit(passengers)} className="bg-white text-black hover:bg-neutral-200">Continuar</Button>
      </div>
    </div>
  )
}