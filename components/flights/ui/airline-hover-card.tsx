"use client"

import useSWR from "swr"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

function fetcher(url: string) { return fetch(url).then(r => r.json()) }

export default function AirlineHoverCard({ iata, children }: { iata?: string; children: React.ReactNode }) {
  const { data } = useSWR(iata ? `/api/flights/duffel/airlines?iata=${iata}` : null, fetcher)
  const airline = data?.data
  if (!iata) return <>{children}</>
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-72 bg-white border border-gray-200 rounded-2xl shadow">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {airline?.logo_symbol_url && <img src={airline.logo_symbol_url} alt={airline?.name || iata} className="h-5 w-auto" />}
          <div>
            <div className="text-sm font-medium text-gray-900">{airline?.name || iata}</div>
            <div className="text-xs text-gray-600">IATA {airline?.iata_code || iata}</div>
          </div>
        </div>
        {airline?.conditions_of_carriage_url && (
          <a href={airline.conditions_of_carriage_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gray-700 underline">Conditions of carriage</a>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

