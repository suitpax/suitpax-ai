"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  orderId: string
}

export default function ChangeBooking({ orderId }: Props) {
  const [changeRequest, setChangeRequest] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [selectedOfferId, setSelectedOfferId] = useState<string>('')

  const requestChanges = async () => {
    const res = await fetch('/api/flights/duffel/order-changes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, changeType: 'date', changes: { slices: { add: [], remove: [] } } }),
    })
    const data = await res.json()
    if (data.success) {
      setChangeRequest(data.change_request)
      setOffers(data.change_request.available_offers || [])
    }
  }

  const confirm = async () => {
    if (!changeRequest?.id || !selectedOfferId) return
    const res = await fetch('/api/flights/duffel/order-changes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changeRequestId: changeRequest.id, selectedOfferId }),
    })
    const data = await res.json()
    if (data.success) {
      setChangeRequest(null)
      setOffers([])
      setSelectedOfferId('')
    }
  }

  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Cambiar reserva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!changeRequest && (
          <Button onClick={requestChanges} className="bg-white text-black hover:bg-neutral-200">Buscar opciones de cambio</Button>
        )}

        {offers.length > 0 && (
          <div className="space-y-2">
            {offers.map(o => (
              <button key={o.id} onClick={() => setSelectedOfferId(o.id)} className={`w-full rounded-lg border p-3 text-left ${selectedOfferId === o.id ? 'border-white bg-white/10' : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800'}`}>
                <div className="text-sm">Coste cambio: {o.change_total_amount} {o.change_total_currency}</div>
                <div className="text-xs text-neutral-400">Nuevo total: {o.new_total_amount} {o.new_total_currency}</div>
              </button>
            ))}

            <div className="flex justify-end">
              <Button onClick={confirm} disabled={!selectedOfferId} className="bg-white text-black hover:bg-neutral-200">Confirmar</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}