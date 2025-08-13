"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import StaysSearchForm, { type StaySearchParams } from "@/components/stays/stays-search-form"
import StayCard from "@/components/stays/stay-card"
import { CardSkeleton } from "@/components/ui/skeleton"

export default function HotelsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [providerInfo, setProviderInfo] = useState<{ duffel: number; expedia: number } | null>(null)

  const onSearch = async (params: StaySearchParams) => {
    setLoading(true)
    setError(null)
    setResults([])

    try {
      // Adapt params to aggregator format
      const payload: any = {
        check_in_date: params.checkIn,
        check_out_date: params.checkOut,
        guests: [{ adults: params.adults || 1 }],
        city_name: params.city,
        rooms: params.rooms || 1,
        limit: 20,
      }

      const res = await fetch("/api/stays/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Search failed")
      }

      setResults(data?.stays || [])
      if (data?.provider_counts) setProviderInfo(data.provider_counts)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

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

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="mb-2 text-xs text-gray-600">
              {providerInfo && (
                <span>
                  Providers: Duffel {providerInfo.duffel} · Expedia {providerInfo.expedia}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((stay, idx) => (
              <StayCard key={stay?.id || idx} stay={stay} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
