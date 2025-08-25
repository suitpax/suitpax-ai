"use client"

import TimeRangeSelector from "./time-range-selector"
import StopsSelector from "./stops-selector"
import SortingControl from "./sorting-control"
import { Slider } from "@/components/ui/slider"
import AirlinesSelector from "./airlines-selector"

interface FilterControlsProps { onChange?: (filters: any) => void; airlines?: Array<{ code: string; name: string }> }

export default function FilterControls({ onChange, airlines = [] }: FilterControlsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-3">
			<div>
				<div className="text-[11px] sm:text-xs text-gray-800 mb-1">Departure time</div>
				<TimeRangeSelector onChange={(v) => onChange?.({ departs: v })} />
			</div>
			<div>
				<div className="text-[11px] sm:text-xs text-gray-800 mb-1">Stops</div>
				<StopsSelector onChange={(v) => onChange?.({ stops: v })} />
			</div>
			<div>
				<div className="text-[11px] sm:text-xs text-gray-800 mb-1">Sort by</div>
				<SortingControl onChange={(v) => onChange?.({ sort: v })} />
			</div>
			<div>
				<div className="text-[11px] sm:text-xs text-gray-800 mb-1">Price range</div>
				<Slider className="max-w-full" defaultValue={[0, 2000]} min={0} max={5000} step={50} onValueChange={(v) => onChange?.({ priceRange: v })} />
			</div>
			<div>
				<div className="text-[11px] sm:text-xs text-gray-800 mb-1">Airlines</div>
				<AirlinesSelector options={airlines} onChange={(codes) => onChange?.({ airlines: codes })} />
			</div>
		</div>
	)
}