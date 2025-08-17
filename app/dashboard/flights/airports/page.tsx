"use client"

import { useEffect, useState } from 'react'

export default function AirportsPage() {
  const [data, setData] = useState<any>({ data: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/flights/duffel/airports?limit=50')
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e?.message || 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  if (loading) return <div className="p-6 text-neutral-400">Loading…</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  const items = Array.isArray(data?.data) ? data.data : (data?.airports || [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Airports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((a: any) => (
          <div key={a.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-white text-sm font-medium">{a.name}</div>
            <div className="text-xs text-neutral-400">{a.iata_code} · {a.city?.name || a.city_name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}