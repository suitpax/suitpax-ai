"use client"

import Image from "next/image"

export default function RecentActivitySidebar({ events: external }: { events?: Array<{ id: number|string; user: string; action: string; time: string; avatar_url?: string }> }) {
	const events = external && external.length ? external : [
		{ id: 1, user: "Alice", action: "booked flight MAD → LHR", time: "4m" },
		{ id: 2, user: "Bob", action: "submitted expense report", time: "1h" },
		{ id: 3, user: "Carol", action: "checked price trends", time: "2h" },
	]
	return (
		<div className="rounded-xl border border-gray-200 bg-white/80 p-3">
			<div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Recent activity</div>
			<div className="space-y-2">
				{events.map((e) => (
					<div key={e.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 focus-within:ring-1 focus-within:ring-gray-300">
						<div className="h-6 w-6 rounded-full border border-gray-200 bg-gray-100 overflow-hidden">
							<Image src={e.avatar_url || "/avatars/placeholder.png"} alt="avatar" width={24} height={24} className="h-full w-full object-cover" />
						</div>
						<div className="min-w-0">
							<div className="text-[12px] text-gray-900 truncate">{e.user} {e.action}</div>
							<div className="text-[10px] text-gray-500">{e.time} ago</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}