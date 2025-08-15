"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function BusinessTravelPage() {
	return (
		<div className="relative w-full">
			<section className="container mx-auto max-w-5xl px-4 md:px-6 py-24">
				<motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-medium tracking-tighter text-black leading-tight">
					Business Travel
				</motion.h1>
				<p className="mt-3 text-gray-600 text-base md:text-lg">
					AI-powered booking, policy compliance, and real-time assistance. Flights, hotels, trains, and more — all in one place.
				</p>
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Smart flight and hotel search</h2>
						<p className="text-sm text-gray-600 mt-2">Instantly find and book the best itineraries with AI-driven recommendations.</p>
					</div>
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Policies & approvals</h2>
						<p className="text-sm text-gray-600 mt-2">Automatic policy enforcement and one-click approvals across teams.</p>
					</div>
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">24/7 AI assistant</h2>
						<p className="text-sm text-gray-600 mt-2">Suitpax AI handles rebookings, delays, and itinerary changes in seconds.</p>
					</div>
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Duty of care</h2>
						<p className="text-sm text-gray-600 mt-2">Real-time traveler tracking and alerts to keep teams safe on the go.</p>
					</div>
				</div>
				<div className="mt-10">
					<Link href="/auth/signup" className="inline-flex items-center px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 text-sm font-medium">
						Get started
					</Link>
				</div>
			</section>
		</div>
	)
}
