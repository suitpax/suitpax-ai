"use client"

import { useState } from "react"

export function AgentSelectorInline({ onChange }: { onChange?: (agent: "core" | "flights" | "hotels") => void }) {
	const [agent, setAgent] = useState<"core" | "flights" | "hotels">("core")
	const change = (value: "core" | "flights" | "hotels") => {
		setAgent(value)
		onChange?.(value)
		window.dispatchEvent(new CustomEvent("suitpax-agent-change", { detail: { agent: value } }))
	}
	return (
		<div className="inline-flex items-center gap-2 border border-gray-200 rounded-xl bg-white px-2 py-1">
			<button onClick={() => change("core")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] ${agent === "core" ? "bg-black text-white" : "text-gray-700"}`}>
				<img src="/agents/agent-1.png" alt="Core Agent" className="h-4 w-4 rounded" /> Core
			</button>
			<button onClick={() => change("flights")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] ${agent === "flights" ? "bg-black text-white" : "text-gray-700"}`}>
				<img src="/agents/agent-15.png" alt="Flights Agent" className="h-4 w-4 rounded" /> Flights
			</button>
			<button onClick={() => change("hotels")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] ${agent === "hotels" ? "bg-black text-white" : "text-gray-700"}`}>
				<img src="/agents/agent-50.png" alt="Hotels Agent" className="h-4 w-4 rounded" /> Hotels
			</button>
		</div>
	)
}