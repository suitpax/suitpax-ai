"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TrainsPage() {
  const [origin, setOrigin] = useState("MAD")
  const [destination, setDestination] = useState("BCN")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [passengers, setPassengers] = useState(1)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    try {
      // Placeholder — integrate real rail API here
      await new Promise((r) => setTimeout(r, 700))
      setResults([
        { id: "t1", carrier: "Renfe", depart: `${date}T08:00`, arrive: `${date}T10:30`, price: 49 },
        { id: "t2", carrier: "Ouigo", depart: `${date}T09:00`, arrive: `${date}T11:35`, price: 39 },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Rail</h1>
            <p className="text-gray-600 font-light">Search high-speed trains and corporate fares</p>
          </div>
          <div className="grid md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-600">From (IATA/City)</label>
              <Input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} className="mt-1 rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-gray-600">To (IATA/City)</label>
              <Input value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} className="mt-1 rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Passengers</label>
              <Input type="number" min={1} max={9} value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value || '1'))} className="mt-1 rounded-xl" />
            </div>
            <div className="flex items-end">
              <Button onClick={search} className="w-full rounded-2xl" disabled={loading}>{loading ? "Searching…" : "Search"}</Button>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="p-8 text-center text-gray-600 font-light">Start a search to see available trains</div>
            ) : (
              <div className="divide-y">
                {results.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xs">{r.carrier}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{origin} → {destination}</div>
                        <div className="text-xs text-gray-600">{new Date(r.depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(r.arrive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">€{r.price}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

