'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Settings } from 'lucide-react'
import { toast } from 'sonner'

export default function BillingPage() {
  const [loading, setLoading] = useState<'checkout' | 'portal' | null>(null)

  const startSubscription = async () => {
    try {
      setLoading('checkout')
      const link = process.env.NEXT_PUBLIC_STRIPE_LINK_PRO || ""
      if (!link) throw new Error('Stripe Checkout Link not configured')
      window.location.href = link
    } catch (e: any) {
      toast.error(e.message || 'Failed to start subscription')
    } finally {
      setLoading(null)
    }
  }

  const openPortal = async () => {
    try {
      setLoading('portal')
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      window.location.href = data.url
    } catch (e: any) {
      toast.error(e.message || 'Failed to open billing portal')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Billing</h1>
          <p className="text-sm md:text-base font-light text-gray-600 mt-2">
            Manage your Suitpax plan (separate from trip payments)
          </p>
        </div>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="tracking-tighter">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Your subscription controls access/features. Trip charges (flights/hotels/add‑ons) are paid separately at booking time.
            </p>
            <div className="flex gap-3">
              <Button onClick={startSubscription} disabled={loading !== null} className="bg-black text-white">
                {loading === 'checkout' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CreditCard className="h-4 w-4 mr-2" />}
                Upgrade to Pro
              </Button>
              <Button variant="outline" onClick={() => {
                const link = process.env.NEXT_PUBLIC_STRIPE_LINK_ENTERPRISE || "";
                if (!link) return toast.error('Enterprise link not configured');
                window.location.href = link;
              }} disabled={loading !== null}>
                Enterprise
              </Button>
              <Button variant="outline" onClick={openPortal} disabled={loading !== null}>
                {loading === 'portal' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
                Manage subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}