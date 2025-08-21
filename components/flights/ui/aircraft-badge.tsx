"use client"

import useSWR from "swr"

function fetcher(url: string) { return fetch(url).then(r => r.json()) }

export default function AircraftBadge({ iata, id }: { iata?: string; id?: string }) {
  const key = iata ? `/api/flights/duffel/aircraft?iata=${encodeURIComponent(iata)}` : (id ? `/api/flights/duffel/aircraft?id=${encodeURIComponent(id)}` : null)
  const { data } = useSWR(key, fetcher)
  const aircraft = data?.data
  if (!aircraft) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white/70 px-2 py-0.5 text-[10px] text-gray-800">
      <span className="font-medium">{aircraft.iata_code || "AC"}</span>
      <span className="opacity-70">{aircraft.name || "Aircraft"}</span>
    </span>
  )
}

