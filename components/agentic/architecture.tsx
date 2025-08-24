"use client"

import { cn } from "@/lib/utils"

export default function AgenticArchitecture({ className = "" }: { className?: string }) {
	return (
		<section className={cn("rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur", className)}>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Architecture</h2>
			<div className="mt-3 text-sm text-gray-700 space-y-2">
				<p>MCP hub + tool registry, policy filter, agent loop, and observability. Components communicate via typed interfaces, enabling safe tool execution and audit trails.</p>
				<ul className="list-disc pl-4">
					<li>Prompt system: domain + style + tool context builders</li>
					<li>Tool registry: web search (Exa/Brave), Duffel flights, OCR, finance</li>
					<li>Run logging: usage, traces, and outcomes (Supabase)</li>
					<li>RBAC: user plan and team-level permissions (RLS)</li>
				</ul>
			</div>
		</section>
	)
}