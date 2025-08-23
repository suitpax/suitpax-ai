"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BillingPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [isAnnual, setIsAnnual] = useState(false)

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

  const getLink = (plan: "free" | "basic" | "pro" | "custom") => {
    switch (plan) {
      case "free":
        return "https://buy.stripe.com/4gM14obmo61614C0Tp1Nu06"
      case "basic":
        return isAnnual ? "https://buy.stripe.com/dRmaEYgGI4X28x48lR1Nu08" : "https://buy.stripe.com/9B6bJ23TW61600yby31Nu07"
      case "pro":
        return isAnnual ? "https://buy.stripe.com/fZuaEYcqs89eaFc31x1Nu0a" : "https://buy.stripe.com/bJe5kE1LO1KQ28G59F1Nu09"
      case "custom":
        return "mailto:hello@suitpax.com"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button onClick={() => setIsAnnual(false)} className={`px-3 py-1 text-xs font-medium rounded-full ${!isAnnual ? "bg-white text-black shadow" : "text-gray-600"}`}>Monthly</button>
            <button onClick={() => setIsAnnual(true)} className={`px-3 py-1 text-xs font-medium rounded-full ${isAnnual ? "bg-white text-black shadow" : "text-gray-600"}`}>Annual</button>
          </div>
        </div>
        {/* Plans and payment links */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gray-900 text-base">Choose your plan</CardTitle>
            <CardDescription>Select a plan and complete checkout via Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Free</div>
                    <div className="text-xs text-gray-600">€0 / month</div>
                  </div>
                  <a href={getLink("free")} className="inline-flex items-center rounded-2xl px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100">Select</a>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Basic</div>
                    <div className="text-xs text-gray-600">{isAnnual ? "€468 / year" : "€49 / month"}</div>
                  </div>
                  <a href={getLink("basic")} className="inline-flex items-center rounded-2xl px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100">{isAnnual ? "Select annual" : "Select monthly"}</a>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Pro</div>
                    <div className="text-xs text-gray-600">{isAnnual ? "€852 / year" : "€89 / month"}</div>
                  </div>
                  <a href={getLink("pro")} className="inline-flex items-center rounded-2xl px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100">{isAnnual ? "Select annual" : "Select monthly"}</a>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Custom</div>
                    <div className="text-xs text-gray-600">Tailored enterprise plan</div>
                  </div>
                  <a href={getLink("custom")} className="inline-flex items-center rounded-2xl px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100">Contact</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gray-900 text-base">Flight orders & payments</CardTitle>
            <CardDescription>Recent activity from your bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Recent Orders</div>
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white/70">
                {(orders || []).slice(0, 5).map((o) => (
                  <div key={o.id} className="grid grid-cols-3 md:grid-cols-4 gap-3 px-4 py-3 text-sm items-center">
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
                        className="inline-flex items-center rounded-2xl px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100"
                      >
                        View receipt
                      </button>
                    </div>
                  </div>
                ))}
                {(!orders || orders.length === 0) && (
                  <div className="px-4 py-3 text-sm text-gray-600">No orders yet</div>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Recent Payments</div>
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white/70">
                {(payments || []).slice(0, 5).map((p) => (
                  <div key={p.id} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm">
                    <div className="truncate">{p.duffel_payment_id}</div>
                    <div className="text-gray-600">{p.status || '—'}</div>
                    <div className="text-right font-medium">{p.amount ? `${p.amount} ${p.currency || ''}` : '—'}</div>
                  </div>
                ))}
                {(!payments || payments.length === 0) && (
                  <div className="px-4 py-3 text-sm text-gray-600">No payments yet</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

