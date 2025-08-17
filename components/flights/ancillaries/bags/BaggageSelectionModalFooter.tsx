"use client"

import React from "react"

export default function BaggageSelectionModalFooter({ onClose }: { onClose: () => void }) {
	return (
		<div className="mt-3 flex items-center justify-end gap-2">
			<button onClick={onClose} className="rounded-2xl border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm">Close</button>
		</div>
	)
}