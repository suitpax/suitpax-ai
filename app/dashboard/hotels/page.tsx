"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import StaysSearchForm, { type StaySearchParams } from "@/components/stays/stays-search-form"
import StayCard from "@/components/stays/stay-card"

export default function HotelsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const onSearch = async (params: StaySearchParams) => {
    setLoading(true)
    setError(null)
    setResults([])

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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium tracking-tight text-gray-900">Find your stay</h2>
            <p className="text-sm text-gray-600">Search hotels and corporate rates</p>
          </div>
          <StaysSearchForm onSearch={onSearch} loading={loading} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        {!error && !loading && results.length === 0 && (
          <div className="text-sm text-gray-600">Start a search to see available stays.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((stay, idx) => (
            <StayCard key={stay?.id || idx} stay={stay} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}