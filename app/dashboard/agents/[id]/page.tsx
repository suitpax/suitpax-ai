"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ai/loader"

export default function AgentDetailPage() {
	const params = useParams() as { id: string }
	const router = useRouter()
	const [agent, setAgent] = useState<any>(null)
	const [input, setInput] = useState("")
	const [output, setOutput] = useState("")
	const [running, setRunning] = useState(false)

	useEffect(() => {
		const load = async () => {
			const res = await fetch(`/api/agents/${params.id}`)
			const json = await res.json()
			setAgent(json.agent)
		}
		load()
	}, [params.id])

	const run = async () => {
		if (!input.trim()) return
		setRunning(true)
		setOutput("")
		try {
			const res = await fetch(`/api/agents/${params.id}/run`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: input }),
			})
			const json = await res.json()
			setOutput(json.response || "")
		} finally { setRunning(false) }
	}

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-medium tracking-tight">{agent?.name || "Agent"}</h1>
				<Button variant="outline" className="rounded-xl" onClick={() => router.push("/dashboard/agents")}>Back</Button>
			</div>
			<div className="grid gap-3 max-w-3xl">
				<div className="text-sm text-gray-700">{agent?.description}</div>
				<textarea className="border rounded-xl px-3 py-2 min-h-28" placeholder="Ask the agent…" value={input} onChange={(e) => setInput(e.target.value)} />
				<div className="flex items-center gap-2">
					<Button className="rounded-xl" onClick={run} disabled={running || !input.trim()}>{running ? "Running…" : "Run"}</Button>
					{running && <Loader size={16} className="text-gray-700" />}
				</div>
				{output && (
					<div className="rounded-xl border border-gray-200 bg-white p-3 text-sm whitespace-pre-wrap">
						{output}
					</div>
				)}
			</div>
		</div>
	)
}