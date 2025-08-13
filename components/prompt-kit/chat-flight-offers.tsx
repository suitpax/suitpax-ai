"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ChatFlightOffer = {
  id: string
  price: string
  airline?: string
  airline_iata?: string
  logo?: string | null
  airline_logo?: string | null
  depart?: string
  arrive?: string
  origin?: string
  destination?: string
  origin_city?: string | null
  destination_city?: string | null
  destination_image?: string | null
  stops?: number
  badges?: Array<{ kind: string; label: string }>
}

function BadgePill({ kind, label }: { kind: string; label: string }) {
  const map: Record<string, string> = {
    nonstop: "bg-emerald-100 text-emerald-800 border-emerald-200",
    best_value: "bg-amber-100 text-amber-800 border-amber-200",
    policy_ok: "bg-blue-100 text-blue-800 border-blue-200",
    carrier: "bg-gray-100 text-gray-800 border-gray-200",
    refundable: "bg-teal-100 text-teal-800 border-teal-200",
  }
  const cls = map[kind] || "bg-gray-100 text-gray-800 border-gray-200"
  return <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-medium border", cls)}>{label}</div>
}

export default function ChatFlightOffers({ offers, onSelect }: { offers: ChatFlightOffer[]; onSelect?: (id: string) => void }) {
  if (!offers?.length) return null
  return (
    <div className="space-y-2">
      {offers.map((o) => (
        <div key={o.id} className={cn("flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-3 py-2")}> 
          <div className="flex items-center gap-3 min-w-0">
            {o.destination_image ? (
              <div className="relative h-10 w-16 rounded-md overflow-hidden border border-gray-200">
                <Image src={o.destination_image} alt={o.destination || ""} fill sizes="64px" className="object-cover" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                {o.airline_logo ? (
                  <Image src={o.airline_logo} alt={o.airline || o.airline_iata || ""} width={24} height={24} className="object-contain" />
                ) : o.logo ? (
                  <Image src={o.logo} alt={o.airline || o.airline_iata || ""} width={24} height={24} className="object-contain" />
                ) : (
                  <div className="text-xs text-gray-600">{o.airline_iata}</div>
                )}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{o.origin} → {o.destination} · {o.airline || o.airline_iata}</div>
              <div className="text-xs text-gray-600 truncate">
                {o.depart ? new Date(o.depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                {" – "}
                {o.arrive ? new Date(o.arrive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                {o.stops !== undefined ? ` · ${o.stops === 0 ? 'Direct' : `${o.stops} stop${o.stops>1?'s':''}`}` : ''}
              </div>
              {!!o.badges?.length && (
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {o.badges.map((b, i) => (
                    <BadgePill key={i} kind={b.kind} label={b.label} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{o.price}</div>
            <Button size="sm" className="rounded-full" onClick={() => onSelect?.(o.id)}>Select</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
