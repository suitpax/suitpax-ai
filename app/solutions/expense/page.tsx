"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function ExpensePage() {
	return (
		<div className="relative w-full">
			<section className="container mx-auto max-w-5xl px-4 md:px-6 py-24">
				<motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-medium tracking-tighter text-black leading-tight">
					Expense Management
				</motion.h1>
				<p className="mt-3 text-gray-600 text-base md:text-lg">
					Automated receipt scanning, smart categorization, and real-time policy checks. Close your books faster with AI.
				</p>
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Scan & parse receipts</h2>
						<p className="text-sm text-gray-600 mt-2">Upload receipts and invoices — AI extracts totals, VAT, merchants, and categories.</p>
					</div>
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Bank sync</h2>
						<p className="text-sm text-gray-600 mt-2">Connect business accounts to reconcile transactions automatically.</p>
					</div>
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Policy compliance</h2>
						<p className="text-sm text-gray-600 mt-2">Flag out-of-policy expenses and route approvals instantly.</p>
					</div>
					<div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
						<h2 className="text-xl font-medium tracking-tight text-gray-900">Reports & exports</h2>
						<p className="text-sm text-gray-600 mt-2">One-click reports to PDF/CSV and seamless ERP exports.</p>
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
