"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SeatService {
  id: string
  type: string
  price: { amount: string; currency: string }
  passenger_restrictions?: any
}

interface SeatElement {
  type: 'seat' | string
  id: string
  designator: string
  name?: string
  available: boolean
  services: SeatService[]
  position?: { row: number; column: number }
}

interface SeatMap {
  id: string
  segment_id: string
  aircraft: any
  cabin_layout: any
  elements: SeatElement[]
}

interface Selection {
  passenger_id: string
  seat_id: string
  segment_id: string
}

interface Props {
  offerId?: string
  orderId?: string
  passengers: Array<{ id: string; name?: string }>
  onConfirm: (selections: Selection[]) => void
}

export default function SeatSelection({ offerId, orderId, passengers, onConfirm }: Props) {
  const [seatMaps, setSeatMaps] = useState<SeatMap[]>([])
  const [selections, setSelections] = useState<Selection[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMaps = async () => {
      setLoading(true)
      try {
        const params = offerId ? `offerId=${offerId}` : `orderId=${orderId}`
        const res = await fetch(`/api/flights/duffel/seats?${params}`)
        const data = await res.json()
        if (data.success) setSeatMaps(data.seat_maps)
      } finally {
        setLoading(false)
      }
    }
    fetchMaps()
  }, [offerId, orderId])

  const toggleSeat = (segment_id: string, seat: SeatElement, passenger_id: string) => {
    if (!seat.available) return
    setSelections(prev => {
      const filtered = prev.filter(s => !(s.segment_id === segment_id && s.passenger_id === passenger_id))
      return [...filtered, { passenger_id, seat_id: seat.id, segment_id }]
    })
  }

  const handleConfirm = async () => {
    if (!orderId) return onConfirm(selections)
    const res = await fetch('/api/flights/duffel/seats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, selections }),
    })
    const data = await res.json()
    if (data.success) onConfirm(selections)
  }

  return (
    <div className="space-y-4">
      {loading && <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-neutral-300">Cargando mapa de asientos…</div>}
      {seatMaps.map(map => (
        <Card key={map.id} className="border-neutral-800 bg-neutral-950 text-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Segmento {map.segment_id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {passengers.map(p => (
                <div key={p.id} className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                  <div className="mb-2 text-sm text-neutral-300">Seleccionar asiento para {p.name || p.id}</div>
                  <div className="grid grid-cols-6 gap-2">
                    {map.elements.filter(e => e.type === 'seat').map(seat => {
                      const isSelected = selections.some(s => s.segment_id === map.segment_id && s.passenger_id === p.id && s.seat_id === seat.id)
                      return (
                        <button
                          key={`${p.id}-${seat.id}`}
                          type="button"
                          className={`rounded-md p-2 text-xs ${isSelected ? 'bg-white text-black' : seat.available ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'}`}
                          onClick={() => toggleSeat(map.segment_id, seat, p.id)}
                          disabled={!seat.available}
                        >
                          {seat.designator}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleConfirm} className="bg-white text-black hover:bg-neutral-200">Confirmar asientos</Button>
      </div>
    </div>
  )
}