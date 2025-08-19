"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BillingPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/flights/history", { cache: "no-store" })
        const json = await res.json()
        setOrders(Array.isArray(json?.orders) ? json.orders : [])
        setPayments(Array.isArray(json?.payments) ? json.payments : [])
      } catch {}
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Flight orders & payments</CardTitle>
            <CardDescription>Recent activity from your bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Recent Orders</div>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                {(orders || []).slice(0, 5).map((o) => (
                  <div key={o.id} className="grid grid-cols-3 md:grid-cols-4 gap-3 px-4 py-3 text-sm bg-white items-center">
                    <div className="truncate">{o.duffel_order_id}</div>
                    <div className="text-gray-600">{o.status || '—'}</div>
                    <div className="text-right font-medium">{o.total_amount ? `${o.total_amount} ${o.total_currency || ''}` : '—'}</div>
                    <div className="hidden md:flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/flights/duffel/orders/${encodeURIComponent(o.duffel_order_id)}`)
                            const json = await res.json()
                            const order = json?.data || json
                            const lines: string[] = []
                            lines.push(`# Suitpax • Flight Receipt`)
                            lines.push(`Order: ${o.duffel_order_id}`)
                            lines.push(`Status: ${o.status || '—'}`)
                            lines.push(`Total: ${o.total_amount ? `${o.total_amount} ${o.total_currency || ''}` : '—'}`)
                            lines.push('')
                            lines.push(`## Details`)
                            lines.push(`Passengers: ${(order?.passengers || []).length || '—'}`)
                            lines.push(`Slices: ${(order?.slices || []).length || '—'}`)
                            const payload = { content: lines.join('\n'), filename: `receipt-${o.duffel_order_id}` }
                            const pdf = await fetch('/api/pdf/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                            const pjson = await pdf.json()
                            if (pjson?.success && pjson?.url) window.open(pjson.url, '_blank')
                          } catch {}
                        }}
                        className="inline-flex items-center rounded-xl px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100"
                      >
                        View receipt
                      </button>
                    </div>
                  </div>
                ))}
                {(!orders || orders.length === 0) && (
                  <div className="px-4 py-3 text-sm text-gray-600 bg-white">No orders yet</div>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Recent Payments</div>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                {(payments || []).slice(0, 5).map((p) => (
                  <div key={p.id} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm bg-white">
                    <div className="truncate">{p.duffel_payment_id}</div>
                    <div className="text-gray-600">{p.status || '—'}</div>
                    <div className="text-right font-medium">{p.amount ? `${p.amount} ${p.currency || ''}` : '—'}</div>
                  </div>
                ))}
                {(!payments || payments.length === 0) && (
                  <div className="px-4 py-3 text-sm text-gray-600 bg-white">No payments yet</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

