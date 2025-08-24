"use client"

import Image from "next/image"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type ChatFlightOffer = {
	id?: string
	offer_id?: string
	airline?: { name?: string; code?: string; logo?: string | null }
	price?: number
	currency?: string
	route?: {
		origin?: string
		destination?: string
		departure_time?: string
		arrival_time?: string
		duration?: number | string
		stops?: number
	}
	booking_url?: string
}

export default function FlightOffersBlock({
	offers,
	onBook,
	onDetails,
	className,
}: {
	offers: Array<ChatFlightOffer>
	onBook: (offer: ChatFlightOffer) => void
	onDetails?: (offer: ChatFlightOffer) => void
	className?: string
}) {
	const safeOffers = useMemo(() => (Array.isArray(offers) ? offers.slice(0, 6) : []), [offers])
	if (!safeOffers.length) return null

	return (
		<div className={"grid grid-cols-1 sm:grid-cols-2 gap-3 " + (className || "")}> 
			{safeOffers.map((o, idx) => {
				const airlineCode = o.airline?.code || ""
				const logoUrl = o.airline?.logo || (airlineCode ? `https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${airlineCode}.svg` : "")
				const priceLabel = typeof o.price === "number" && o.price > 0 ? `${o.price.toFixed(0)} ${o.currency || ""}` : ""
				const durationLabel = typeof o.route?.duration === "number" ? `${o.route?.duration}m` : (o.route?.duration || "")
				const stopsLabel = typeof o.route?.stops === "number" ? (o.route?.stops === 0 ? "Direct" : `${o.route?.stops} stops`) : ""
				return (
					<Card key={o.id || o.offer_id || idx} className="border border-gray-200 rounded-2xl p-3 bg-white/80">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2 min-w-0">
								{logoUrl ? (
																	<div className="relative h-6 w-24">
									<Image src={logoUrl} alt={o.airline?.name || "Airline"} fill className="object-contain" />
								</div>
								) : (
									<div className="text-xs font-medium text-gray-700 truncate">{o.airline?.name || "Airline"}</div>
								)}
								<div className="hidden sm:block text-[11px] text-gray-500 truncate">
									{o.route?.origin} → {o.route?.destination}
								</div>
							</div>
							<div className="text-[12px] font-semibold text-gray-900">{priceLabel}</div>
						</div>
						<div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-gray-700">
							<div>
								<div className="text-gray-500">Depart</div>
								<div className="truncate">{o.route?.departure_time ? new Date(o.route?.departure_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
							</div>
							<div>
								<div className="text-gray-500">Arrive</div>
								<div className="truncate">{o.route?.arrival_time ? new Date(o.route?.arrival_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
							</div>
							<div>
								<div className="text-gray-500">Duration</div>
								<div className="truncate">{durationLabel}</div>
							</div>
						</div>
						<div className="mt-2 flex items-center justify-between">
							<div className="text-[11px] text-gray-600">{stopsLabel}</div>
							<div className="flex items-center gap-2">
								<Button size="sm" className="h-7 px-2 text-[11px]" onClick={() => onBook(o)}>Book</Button>
								<Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => onDetails?.(o)}>Details</Button>
							</div>
						</div>
					</Card>
				)
			})}
		</div>
	)
}