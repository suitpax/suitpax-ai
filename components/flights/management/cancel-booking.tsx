"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  orderId: string
}

export default function CancelBooking({ orderId }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')

  const cancel = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/flights/duffel/order-cancellations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, requestRefund: true }),
      })
      const data = await res.json()
      if (data.success) setStatus('Solicitud enviada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Cancelar reserva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-300">Esta acción solicitará la cancelación y, si es posible, un reembolso.</div>
        {status && <div className="text-sm text-neutral-300">{status}</div>}
        <div className="flex justify-end">
          <Button onClick={cancel} disabled={loading} className="bg-white text-black hover:bg-neutral-200">Cancelar</Button>
        </div>
      </CardContent>
    </Card>
  )
}
