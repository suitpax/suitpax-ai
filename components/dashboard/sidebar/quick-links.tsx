"use client"

import Link from "next/link"
import { PiAirplaneTiltBold, PiChartBarBold, PiChatsBold, PiMicrophoneBold } from "react-icons/pi"

export default function QuickLinksSidebar() {
	const items = [
		{ name: "Flights", href: "/dashboard/flights", icon: PiAirplaneTiltBold },
		{ name: "Analytics", href: "/dashboard/analytics", icon: PiChartBarBold },
		{ name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatsBold },
		{ name: "Voice AI", href: "/dashboard/voice-ai", icon: PiMicrophoneBold },
	]
	return (
		<div className="grid grid-cols-2 gap-2">
			{items.map((it) => (
				<Link
					key={it.name}
					href={it.href}
					className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-2.5 py-2 text-[12px] text-gray-900 hover:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
				>
					<it.icon className="h-3.5 w-3.5" />
					<span className="truncate">{it.name}</span>
				</Link>
			))}
		</div>
	)
}