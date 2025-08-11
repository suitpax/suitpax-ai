"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  orderId: string
}

export default function BookingDetails({ orderId }: Props) {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/flights/duffel/orders/${orderId}`)
      const data = await res.json()
      if (data.success) setOrder(data.order)
    }
    load()
  }, [orderId])

  if (!order) return <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-neutral-300">Cargando…</div>

  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Reserva {order.booking_reference}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-neutral-300">
        <div>Estado: {order.status}</div>
        <div>Total: {order.total_amount} {order.total_currency}</div>
        <div>Pasajeros: {order.passengers?.length}</div>
      </CardContent>
    </Card>
  )
}
