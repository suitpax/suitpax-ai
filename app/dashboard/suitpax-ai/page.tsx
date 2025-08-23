"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import ChatHeader from "@/components/prompt-kit/chat-header"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { Message, MessageAvatar, MessageContent } from "@/components/prompt-kit/message"
import { PromptInput, PromptInputTextarea, PromptInputActions, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { Loader } from "@/components/prompt-kit/loader"

export default function SuitpaxAI() {
	const [agent, setAgent] = useState<"core" | "flights" | "hotels">("core")
	const [value, setValue] = useState("")
	const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
	const [isLoading, setIsLoading] = useState(false)
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handler = (e: any) => {
			if (e?.detail?.agent) {
				setAgent(e.detail.agent)
				if (typeof window !== "undefined" && (window as any).va) {
					;(window as any).va("chat_agent_select", { agent: e.detail.agent })
				}
			}
		}
		window.addEventListener("suitpax-agent-change", handler as any)
		return () => window.removeEventListener("suitpax-agent-change", handler as any)
	}, [])

	const avatars = useMemo(() => ({
		core: "/agents/agent-1.png",
		flights: "/agents/agent-15.png",
		hotels: "/agents/agent-50.png",
	}), [])

	const send = async () => {
		if (!value.trim() || isLoading) return
		const userMsg = { role: "user" as const, content: value.trim() }
		setMessages(prev => [...prev, userMsg])
		setValue("")
		setIsLoading(true)
		try {
			if (typeof window !== "undefined" && (window as any).va) {
				;(window as any).va("chat_message_sent", { agent, length: userMsg.content.length })
			}
			const res = await fetch("/api/chat/stream", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: userMsg.content, history: messages, agent }),
			})
			if (!res.ok || !res.body) throw new Error("Stream failed")
			let acc = ""
			const reader = res.body.getReader()
			const decoder = new TextDecoder()
			while (true) {
				const { value: chunk, done } = await reader.read()
				if (done) break
				acc += decoder.decode(chunk)
				setMessages(prev => {
					const withoutTailAssistant = prev[prev.length - 1]?.role === "assistant" ? prev.slice(0, -1) : prev
					return [...withoutTailAssistant, { role: "assistant" as const, content: acc }]
				})
			}
			if (typeof window !== "undefined" && (window as any).va) {
				;(window as any).va("chat_message_received", { agent, length: acc.length })
			}
		} catch {
			setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }])
		} finally { setIsLoading(false) }
	}

	return (
		<div className="min-h-screen bg-white">
			<ChatHeader title="Suitpax AI" subtitle="Ask anything. Travel. Business. Code." backHref="/dashboard" />
			<main className="mx-auto max-w-3xl px-3 md:px-4 py-4">
				<ChatContainer className="h-[65vh] border border-gray-200 rounded-xl p-3">
					{messages.length === 0 && (
						<div className="text-sm text-gray-500">Try: "Find me a flight to London next Tuesday under €300"</div>
					)}
					{messages.map((m, i) => (
						<Message key={i} className={m.role === "user" ? "justify-end" : "justify-start"}>
							{m.role === "assistant" && (
								<MessageAvatar src={avatars[agent]} alt="Agent" />
							)}
							<MessageContent markdown={true} className={m.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"}>
								{m.content}
							</MessageContent>
						</Message>
					))}
					<div ref={bottomRef} />
				</ChatContainer>
				<div className="mt-3">
					<PromptInput isLoading={isLoading} value={value} onValueChange={setValue} onSubmit={send}>
						<PromptInputTextarea placeholder="Type your message…" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }} />
						<PromptInputActions>
							<PromptInputAction aria-label="Send" onClick={send} disabled={!value.trim() || isLoading}>
								{isLoading ? <Loader /> : <span className="text-xs">Send</span>}
							</PromptInputAction>
						</PromptInputActions>
					</PromptInput>
				</div>
			</main>
		</div>
	)
}
