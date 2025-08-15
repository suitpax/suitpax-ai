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
  depart?: string
  arrive?: string
  origin?: string
  destination?: string
  stops?: number
}

export default function ChatFlightOffers({ offers, onSelect }: { offers: ChatFlightOffer[]; onSelect?: (id: string) => void }) {
  if (!offers?.length) return null
  return (
    <div className="space-y-2">
      {offers.map((o) => (
        <div key={o.id} className={cn("flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-3 py-2")}> 
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
              {o.logo ? (
                <Image src={o.logo} alt={o.airline || o.airline_iata || ""} width={24} height={24} className="object-contain" />
              ) : (
                <div className="text-xs text-gray-600">{o.airline_iata}</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{o.origin} → {o.destination} · {o.airline || o.airline_iata}</div>
              <div className="text-xs text-gray-600 truncate">
                {o.depart ? new Date(o.depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                {" – "}
                {o.arrive ? new Date(o.arrive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                {o.stops !== undefined ? ` · ${o.stops === 0 ? 'Direct' : `${o.stops} stop${o.stops>1?'s':''}`}` : ''}
              </div>
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
