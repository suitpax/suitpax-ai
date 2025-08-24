"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function MemoUserUI() {
	return (
		<section className="py-10">
			<div className="max-w-6xl mx-auto px-4">
				<div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
					<h3 className="font-serif text-xl tracking-tighter text-gray-900">The way you travel is about to change. Forever.</h3>
					<form className="mt-3 flex flex-col sm:flex-row gap-2">
						<input type="email" placeholder="Work email" className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black" />
						<button type="submit" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90">Get early access</button>
					</form>
					<div className="mt-2 text-xs text-gray-500 font-light">By continuing, you agree to our Terms and Privacy.</div>
				</div>
			</div>
		</section>
	)
}