"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BaggageService {
  id: string
  type: string
  name: string
  price: { amount: string; currency: string }
  segment_applicable: string[]
  passenger_applicable: string[]
}

interface Props {
  orderId: string
  onConfirm: (services: Array<{ id: string; quantity: number; passenger_id?: string; segment_id?: string }>) => void
}

export default function BaggageSelection({ orderId, onConfirm }: Props) {
  const [services, setServices] = useState<BaggageService[]>([])
  const [selected, setSelected] = useState<Record<string, number>>({})

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/flights/duffel/baggage?orderId=${orderId}`)
      const data = await res.json()
      if (data.success) {
        const flat: BaggageService[] = [
          ...data.services.checked_bags,
          ...data.services.carry_on,
          ...data.services.overweight,
          ...data.services.oversized,
          ...data.services.sports_equipment,
          ...data.services.other,
        ]
        setServices(flat)
      }
    }
    load()
  }, [orderId])

  const toggle = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: (prev[id] || 0) === 0 ? 1 : 0 }))
  }

  const confirm = async () => {
    const payload = Object.entries(selected)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => ({ id, quantity: q }))

    if (payload.length === 0) return onConfirm([])

    const res = await fetch('/api/flights/duffel/baggage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, services: payload }),
    })
    const data = await res.json()
    if (data.success) onConfirm(payload)
  }

  return (
    <div className="space-y-4">
      <Card className="border-neutral-800 bg-neutral-950 text-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Servicios de equipaje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {services.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`flex items-center justify-between rounded-lg border p-3 text-left ${selected[s.id] ? 'border-white bg-white/10' : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800'}`}
              >
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-neutral-400">{s.type}</div>
                </div>
                <div className="text-sm">{s.price.amount} {s.price.currency}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={confirm} className="bg-white text-black hover:bg-neutral-200">Añadir equipaje</Button>
      </div>
    </div>
  )
}
