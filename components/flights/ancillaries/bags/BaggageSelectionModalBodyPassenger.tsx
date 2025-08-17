"use client"

import React from "react"

interface Props {
	passenger: { id: string; name: string }
	children?: React.ReactNode
}

export default function BaggageSelectionModalBodyPassenger({ passenger, children }: Props) {
	return (
		<div className="rounded-2xl border border-gray-200 p-3 bg-gray-50">
			<div className="text-sm font-medium text-gray-900 mb-2">{passenger.name}</div>
			{children}
		</div>
	)
}