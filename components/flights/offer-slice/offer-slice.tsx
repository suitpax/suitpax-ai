"use client"

import { Badge } from "@/components/ui/badge"
import { formatDurationISO } from "../results/lib"

interface OfferSliceProps {
  slice: any
  index?: number
}

export default function OfferSlice({ slice, index = 1 }: OfferSliceProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-800">
        <div className="font-medium tracking-tighter">Leg {index}: {slice?.origin?.iata_code} → {slice?.destination?.iata_code}</div>
        <div className="text-gray-600">Duration: {formatDurationISO(slice?.duration)}</div>
      </div>
      <div className="space-y-2">
        {(slice?.segments || []).map((seg: any) => (
          <div key={seg.id} className="flex flex-col gap-1">
            <div className="font-medium truncate">
              {(seg.origin?.city?.name || seg.origin?.city_name || seg.origin?.name)} ({seg.origin?.iata_code}) → {(seg.destination?.city?.name || seg.destination?.city_name || seg.destination?.name)} ({seg.destination?.iata_code})
            </div>
            <div className="text-[11px] text-gray-600">
              {(seg.airline?.name || seg.marketing_carrier?.name || "")} {seg.flight_number}
            </div>
            <div className="flex flex-wrap gap-1">
              {seg?.aircraft?.name && (
                <Badge variant="compact">{seg.aircraft.name}</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

