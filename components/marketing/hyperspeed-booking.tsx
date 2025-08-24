"use client"

import { motion } from "framer-motion"

export default function HyperspeedBooking() {
	const items = [
		{ title: "1‑Click hold", desc: "Hold best fare while approvals run." },
		{ title: "Auto‑rebook", desc: "Rebook on price drop or disruption." },
		{ title: "Seat & meals", desc: "Apply traveler preferences instantly." },
		{ title: "Smart ancillaries", desc: "Bag/seats upsell within policy." },
		{ title: "Policy guardrails", desc: "Detect over‑budget legs and route alternatives." },
	]
	return (
		<section className="py-10">
			<div className="max-w-6xl mx-auto px-4">
				<h3 className="text-xl md:text-2xl font-medium tracking-tighter mb-4">Hyperspeed booking</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{items.map((it, idx) => (
						<motion.div key={it.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }} viewport={{ once: true }} className="rounded-xl border border-gray-200 p-4 bg-white/80">
							<div className="text-sm font-medium text-gray-900">{it.title}</div>
							<div className="text-sm text-gray-700">{it.desc}</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
