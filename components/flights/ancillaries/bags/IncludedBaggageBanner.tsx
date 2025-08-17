"use client"

import React from "react"

interface IncludedBaggageBannerProps {
	cabin?: string | null
	checked?: string | null
	className?: string
}

export default function IncludedBaggageBanner({ cabin, checked, className = "" }: IncludedBaggageBannerProps) {
	if (!cabin && !checked) return null
	return (
		<div className={`rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 ${className}`}>
			<div className="flex items-center justify-between">
				<div className="font-medium text-gray-900">Included baggage</div>
				<div className="flex items-center gap-2">
					{cabin && <span className="inline-flex items-center px-2 py-0.5 rounded-2xl border border-gray-200 bg-white">Cabin: {cabin}</span>}
					{checked && <span className="inline-flex items-center px-2 py-0.5 rounded-2xl border border-gray-200 bg-white">Checked: {checked}</span>}
				</div>
			</div>
		</div>
	)
}