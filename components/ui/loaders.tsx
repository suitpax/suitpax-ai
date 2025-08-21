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
	"Checking compliance and approvals…",
	"Saving your preferences…",
	"Securing your session…",
	"Preparing executive summary…",
]

export function SmallSessionLoader({ label = "Signing you in…", className = "" }: { label?: string; className?: string }) {
	return (
		<div className={`inline-flex items-center gap-3 ${className}`}>
			<span className="inline-block h-5 w-5 rounded-full border-3 border-black border-t-transparent animate-spin" />
			<span className="text-base text-black tracking-tight font-medium">{label}</span>
		</div>
	)
}

export function DashboardLoadingScreen({ className = "" }: { className?: string }) {
	const tagline = useMemo(() => DASHBOARD_TAGLINES[Math.floor(Math.random() * DASHBOARD_TAGLINES.length)], [])
	return (
		<div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
			<div className="text-center">
				<div className="mx-auto h-16 w-16 rounded-full border-4 border-black border-t-transparent animate-spin mb-5" />
				<div className="inline-block">
					<span className="text-lg font-medium text-black tracking-tight">{tagline}</span>
				</div>
			</div>
		</div>
	)
}

// Orb loader (blue/black/gray conic gradient)
export const loader = ({ size = "sm", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) => {
	const dims = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4"
	return (
		<span
			aria-hidden
			className={`inline-block ${dims} rounded-full animate-spin ${className}`}
			style={{
				background: "conic-gradient(from 0deg, #93c5fd 0%, #111827 40%, #e5e7eb 70%, #93c5fd 100%)",
				WebkitMask: "radial-gradient(circle, transparent 55%, black 56%)",
				mask: "radial-gradient(circle, transparent 55%, black 56%)",
			}}
		/>
	)
}