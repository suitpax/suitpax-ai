"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AgenticShowcase({ className = "" }: { className?: string }) {
	return (
		<section className={cn("rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur", className)}>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Showcase</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
				<div className="rounded-xl border border-gray-200 p-4">
					<div className="text-sm font-medium text-gray-900">Agentic flight planning</div>
					<div className="text-sm text-gray-700">From intent to multi-leg itinerary with policy checks and NDC ancillaries.</div>
				</div>
				<div className="rounded-xl border border-gray-200 p-4">
					<div className="text-sm font-medium text-gray-900">Context + web</div>
					<div className="text-sm text-gray-700">Search providers (Exa/Brave), citations, and source-aware reasoning.</div>
				</div>
				<div className="rounded-xl border border-gray-200 p-4">
					<div className="text-sm font-medium text-gray-900">Memory & approvals</div>
					<div className="text-sm text-gray-700">Preferences, budgets, and team approvals baked into the loop.</div>
				</div>
				<div className="rounded-xl border border-gray-200 p-4">
					<div className="text-sm font-medium text-gray-900">Suitpax AI chat</div>
					<div className="text-sm text-gray-700">Try the core chat experience and see agentic concepts in action.</div>
					<Link href="/dashboard/suitpax-ai" className="text-[12px] underline">Open Suitpax AI →</Link>
				</div>
			</div>
		</section>
	)
}