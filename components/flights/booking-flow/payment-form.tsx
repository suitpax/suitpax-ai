"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

interface PaymentFormProps {
  offer: any
  onReady: (paymentIntentId: string) => void
}

export default function PaymentForm({ offer, onReady }: PaymentFormProps) {
  const [cardholder, setCardholder] = useState("")
  const [number, setNumber] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")
  const [loading, setLoading] = useState(false)

  const createPayment = async () => {
    setLoading(true)
    try {
      const body: any = {
        amount: offer?.total_amount,
        currency: offer?.total_currency,
        payment_method: {
          type: 'card',
          card: {
            card_number: number.replace(/\s+/g, ''),
            expiry_month: expMonth,
            expiry_year: expYear,
            security_code: cvc,
            cardholder_name: cardholder,
          }
        }
      }

      const res = await fetch('/api/flights/duffel/payment-intents', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to create payment intent')
      const intent = json?.data || json
      if (!intent?.id) throw new Error('Invalid payment intent')

      // Expose intent id immediately and persist for 3DS return
      onReady(intent.id)
      try { localStorage.setItem('suitpax_payment_intent', intent.id) } catch {}

      // Try to create a 3DS session (if required)
      try {
        const returnUrl = `${window.location.origin}/dashboard/flights/book/${encodeURIComponent(offer?.id || '')}`
        try { localStorage.setItem('suitpax_payment_offer', offer?.id || '') } catch {}
        const sres = await fetch('/api/flights/duffel/three_d_secure_sessions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payment_intent_id: intent.id, return_url: returnUrl })
        })
        const sjson = await sres.json()
        if (sres.ok) {
          const redirect = sjson?.data?.redirect_url || sjson?.data?.redirect?.url
          if (redirect) {
            window.location.href = redirect
            return
          }
        }
      } catch {
        // If 3DS not required or fails, continue
      }

      toast.success('Card authorized')
    } catch (e: any) {
      toast.error(e?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-gray-900 text-base tracking-tighter">Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label>Cardholder name</Label>
            <Input value={cardholder} onChange={e => setCardholder(e.target.value)} className="bg-white text-gray-900" />
          </div>
          <div className="md:col-span-2">
            <Label>Card number</Label>
            <Input value={number} onChange={e => setNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="bg-white text-gray-900" />
          </div>
          <div>
            <Label>Expiry month (MM)</Label>
            <Input value={expMonth} onChange={e => setExpMonth(e.target.value)} placeholder="MM" className="bg-white text-gray-900" />
          </div>
          <div>
            <Label>Expiry year (YYYY)</Label>
            <Input value={expYear} onChange={e => setExpYear(e.target.value)} placeholder="YYYY" className="bg-white text-gray-900" />
          </div>
          <div>
            <Label>CVC</Label>
            <Input value={cvc} onChange={e => setCvc(e.target.value)} placeholder="CVC" className="bg-white text-gray-900" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={createPayment} disabled={loading} className="bg-black text-white hover:bg-gray-800 rounded-2xl">
            {loading ? 'Processing…' : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: offer?.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer?.total_amount || '0'))}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}