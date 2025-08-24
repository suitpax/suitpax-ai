"use client"

import { cn } from "@/lib/utils"

const CAPABILITIES = [
	{ title: "Planning & Decomposition", desc: "Break down goals into steps with explicit tool plans." },
	{ title: "Tool Calling & Execution", desc: "Invoke web, flights, docs, and finance tools with guardrails." },
	{ title: "Memory & Context", desc: "Persist user and team preferences, inject into prompts." },
	{ title: "Monitoring & Recovery", desc: "Detect failures, retry with alternatives, and escalate." },
]

export default function AgenticCapabilities({ className = "" }: { className?: string }) {
	return (
		<section className={cn("rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur", className)}>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Capabilities</h2>
			<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
				{CAPABILITIES.map((c) => (
					<div key={c.title} className="rounded-xl border border-gray-200 p-4">
						<div className="text-sm font-medium text-gray-900">{c.title}</div>
						<div className="text-sm text-gray-700 mt-1">{c.desc}</div>
					</div>
				))}
			</div>
		</section>
	)
}