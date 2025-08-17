"use client"

import React, { useMemo } from "react"

const DASHBOARD_TAGLINES = [
	"Optimizing your travel workflow…",
	"Curating smarter flight options…",
	"Syncing policies and perks…",
	"Unlocking corporate fares…",
	"Routing through the cloud…",
	"Packing your dashboard…",
	"Clearing runway for takeoff…",
	"Fueling insights and analytics…",
	"Upgrading your experience…",
	"Scanning loyalty benefits…",
	"Indexing trips and tasks…",
	"Warming up Suitpax engines…",
	"Negotiating better fares…",
	"Mapping your next journey…",
	"Connecting to global inventory…",
]

export function SmallSessionLoader({ label = "Signing you in…", className = "" }: { label?: string; className?: string }) {
	return (
		<div className={`inline-flex items-center gap-2 ${className}`}>
			<span className="inline-block h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
			<span className="text-sm text-gray-900 tracking-tight">{label}</span>
		</div>
	)
}

export function DashboardLoadingScreen({ className = "" }: { className?: string }) {
	const tagline = useMemo(() => DASHBOARD_TAGLINES[Math.floor(Math.random() * DASHBOARD_TAGLINES.length)], [])
	return (
		<div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
			<div className="text-center">
				<div className="mx-auto h-12 w-12 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin mb-4" />
				<div className="relative inline-block">
					<span className="text-base font-medium text-gray-700 tracking-tight relative z-10">{tagline}</span>
					<span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
				</div>
				<style jsx>{`
				@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
				`}</style>
			</div>
		</div>
	)
}