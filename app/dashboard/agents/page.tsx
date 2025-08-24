"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AgentsPage() {
	const [agents, setAgents] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch("/api/agents")
				const json = await res.json()
				setAgents(json.agents || [])
			} finally { setLoading(false) }
		}
		load()
	}, [])

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-medium tracking-tight">Agents</h1>
				<Link href="/dashboard/agents/new"><Button className="rounded-xl">New Agent</Button></Link>
			</div>
			{loading ? (
				<div className="text-sm text-gray-600">Loading…</div>
			) : agents.length === 0 ? (
				<div className="text-sm text-gray-600">No agents yet.</div>
			) : (
				<ul className="space-y-2">
					{agents.map((a) => (
						<li key={a.id} className="rounded-xl border border-gray-200 bg-white p-3">
							<Link href={`/dashboard/agents/${a.id}`} className="text-sm font-medium text-gray-900 hover:underline">{a.name}</Link>
							<div className="text-xs text-gray-600">{a.description}</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}