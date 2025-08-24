"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NewAgentPage() {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [persona, setPersona] = useState("")
	const [saving, setSaving] = useState(false)
	const router = useRouter()

	const handleSave = async () => {
		if (!name.trim()) return
		setSaving(true)
		try {
			const res = await fetch("/api/agents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, description, persona, config: { model: "claude-3-7-sonnet-20250219", temperature: 0.7, maxTokens: 1200 } }),
			})
			const json = await res.json()
			if (res.ok && json.agent?.id) router.push(`/dashboard/agents/${json.agent.id}`)
		} finally { setSaving(false) }
	}

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<h1 className="text-2xl font-medium tracking-tight">New Agent</h1>
			<div className="grid gap-3 max-w-2xl">
				<input className="border rounded-xl px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="border rounded-xl px-3 py-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
				<textarea className="border rounded-xl px-3 py-2 min-h-32" placeholder="Persona / System prompt" value={persona} onChange={(e) => setPersona(e.target.value)} />
				<Button className="rounded-xl" onClick={handleSave} disabled={saving || !name.trim()}>{saving ? "Saving…" : "Create"}</Button>
			</div>
		</div>
	)
}