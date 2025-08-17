"use client"

import React, { useEffect, useMemo, useState } from "react"
import Counter from "./Counter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import IncludedBaggageBanner from "./bags/IncludedBaggageBanner"
import BaggageSelectionController from "./bags/BaggageSelectionController"

interface DuffelAncillaryRaw {
	id?: string
	code?: string
	type?: string
	title?: string
	description?: string
	price?: { total_amount?: string; total_currency?: string } | null
	total_amount?: string
	total_currency?: string
	[key: string]: any
}

interface SimplifiedAncillary {
	id: string
	code: string
	category: string
	title: string
	description?: string
	amount: number
	currency: string
}

interface Props {
	offerId: string
	onChange?: (selection: Record<string, number>) => void
	className?: string
}

function simplify(items: DuffelAncillaryRaw[]): SimplifiedAncillary[] {
	return items.map((it) => {
		const id = it.id || it.code || Math.random().toString(36).slice(2)
		const code = it.code || id
		const category = it.type || "other"
		const title = it.title || it.name || (category === "baggage" ? "Extra baggage" : category)
		const description = it.description || it.subtype || undefined
		const amountStr = it.total_amount || it.price?.total_amount || "0"
		const currency = it.total_currency || it.price?.total_currency || "USD"
		const amount = parseFloat(amountStr || "0") || 0
		return { id, code, category, title, description, amount, currency }
	})
}

export default function DuffelAncillaries({ offerId, onChange, className = "" }: Props) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [ancillaries, setAncillaries] = useState<SimplifiedAncillary[]>([])
	const [selection, setSelection] = useState<Record<string, number>>({})

	useEffect(() => {
		const run = async () => {
			setLoading(true)
			setError(null)
			try {
				const url = new URL("/api/flights/duffel/ancillaries", window.location.origin)
				url.searchParams.set("offer_id", offerId)
				const res = await fetch(url.toString(), { cache: "no-store" })
				const json = await res.json()
				if (!res.ok) throw new Error(json?.error || "Failed to load ancillaries")
				const raw: DuffelAncillaryRaw[] = json?.data || []
				setAncillaries(simplify(raw))
			} catch (e: any) {
				setError(e?.message || "Unexpected error")
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [offerId])

	useEffect(() => {
		onChange?.(selection)
	}, [selection, onChange])

	const byCategory = useMemo(() => {
		return ancillaries.reduce<Record<string, SimplifiedAncillary[]>>((acc, a) => {
			acc[a.category] = acc[a.category] || []
			acc[a.category].push(a)
			return acc
		}, {})
	}, [ancillaries])

	const setQty = (code: string, qty: number) => {
		setSelection((prev) => {
			const next = { ...prev }
			if (qty <= 0) delete next[code]
			else next[code] = qty
			return next
		})
	}

	return (
		<Card className={`glass-card ${className}`}>
			<CardHeader>
				<CardTitle className="text-gray-900 text-base tracking-tighter">Extras</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Included baggage summary (placeholder; wire real data if present on offer) */}
				<IncludedBaggageBanner cabin={null} checked={null} />
				{loading && <div className="text-sm text-gray-600">Loading…</div>}
				{error && <div className="text-sm text-red-600">{error}</div>}
				{!loading && !error && ancillaries.length === 0 && (
					<div className="text-sm text-gray-600">No extras available for this offer</div>
				)}

				{/* Baggage controller */}
				{ancillaries.some(a => (a.category || '').includes('baggage') || a.code.includes('BAG')) && (
					<BaggageSelectionController ancillaries={ancillaries} onChange={() => {}} />
				)}

				{Object.keys(byCategory).map((cat) => (
					<div key={cat} className="space-y-2">
						<div className="text-sm font-medium text-gray-900 capitalize">{cat.replace(/_/g, " ")}</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{byCategory[cat].map((it) => {
								const count = selection[it.code] || 0
								return (
									<div key={it.code} className="rounded-2xl border border-gray-200 bg-white p-3">
										<div className="flex items-start justify-between">
											<div>
												<div className="text-sm font-medium text-gray-900 tracking-tighter">{it.title}</div>
												{it.description && (
													<div className="text-xs text-gray-600 mt-0.5">{it.description}</div>
												)}
											</div>
											<div className="flex items-center gap-2">
												<Badge className="rounded-2xl bg-white text-gray-900 border-gray-200">
													{new Intl.NumberFormat("en-US", { style: "currency", currency: it.currency, maximumFractionDigits: 0 }).format(it.amount)}
												</Badge>
											</div>
										</div>
										<div className="mt-3 flex items-center justify-between">
											<Counter value={count} min={0} onChange={(n) => setQty(it.code, n)} size="sm" />
											<Button
												variant={count > 0 ? "default" : "outline"}
												onClick={() => setQty(it.code, count > 0 ? 0 : 1)}
												className="rounded-2xl"
											>
												{count > 0 ? "Remove" : "Add"}
											</Button>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}