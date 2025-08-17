"use client"

import React from "react"

export default function BaggageSelectionModalHeader({ onClose }: { onClose: () => void }) {
	return (
		<div className="flex items-center justify-between mb-3">
			<div className="text-base font-medium text-gray-900">Select baggage</div>
			<button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
		</div>
	)
}