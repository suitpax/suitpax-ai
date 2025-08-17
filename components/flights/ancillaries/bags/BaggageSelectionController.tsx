"use client"

import React, { useMemo, useState } from "react"
import BaggageSelectionCard from "./BaggageSelectionCard"

interface AncillaryItem {
	code: string
	title: string
	description?: string
	amount: number
	currency: string
	category?: string
}

interface PassengerRef { id: string; name: string }

interface Props {
	ancillaries: AncillaryItem[]
	passengers?: PassengerRef[]
	onChange?: (selection: Record<string, number>) => void
}

export default function BaggageSelectionController({ ancillaries, passengers = [], onChange }: Props) {
	const baggageOptions = useMemo(() => ancillaries.filter(a => (a.category || '').includes('baggage') || a.code.toLowerCase().includes('bag')), [ancillaries])
	const [selection, setSelection] = useState<Record<string, number>>({})

	const set = (next: Record<string, number>) => {
		setSelection(next)
		onChange?.(next)
	}

	if (baggageOptions.length === 0) return null
	return (
		<BaggageSelectionCard options={baggageOptions} passengers={passengers} selection={selection} onChange={set} />
	)
}