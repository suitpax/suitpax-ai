"use client"

import DuffelElementsPlaceholder from '@/components/flights/DuffelElements'

export default function AncillariesPage() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Ancillaries (Seats & Baggage)</h2>
      <p className="text-sm text-neutral-400">Selecciona asientos y equipaje para una oferta concreta. Próximamente usaremos @duffel/components.</p>
      <DuffelElementsPlaceholder />
    </div>
  )
}