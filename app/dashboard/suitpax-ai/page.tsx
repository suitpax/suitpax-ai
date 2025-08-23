"use client"

import { useEffect, useRef, useState } from "react"

export default function SuitpaxAISimple() {
	const [agent, setAgent] = useState<"core" | "flights" | "hotels">("core")
	const [value, setValue] = useState("")
	const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
	const [isLoading, setIsLoading] = useState(false)
	const listRef = useRef<HTMLDivElement>(null)

	useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }) }, [messages])

	const send = async () => {
		if (!value.trim() || isLoading) return
		const userMsg = { role: "user" as const, content: value.trim() }
		setMessages(prev => [...prev, userMsg])
		setValue("")
		setIsLoading(true)
		try {
			const res = await fetch("/api/chat/stream", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMsg.content, history: messages, agent }) })
			if (!res.ok || !res.body) throw new Error("Stream failed")
			let acc = ""
			const reader = res.body.getReader()
			const decoder = new TextDecoder()
			while (true) {
				const { value: chunk, done } = await reader.read()
				if (done) break
				acc += decoder.decode(chunk)
				setMessages(prev => [...prev.filter((m, i) => i !== prev.length - 1 || m.role !== "assistant"), { role: "assistant", content: acc }])
			}
		} catch {
			setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }])
		} finally { setIsLoading(false) }
	}

	return (
		<div className="min-h-screen bg-white">
			<header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
				<div className="mx-auto max-w-4xl px-4 py-2 flex items-center justify-between">
					<div className="text-sm font-medium">Suitpax AI</div>
					<div className="inline-flex items-center gap-2 border border-gray-200 rounded-xl bg-white px-2 py-1">
						<button onClick={() => setAgent("core")} className={`px-2 py-0.5 rounded-lg text-[10px] ${agent === "core" ? "bg-black text-white" : "text-gray-700"}`}>Core</button>
						<button onClick={() => setAgent("flights")} className={`px-2 py-0.5 rounded-lg text-[10px] ${agent === "flights" ? "bg-black text-white" : "text-gray-700"}`}>Flights</button>
						<button onClick={() => setAgent("hotels")} className={`px-2 py-0.5 rounded-lg text-[10px] ${agent === "hotels" ? "bg-black text-white" : "text-gray-700"}`}>Hotels</button>
					</div>
				</div>
			</header>
			<main className="mx-auto max-w-3xl px-4 py-6">
				<div ref={listRef} className="min-h-[60vh] max-h-[65vh] overflow-y-auto border border-gray-200 rounded-xl p-4 space-y-3">
					{messages.map((m, i) => (
						<div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
							<div className={`inline-block rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}>{m.content}</div>
						</div>
					))}
					{messages.length === 0 && <div className="text-sm text-gray-500">Ask anything about travel, expenses, or code…</div>}
				</div>
				<div className="mt-3 flex gap-2">
					<input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type your message…" className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 text-sm" onKeyDown={(e) => { if (e.key === "Enter") send() }} />
					<button onClick={send} disabled={!value.trim() || isLoading} className="rounded-2xl bg-black text-white px-4 text-sm">{isLoading ? "…" : "Send"}</button>
				</div>
			</main>
		</div>
	)
}
