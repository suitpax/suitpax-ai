"use client"

import { motion } from "framer-motion"

const AIRLINES = ["BA","U2","AF","LH","IB","KL","EK","QR"]

export default function AgenticMCP() {
	return (
		<section className="py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-6">
					<h2 className="text-2xl md:text-3xl font-medium tracking-tighter leading-none mb-2">Agentic MCP Orchestration</h2>
					<p className="text-gray-600 text-sm">Autonomous, tool-using agents executing end-to-end travel workflows</p>
				</motion.div>

				<div className="grid gap-4 md:grid-cols-2">
					{/* Left: Conversation & badges */}
					<motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="rounded-2xl border border-gray-200 bg-white/80 p-4">
						<div className="text-xs text-gray-500 mb-2">Example conversation</div>
						<div className="space-y-2 text-sm">
							<div className="flex gap-2"><span className="px-2 py-0.5 rounded-lg bg-gray-100 border text-gray-800">User</span><span>Need to get from LHR → BCN tomorrow, back Friday. Business. BA or AF preferred.</span></div>
							<div className="flex gap-2"><span className="px-2 py-0.5 rounded-lg bg-black text-white border border-black/10">Agent</span><span>Planning multi‑leg options. Checking BA, AF, and partner NDC. Applying company policy…</span></div>
							<div className="flex gap-2"><span className="px-2 py-0.5 rounded-lg bg-black text-white border border-black/10">Agent</span><span>Best Value: BA 478 (LHR→BCN 08:40–11:55), AF 1205 (BCN→CDG 18:15–20:25) + AF 1580 (CDG→LHR 21:20–21:50). Fully refundable per policy.</span></div>
							<div className="flex gap-2"><span className="px-2 py-0.5 rounded-lg bg-black text-white border border-black/10">Agent</span><span>Fastest: BA 474 direct both ways. Seat 3A reserved. Meals per profile. Price tracking enabled.</span></div>
							<div className="flex gap-2"><span className="px-2 py-0.5 rounded-lg bg-black text-white border border-black/10">Agent</span><span>Incident resolved: AF delay risk detected (CDG congestion). Proposed re-route via AMS with KL 1010 + KL 1671, maintains arrival window.</span></div>
						</div>
						<div className="mt-3 flex flex-wrap gap-2 text-[11px]">
							<span className="inline-flex items-center rounded-xl bg-gray-100 px-2 py-0.5 border border-gray-200">NDC</span>
							<span className="inline-flex items-center rounded-xl bg-gray-100 px-2 py-0.5 border border-gray-200">Policy‑aware</span>
							<span className="inline-flex items-center rounded-xl bg-gray-100 px-2 py-0.5 border border-gray-200">Web search</span>
							<span className="inline-flex items-center rounded-xl bg-gray-100 px-2 py-0.5 border border-gray-200">Approvals</span>
						</div>
					</motion.div>

					{/* Right: Airlines and itinerary cards */}
					<motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="space-y-3">
						<div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
							<div className="text-xs text-gray-500 mb-2">Airlines</div>
							<div className="grid grid-cols-4 gap-2">
								{AIRLINES.map(code => (
									<div key={code} className="flex items-center justify-center h-10 rounded-lg border border-gray-200 bg-white">
										<img src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${code}.svg`} alt={code} className="max-h-5" />
									</div>
								))}
							</div>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
							<div className="text-xs text-gray-500 mb-2">Itinerary</div>
							<div className="text-sm text-gray-900 font-medium">LHR → BCN (BA 474)</div>
							<div className="text-xs text-gray-600">08:40–11:55 • Direct • Seat 3A</div>
							<div className="mt-2 text-sm text-gray-900 font-medium">BCN → LHR (AF 1580 via CDG)</div>
							<div className="text-xs text-gray-600">18:15–21:50 • 1 stop CDG • Premium</div>
							<div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
								<div className="rounded-lg border border-gray-200 p-2">
									<div className="text-gray-500">Hotel</div>
									<div className="text-gray-900">Renaissance Barcelona</div>
								</div>
								<div className="rounded-lg border border-gray-200 p-2">
									<div className="text-gray-500">Ground</div>
									<div className="text-gray-900">Taxi + Metro T1</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}