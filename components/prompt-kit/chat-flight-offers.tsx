"use client"

export default function ChatFlightOffers({ offers, onSelect }: { offers: Array<any>; onSelect: (id: string) => void }) {
	if (!Array.isArray(offers) || offers.length === 0) return null
	return (
		<div className="rounded-xl border border-gray-200 bg-white/80 divide-y">
			{offers.slice(0, 5).map((o: any, idx: number) => (
				<button key={o.id || idx} onClick={() => onSelect(o.id || o.offer_id || "")} className="w-full text-left px-3 py-2 hover:bg-white focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-300">
					<div className="flex items-center justify-between">
						<div className="text-[12px] text-gray-900 font-medium">{o.airline?.name || o.airline || "Airline"} • {o.route?.duration || o.duration || ""}</div>
						<div className="text-[12px] text-gray-900 font-semibold">{o.price ? `${o.price} ${o.currency || ""}` : ""}</div>
					</div>
					<div className="text-[11px] text-gray-600">
						{o.route?.departure_time || o.departure_time || ""} → {o.route?.arrival_time || o.arrival_time || ""} • {o.route?.stops === 0 ? "Direct" : `${o.route?.stops || 0} stops`}
					</div>
				</button>
			))}
		</div>
	)
}