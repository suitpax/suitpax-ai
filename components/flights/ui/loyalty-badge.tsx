"use client"

import useSWR from "swr"

function fetcher(url: string) { return fetch(url).then(r => r.json()) }

export default function LoyaltyBadge({ airlineIata, airlineId }: { airlineIata?: string; airlineId?: string }) {
  const airlineKey = !airlineId && airlineIata ? `/api/flights/duffel/airlines?iata=${encodeURIComponent(airlineIata)}` : null
  const { data: airlineData } = useSWR(airlineKey, fetcher)
  const ownerId = airlineId || airlineData?.data?.id

  const lpKey = ownerId ? `/api/flights/duffel/loyalty-programmes?owner_airline_id=${encodeURIComponent(ownerId)}` : null
  const { data } = useSWR(lpKey, fetcher)
  const programmes: any[] = Array.isArray(data?.data) ? data.data : []
  const lp = programmes[0]
  if (!lp) return null

  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white/80 px-2 py-0.5 text-[10px] text-gray-800">
      {lp.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={lp.logo_url} alt={lp.name || "loyalty"} className="h-3 w-auto" />
      ) : null}
      <span className="truncate max-w-[90px]">{lp.name || "Loyalty"}</span>
    </span>
  )
}

