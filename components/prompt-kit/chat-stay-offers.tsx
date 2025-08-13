"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ChatStayOffer = {
  id: string
  name: string
  brand?: string | null
  city?: string | null
  address?: string | null
  image?: string | null
  rating?: number | null
  price: string
  currency: string
  refundable?: boolean | null
  badges?: Array<{ kind: string; label: string }>
  booking_url: string
}

function BadgePill({ kind, label }: { kind: string; label: string }) {
  const map: Record<string, string> = {
    corporate_rate: "bg-blue-100 text-blue-800 border-blue-200",
    policy_ok: "bg-emerald-100 text-emerald-800 border-emerald-200",
    refundable: "bg-teal-100 text-teal-800 border-teal-200",
    best_value: "bg-amber-100 text-amber-800 border-amber-200",
  }
  const cls = map[kind] || "bg-gray-100 text-gray-800 border-gray-200"
  return <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-medium border", cls)}>{label}</div>
}

export default function ChatStayOffers({ stays, onSelect }: { stays: ChatStayOffer[]; onSelect?: (id: string) => void }) {
  if (!stays?.length) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stays.map((s) => (
        <div key={s.id} className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm overflow-hidden">
          {s.image && (
            <div className="relative h-28 w-full">
              <Image src={s.image} alt={s.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
            </div>
          )}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{s.name}</div>
                <div className="text-xs text-gray-600 truncate">{s.city || s.address || s.brand || ""}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{s.price}</div>
                {typeof s.rating === 'number' && <div className="text-[10px] text-gray-600">Rating {s.rating.toFixed(1)}</div>}
              </div>
            </div>
            {!!s.badges?.length && (
              <div className="flex flex-wrap items-center gap-1.5">
                {s.badges.map((b, i) => (
                  <BadgePill key={i} kind={b.kind} label={b.label} />
                ))}
              </div>
            )}
            <div className="pt-1">
              <Button size="sm" className="w-full rounded-lg" onClick={() => onSelect?.(s.id)}>Select</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}