"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CfarOption {
	code: string
	title: string
	description?: string
	amount: number
	currency: string
}

interface Props {
	option: CfarOption
	selected: boolean
	onToggle: (selected: boolean) => void
	className?: string
}

export default function CfarSelectionCard({ option, selected, onToggle, className = "" }: Props) {
	return (
		<div className={`rounded-2xl border border-gray-200 bg-white p-3 ${className}`}>
			<div className="flex items-start justify-between">
				<div>
					<div className="text-sm font-medium text-gray-900 tracking-tighter">{option.title}</div>
					{option.description && <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>}
				</div>
				<Badge className="rounded-2xl bg-white text-gray-900 border-gray-200">
					{new Intl.NumberFormat('en-US', { style: 'currency', currency: option.currency, maximumFractionDigits: 0 }).format(option.amount)}
				</Badge>
			</div>
			<div className="mt-3 flex items-center justify-end">
				<Button variant={selected ? 'default' : 'outline'} onClick={() => onToggle(!selected)} className="rounded-2xl">
					{selected ? 'Remove' : 'Add'}
				</Button>
			</div>
		</div>
	)
}