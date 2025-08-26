"use client"

import React from "react"

type Offer = { id?: string; title?: string; price?: string; [key: string]: any }

export default function ChatFlightOffers({ offers, onSelect }: { offers: Offer[]; onSelect?: (id?: string) => void }) {
	if (!offers?.length) return null
	return (
		<div className="rounded-lg border border-gray-200 p-3 space-y-2">
			{offers.map((offer, idx) => (
				<div key={offer.id ?? idx} className="flex items-center justify-between text-sm">
					<div className="truncate">
						{offer.title ?? `Offer ${idx + 1}`} {offer.price ? `• ${offer.price}` : ""}
					</div>
					{onSelect ? (
						<button className="text-primary underline" onClick={() => onSelect(offer.id)}>
							Select
						</button>
					) : null}
				</div>
			))}
		</div>
	)
}