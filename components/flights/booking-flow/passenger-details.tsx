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
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      {passengers.map((p, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 text-sm font-medium text-gray-900">Passenger {idx + 1}</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-gray-700">First name</Label>
              <Input value={p.given_name} onChange={e => update(idx, { given_name: e.target.value })} className="bg-white text-gray-900" />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Last name</Label>
              <Input value={p.family_name} onChange={e => update(idx, { family_name: e.target.value })} className="bg-white text-gray-900" />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Date of birth</Label>
              <Input type="date" value={p.born_on} onChange={e => update(idx, { born_on: e.target.value })} className="bg-white text-gray-900" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-gray-700">Phone</Label>
              <Input value={p.phone_number} onChange={e => update(idx, { phone_number: e.target.value })} className="bg-white text-gray-900" />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Email</Label>
              <Input type="email" value={p.email} onChange={e => update(idx, { email: e.target.value })} className="bg-white text-gray-900" />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Seat preference</Label>
              <Input placeholder="aisle/window/middle" value={p.seat_preference || ''} onChange={e => update(idx, { seat_preference: e.target.value })} className="bg-white text-gray-900" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-gray-700">Meal preference</Label>
              <Input placeholder="vegetarian/vegan/halal/..." value={p.meal_preference || ''} onChange={e => update(idx, { meal_preference: e.target.value })} className="bg-white text-gray-900" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-700">Loyalty programs (IATA - Number)</Label>
              <Input placeholder="AA-123456, BA-987654" onBlur={e => {
                const val = e.target.value.trim()
                if (!val) return update(idx, { loyalty_programme_accounts: [] })
                const accounts = val.split(',').map(p => p.trim()).filter(Boolean).map(pair => {
                  const [air, acc] = pair.split('-').map(s => s.trim())
                  return { airline_iata_code: (air || '').toUpperCase(), account_number: acc || '' }
                }).filter(a => a.airline_iata_code && a.account_number)
                update(idx, { loyalty_programme_accounts: accounts })
              }} className="bg-white text-gray-900" />
            </div>
          </div>

          {passengers.length > 1 && (
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={() => removePassenger(idx)} className="border-gray-300 bg-white text-gray-800 hover:bg-gray-50">Remove</Button>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={addPassenger} className="border-gray-300 bg-white text-gray-800 hover:bg-gray-50">Add passenger</Button>
        <Button onClick={() => onSubmit(passengers)} className="bg-black text-white hover:bg-gray-800">Continue</Button>
      </div>
    </div>
  )
}
