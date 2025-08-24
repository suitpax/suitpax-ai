"use client"

import Link from 'next/link'

export default function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/flights" className="rounded-xl border p-4 hover:shadow-sm transition">
          <div className="text-sm text-neutral-500">Flights</div>
          <div className="font-medium">Duffel Flights</div>
          <div className="text-xs text-neutral-500 mt-1">Real-time flight search and booking</div>
        </Link>
      </div>
    </div>
  )
}