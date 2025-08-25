"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import StaysSearchForm, { type StaySearchParams } from "@/components/stays/stays-search-form"
import StayCard from "@/components/stays/stay-card"

export default function HotelsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastParams, setLastParams] = useState<StaySearchParams | null>(null)
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')

  const onSearch = async (params: StaySearchParams) => {
    setLoading(true)
    setError(null)
    setResults([])
    setLastParams(params)

    try {
      // Adapt params to Duffel stays search format as needed
      const payload: any = {
        check_in_date: params.checkIn,
        check_out_date: params.checkOut,
        guests: [{ adults: params.adults || 1 }],
        // Note: depending on Duffel stays, you may need location filters
        // For now, pass city if supported by your Duffel account; otherwise requires coordinates/place id
        city_name: params.city,
        rooms: params.rooms || 1,
        limit: 20,
      }

      const res = await fetch("/api/stays/duffel/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Search failed")
      }

      // Duffel SDK may return shape under data.data; normalize
      const stays = (data?.data || data?.stays || []).map((s: any) => s)
      setResults(stays)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const chips = useMemo(() => {
    if (!lastParams) return [] as Array<{ id: string; label: string; value: string }>
    const out: Array<{ id: string; label: string; value: string }> = []
    if (lastParams.city) out.push({ id: 'city', label: 'City', value: lastParams.city })
    if (lastParams.checkIn) out.push({ id: 'in', label: 'Check‑in', value: lastParams.checkIn })
    if (lastParams.checkOut) out.push({ id: 'out', label: 'Check‑out', value: lastParams.checkOut })
    if (lastParams.adults) out.push({ id: 'adults', label: 'Guests', value: String(lastParams.adults) })
    if (lastParams.rooms) out.push({ id: 'rooms', label: 'Rooms', value: String(lastParams.rooms) })
    return out
  }, [lastParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Stays</h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Search hotels and corporate rates</em>
              </p>
            </div>
            <StaysSearchForm onSearch={onSearch} loading={loading} />
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map(c => (
                  <span key={c.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-xs bg-gray-100 border border-gray-200 text-gray-800">
                    <span className="text-gray-500">{c.label}:</span> {c.value}
                  </span>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => setViewMode('grid')} className={`text-xs px-2 py-1 rounded-lg border ${viewMode==='grid' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700'}`}>Grid</button>
                  <button onClick={() => setViewMode('list')} className={`text-xs px-2 py-1 rounded-lg border ${viewMode==='list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700'}`}>List</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 text-sm text-red-600">
              {error}
            </div>
          )}
          {!error && !loading && results.length === 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8 text-center">
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Start a search to see available stays</em>
              </p>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((stay, idx) => (
                <StayCard key={stay?.id || idx} stay={stay} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((stay, idx) => (
                <div key={stay?.id || idx} className="bg-white/80 rounded-2xl border border-gray-200 p-4">
                  <StayCard stay={stay} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
