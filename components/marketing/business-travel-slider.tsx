"use client"

import { motion } from "framer-motion"

export function MemoUserUI() {
	return (
		<section className="py-10">
			<div className="max-w-6xl mx-auto px-4">
				<div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
					<h3 className="font-serif text-xl tracking-tighter text-gray-900">The way you travel is about to change. Forever.</h3>
					<form className="mt-3 flex gap-2">
						<input type="email" placeholder="Work email" className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black" />
						<button type="submit" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90">Get early access</button>
					</form>
					<div className="mt-2 text-xs text-gray-500 font-light">By continuing, you agree to our Terms and Privacy.</div>
				</div>
			</div>
		</section>
	)
}

export default function BusinessTravelSlider() {
	return (
		<section className="py-10">
			<div className="max-w-6xl mx-auto px-4">
				<h3 className="text-xl md:text-2xl font-medium tracking-tighter mb-4">Business travel slider</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					{["Policy","Savings","Experience"].map((t, idx) => (
						<motion.div key={t} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }} viewport={{ once: true }} className="rounded-xl border border-gray-200 p-4 bg-white/80">
							<div className="text-sm font-medium text-gray-900">{t}</div>
							<div className="text-sm text-gray-700">High‑signal copy about {t.toLowerCase()} benefits.</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
