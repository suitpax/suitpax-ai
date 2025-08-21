"use client"

export default function AlertsCardSidebar() {
	const alerts = [
		{ id: 1, title: "Price drop on MAD → LHR", time: "2h ago" },
		{ id: 2, title: "Expense report ready", time: "Today" },
		{ id: 3, title: "Policy update: Hotels", time: "Yesterday" },
	]
	return (
		<div className="rounded-xl border border-gray-200 bg-white/80 p-3">
			<div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Alerts</div>
			<div className="space-y-2">
				{alerts.map((a) => (
					<div key={a.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50 focus-within:ring-1 focus-within:ring-gray-300">
						<div className="text-[12px] text-gray-900 truncate">{a.title}</div>
						<div className="text-[10px] text-gray-500 ml-2 shrink-0">{a.time}</div>
					</div>
				))}
			</div>
		</div>
	)
}