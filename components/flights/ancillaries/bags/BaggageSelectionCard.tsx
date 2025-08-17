"use client"

import React from "react"
import Counter from "../Counter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BaggageOption {
	code: string
	title: string
	description?: string
	amount: number
	currency: string
}

interface PassengerRef {
	id: string
	name: string
}

interface BaggageSelectionCardProps {
	options: BaggageOption[]
	passengers: PassengerRef[]
	selection: Record<string, number> // by option code (global simple)
	onChange: (next: Record<string, number>) => void
	className?: string
}

export default function BaggageSelectionCard({ options, passengers, selection, onChange, className = "" }: BaggageSelectionCardProps) {
	const setQty = (code: string, qty: number) => {
		const next = { ...selection }
		if (qty <= 0) delete next[code]
		else next[code] = qty
		onChange(next)
	}

	return (
		<div className={`rounded-2xl border border-gray-200 bg-white p-3 space-y-3 ${className}`}>
			<div className="text-sm font-medium text-gray-900 tracking-tighter">Baggage</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{options.map((opt) => {
					const count = selection[opt.code] || 0
					return (
						<div key={opt.code} className="rounded-2xl border border-gray-200 p-3">
							<div className="flex items-start justify-between">
								<div>
									<div className="text-sm font-medium text-gray-900">{opt.title}</div>
									{opt.description && <div className="text-xs text-gray-600 mt-0.5">{opt.description}</div>}
								</div>
								<Badge className="rounded-2xl bg-white text-gray-900 border-gray-200">
									{new Intl.NumberFormat("en-US", { style: "currency", currency: opt.currency, maximumFractionDigits: 0 }).format(opt.amount)}
								</Badge>
							</div>
							<div className="mt-3 flex items-center justify-between">
								<Counter value={count} min={0} onChange={(n) => setQty(opt.code, n)} size="sm" />
								<Button variant={count > 0 ? "default" : "outline"} onClick={() => setQty(opt.code, count > 0 ? 0 : 1)} className="rounded-2xl">
									{count > 0 ? "Remove" : "Add"}
								</Button>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}