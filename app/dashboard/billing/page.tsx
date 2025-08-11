'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BillingPage() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Billing</h1>
          <p className="text-sm md:text-base font-light text-gray-600 mt-2">
            Subscription management coming soon. We will connect Stripe Checkout and Customer Portal here.
          </p>
        </div>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="tracking-tighter">Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>Plans and upgrades will be available shortly. Meanwhile, all core features remain accessible.</p>
            <p>Once enabled, this page will offer one-click Stripe Checkout and a link to Stripe Customer Portal.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}