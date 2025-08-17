"use client"

import React from "react"

interface CounterProps {
	value: number
	min?: number
	max?: number
	onChange: (next: number) => void
	className?: string
	size?: "sm" | "md"
}

export default function Counter({ value, min = 0, max, onChange, className = "", size = "md" }: CounterProps) {
	const canDecrement = value > (min ?? 0)
	const canIncrement = typeof max === "number" ? value < max : true
	const pad = size === "sm" ? "px-2 py-1" : "px-3 py-1.5"
	const text = size === "sm" ? "text-sm" : "text-base"

	return (
		<div className={`inline-flex items-center rounded-2xl border border-gray-300 bg-white ${className}`}>
			<button
				type="button"
				onClick={() => canDecrement && onChange(value - 1)}
				disabled={!canDecrement}
				className={`rounded-l-2xl ${pad} ${text} ${canDecrement ? "text-gray-900 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"}`}
			>
				-
			</button>
			<div className={`min-w-8 text-center ${text} text-gray-900 select-none`}>{value}</div>
			<button
				type="button"
				onClick={() => canIncrement && onChange(value + 1)}
				disabled={!canIncrement}
				className={`rounded-r-2xl ${pad} ${text} ${canIncrement ? "text-gray-900 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"}`}
			>
				+
			</button>
		</div>
	)
}