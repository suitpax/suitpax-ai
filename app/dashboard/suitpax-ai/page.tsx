"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, Mic, Square } from "lucide-react"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from "@/components/prompt-kit/chat-container"
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/prompt-kit/prompt-input"
import { useChatStream } from "@/hooks/use-chat-stream"
import Markdown from "@/components/prompt-kit/markdown"
import { VoiceAIProvider, useVoiceAI } from "@/contexts/voice-ai-context"
import { Loader } from "@/components/prompt-kit/loader"

type Msg = { id: string; role: "user" | "assistant"; content: string; ts: number }

function SuitpaxAIInner() {
	const [agent, setAgent] = useState<"core" | "flights" | "hotels">("core")
	const [input, setInput] = useState("")
	const [messages, setMessages] = useState<Msg[]>([])
	const [loading, setLoading] = useState(false)
	const { isStreaming, start } = useChatStream()
	const { speak, state: voiceState, startListening, stopListening } = useVoiceAI()

	useEffect(() => {
		const handler = (e: any) => { if (e?.detail?.agent) setAgent(e.detail.agent) }
		window.addEventListener("suitpax-agent-change", handler as any)
		return () => window.removeEventListener("suitpax-agent-change", handler as any)
	}, [])

	const avatars = useMemo(() => ({ core: "/agents/agent-1.png", flights: "/agents/agent-15.png", hotels: "/agents/agent-50.png" }), [])

	const handleSend = async () => {
		if (!input.trim() || loading || isStreaming) return
		const userMsg: Msg = { id: String(Date.now()), role: "user", content: input.trim(), ts: Date.now() }
		setMessages(prev => [...prev, userMsg])
		setInput("")
		setLoading(true)
		let streamed = ""
		try {
			await start({ message: userMsg.content, history: messages.map(m => ({ role: m.role, content: m.content })), agent }, async (token) => {
				streamed += token
				setMessages(prev => {
					const others = prev.filter(m => m.id !== "streaming")
					return [...others, { id: "streaming", role: "assistant", content: streamed, ts: Date.now() }]
				})
			})
			try { await speak(streamed) } catch {}
		} finally {
			setMessages(prev => prev.map(m => m.id === "streaming" ? { ...m, id: String(Date.now()) } : m))
			setLoading(false)
		}
	}

	return (
		<VantaHaloBackground className="fixed inset-0">
			<div className="absolute inset-0 flex flex-col bg-white/70">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/60 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
					<div className="p-3 sm:p-4 lg:p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3 sm:space-x-4">
								<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
									<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={40} height={40} className="w-full h-full object-contain p-1" />
								</div>
								<div className="min-w-0 flex-1">
									<h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tighter truncate"><em className="font-serif italic">Suitpax AI</em></h1>
									<p className="text-xs md:text-sm text-gray-600 font-light hidden sm:block">Try the superpowers ✨</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 sm:space-x-5 flex-shrink-0">
								<Link href="/dashboard" className="text-xs text-gray-600 hover:text-black inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2 py-1 hover:bg-gray-50" aria-label="Back to dashboard">
									<ArrowLeft className="h-3.5 w-3.5" />
								</Link>
								<div className="inline-flex items-center gap-2">
									<span className={`inline-flex items-center rounded-xl px-2 py-0.5 text-[10px] font-medium ${voiceState.isSpeaking ? 'bg-green-500/10 text-green-700' : 'bg-gray-900/5 text-gray-900'}`}>
										<span className={`w-1.5 h-1.5 rounded-full ${voiceState.isSpeaking ? 'bg-green-600 animate-pulse' : 'bg-gray-900'} mr-1`}></span>
										{voiceState.isSpeaking ? 'Speaking' : 'Online'}
									</span>
									<ButtonIcon onClick={voiceState.isListening ? stopListening : startListening}>
										{voiceState.isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
									</ButtonIcon>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Chat */}
				<div className="flex-1 min-h-0 relative">
					<ChatContainerRoot className="h-full">
						<ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 relative min-h-[50vh] md:min-h-[60vh]">
							{messages.length === 0 && !loading && (
								<div className="space-y-4">
									<div className="flex items-center justify-center py-6 sm:py-8">
										<div className="text-center">
											<motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#7a7a7a,#111)] bg-[length:200%_100%] animate-pulse">Ask anything. Travel. Business. Code.</motion.h2>
											<p className="mt-2 text-xs sm:text-sm text-gray-600">Powered by Suitpax AI</p>
										</div>
									</div>
								</div>
							)}
							{messages.map((m) => (
								<div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
									<div className={`${m.role === "user" ? "max-w-[85%] sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white" : "max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900"}`}>
										{m.role === "assistant" && (
											<div className="flex items-center space-x-2 mb-2">
												<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
													<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={24} height={24} className="w-full h-full object-contain p-0.5" />
												</div>
												<span className="text-xs font-medium text-gray-700">Suitpax AI</span>
											</div>
										)}
										<div className="prose prose-sm max-w-none prose-p:mb-2 prose-pre:mb-0">
											<Markdown>{m.content}</Markdown>
										</div>
										<p className={`text-xs mt-2 ${m.role === "user" ? "text-gray-300" : "text-gray-500"}`}>{new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
									</div>
								</div>
							))}
						</ChatContainerContent>
						<ChatContainerScrollAnchor />
					</ChatContainerRoot>
				</div>

				{/* Input */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/60 backdrop-blur-sm border-t border-gray-200 flex-shrink-0">
					<div className="p-3 sm:p-4 lg:p-6">
						<div className="max-w-4xl mx-auto">
							<PromptInput value={input} onValueChange={setInput} isLoading={loading || isStreaming} onSubmit={handleSend} className="w-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
								<PromptInputTextarea placeholder="Ask me about flights, hotels, travel planning, or code/design…" className="text-gray-900 placeholder-gray-500 font-light text-sm sm:text-base" disabled={loading || isStreaming} />
								<PromptInputActions>
									<PromptInputAction aria-label="Send" onClick={handleSend} disabled={!input.trim() || loading || isStreaming}>{loading || isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">Send</span>}</PromptInputAction>
								</PromptInputActions>
							</PromptInput>
							<p className="mt-2 text-[10px] text-gray-600 flex items-center justify-center gap-2"><span className="text-[11px]">Technology by</span><Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={14} height={14} className="inline-block" /></p>
						</div>
					</div>
				</motion.div>
			</div>
		</VantaHaloBackground>
	)
}

function ButtonIcon({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
	return (
		<button onClick={onClick} className="h-7 w-7 inline-flex items-center justify-center rounded-2xl hover:bg-gray-100">
			{children}
		</button>
	)
}

export default function SuitpaxAIPage() {
	return (
		<VoiceAIProvider initialLanguage="es-ES">
			<SuitpaxAIInner />
		</VoiceAIProvider>
	)
}
