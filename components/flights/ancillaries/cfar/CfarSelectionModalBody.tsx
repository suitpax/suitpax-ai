"use client"

import React from "react"
import CfarSelectionCard from "./CfarSelectionCard"

interface CfarOption { code: string; title: string; description?: string; amount: number; currency: string }

interface Props {
	option: CfarOption
	selected: boolean
	onToggle: (selected: boolean) => void
}

export default function CfarSelectionModalBody({ option, selected, onToggle }: Props) {
	return (
		<div className="space-y-3">
			<p className="text-sm text-gray-700">Cancel For Any Reason (CFAR) allows you to cancel your trip for reasons not typically covered by standard airlines policies. Terms apply.</p>
			<CfarSelectionCard option={option} selected={selected} onToggle={onToggle} />
		</div>
	)
}