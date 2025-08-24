"use client"

import { motion } from "framer-motion"

export default function AIMeetingsAttachment() {
	const slots = [
		{ day: "Mon", time: "10:00", title: "Policy review" },
		{ day: "Tue", time: "14:00", title: "Supplier call" },
		{ day: "Thu", time: "16:30", title: "Travel analytics" },
	]
	return (
		<section className="py-10">
			<div className="max-w-5xl mx-auto px-4">
				<h3 className="text-xl md:text-2xl font-medium tracking-tighter mb-4">AI Meetings</h3>
				<div className="rounded-2xl border border-gray-800 bg-[#0B0B0C] p-4">
					<div className="grid grid-cols-7 gap-2 text-[11px] text-gray-400">
						{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
							<div key={d} className="text-center py-1">{d}</div>
						))}
					</div>
					<div className="mt-2 grid grid-cols-7 gap-2">
						{Array.from({ length: 28 }).map((_, i) => (
							<div key={i} className="h-16 rounded-xl border border-gray-800 bg-black/40" />
						))}
					</div>
					<div className="mt-3 space-y-2">
						{slots.map((s, idx) => (
							<motion.div key={idx} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} viewport={{ once: true }} className="flex items-center justify-between rounded-xl border border-gray-800 bg-black/50 px-3 py-2">
								<div className="text-xs text-gray-300 font-medium">{s.title}</div>
								<div className="text-[10px] text-gray-500">{s.day} • {s.time}</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}