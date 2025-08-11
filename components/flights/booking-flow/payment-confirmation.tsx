"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  selectedOfferIds: string[]
  passengers: any[]
  currency?: string
  onBooked: (orderId: string) => void
}

export default function PaymentConfirmation({ selectedOfferIds, passengers, currency = 'USD', onBooked }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirm = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/flights/duffel/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_offers: selectedOfferIds,
          passengers,
          payments: [{ type: 'balance', amount: '0.00', currency }],
          metadata: { channel: 'suitpax' },
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al confirmar')
      onBooked(data.data.id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Confirmar y pagar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-300">
          Se procederá a confirmar la reserva. En entorno de test, el pago se simula con balance.
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="flex justify-end">
          <Button onClick={confirm} disabled={loading} className="bg-white text-black hover:bg-neutral-200">
            {loading ? 'Procesando…' : 'Confirmar reserva'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
