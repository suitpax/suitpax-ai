"use client"

import { cn } from "@/lib/utils"

export default function AgenticOverview({ className = "" }: { className?: string }) {
	return (
		<section className={cn("rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur", className)}>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Agentic AI Overview</h2>
			<p className="mt-2 text-sm text-gray-700">Suitpax Agentic AI orchestrates tool-using, goal-driven agents with MCP, real-time web, and NDC to plan, book, and optimize business travel end-to-end.</p>
			<ul className="mt-3 grid gap-2 text-sm text-gray-800 list-disc pl-4">
				<li>Tool-calling with safety and policy enforcement</li>
				<li>Web search context and citation-aware answers</li>
				<li>NDC integration for fares, ancillaries, and seat maps</li>
				<li>Memory of preferences and policy constraints</li>
			</ul>
		</section>
	)
}