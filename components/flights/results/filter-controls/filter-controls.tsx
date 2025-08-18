"use client"

import TimeRangeSelector from "./time-range-selector"
import StopsSelector from "./stops-selector"
import SortingControl from "./sorting-control"

interface FilterControlsProps {
  onChange?: (filters: any) => void
}

export default function FilterControls({ onChange }: FilterControlsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <div className="text-xs text-gray-600 mb-1">Departure time</div>
        <TimeRangeSelector onChange={(v) => onChange?.({ departs: v })} />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1">Stops</div>
        <StopsSelector onChange={(v) => onChange?.({ stops: v })} />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1">Sort by</div>
        <SortingControl onChange={(v) => onChange?.({ sort: v })} />
      </div>
    </div>
  )
}

