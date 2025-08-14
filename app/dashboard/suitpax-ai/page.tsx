"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
	Loader2,
	ArrowUp,
	Paperclip,
	X,
	ArrowLeft,
	FileIcon,
	ImageIcon,
	FileText,
	FileCode,
	FileSpreadsheet,
	Music,
	Video,
	Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import Markdown from "@/components/prompt-kit/markdown"
import {
	PromptInput,
	PromptInputAction,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import {
	ChatContainerRoot,
	ChatContainerContent,
	ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse } from "@/components/prompt-kit/reasoning"
import { Switch } from "@/components/ui/switch"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import DocumentScanner from "@/components/prompt-kit/document-scanner"
import PromptSuggestions from "@/components/prompt-kit/prompt-suggestions"
import SourceList from "@/components/prompt-kit/source-list"
import { useChatStream } from "@/hooks/use-chat-stream"
import ChatFlightOffers from "@/components/prompt-kit/chat-flight-offers"
import { useSearchParams } from "next/navigation"

interface Message {
	id: string
	content: string
	role: "user" | "assistant"
	timestamp: Date
	reasoning?: string
	sources?: Array<{ title: string; url?: string; snippet?: string }>
}

const defaultSuggestions = [
	{
		id: "s1",
		title: "Plan a 2-day NYC business trip",
		prompt:
			"Plan a 2-day business trip itinerary in NYC with meetings near Midtown and a budget of $400 per night for hotel.",
	},
	{
		id: "s2",
		title: "Find flights MAD→SFO",
		prompt: "Find the 3 best flights from MAD to SFO on 2025-09-10, 1 adult, business class, direct preferred.",
	},
	{
		id: "s3",
		title: "Summarize attached PDF",
		prompt: "Summarize the attached PDF in 5 bullets and list key action items.",
	},
]

function AIChatView() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState("")
	const [loading, setLoading] = useState(false)
	const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
	const [user, setUser] = useState<any>(null)
	const [files, setFiles] = useState<File[]>([])
	const [showReasoning, setShowReasoning] = useState(true)
	const uploadInputRef = useRef<HTMLInputElement>(null)
	const supabase = createClient()
	const { isStreaming, start, cancel } = useChatStream()
	const searchParams = useSearchParams()
	
	useEffect(() => {
		const preset = searchParams.get("prompt")
		if (preset) setInput(preset)
	}, [searchParams])
	  
	const sendWithReasoning = async (userMessage: Message) => {
		const res = await fetch('/api/ai-chat', {
			method: 'POST', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: userMessage.content, history: messages, userId: user?.id, includeReasoning: showReasoning })
		})
		if (res.ok) {
			const data = await res.json()
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: data.response,
				role: 'assistant',
				timestamp: new Date(),
				reasoning: data.reasoning,
				sources: data.sources || []
			}
			setMessages(prev => [...prev, assistantMessage])
			setTypingMessageId(assistantMessage.id)
		}
	}

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			setUser(user)
		}
		getUser()
	}, [supabase])

	const getFileMeta = (file: File) => {
		const type = file.type
		const sizeKB = Math.max(1, Math.round(file.size / 1024))
		const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`

		let Icon = FileIcon
		if (type.startsWith("image/")) Icon = ImageIcon
		else if (type === "application/pdf") Icon = FileText
		else if (type.includes("spreadsheet") || type.includes("excel")) Icon = FileSpreadsheet
		else if (type.startsWith("text/") || type === "application/json") Icon = FileText
		else if (type.startsWith("audio/")) Icon = Music
		else if (type.startsWith("video/")) Icon = Video
		else if (type.includes("zip") || type.includes("compressed") || type.includes("rar")) Icon = Archive
		else if (
			type.includes("javascript") ||
			type.includes("typescript") ||
			type.includes("python") ||
			type.includes("java") ||
			type.includes("rust")
		)
			Icon = FileCode

		return { Icon, sizeText }
	}

	const validateFiles = (newFiles: File[]) => {
		const MAX_FILES = 5
		const MAX_SIZE_MB = 15
		const allowed = ["application/pdf", "text/plain", "application/json", "image/png", "image/jpeg"]

		if (files.length + newFiles.length > MAX_FILES) {
			throw new Error(`Maximum ${MAX_FILES} files allowed`)
		}

		for (const f of newFiles) {
			if (!allowed.some((t) => f.type === t || f.type.startsWith(t.split("/")[0] + "/"))) {
				throw new Error(`File type not allowed: ${f.type}`)
			}
			if (f.size > MAX_SIZE_MB * 1024 * 1024) {
				throw new Error(`File too large: ${f.name} (> ${MAX_SIZE_MB} MB)`)
			}
		}
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const newFiles = Array.from(event.target.files)
			try {
				validateFiles(newFiles)
				setFiles((prev) => [...prev, ...newFiles])
			} catch (e: any) {
				setMessages((prev) => [
					...prev,
					{ id: Date.now().toString(), role: "assistant", content: e.message, timestamp: new Date() },
				])
			}
		}
	}

	const handleRemoveFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index))
		if (uploadInputRef?.current) {
			uploadInputRef.current.value = ""
		}
	}

	const sendNonStreaming = async (userMessage: Message) => {
		const response = await fetch("/api/ai-chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: userMessage.content,
				history: messages,
				context: "travel_booking",
				includeReasoning: showReasoning,
			}),
		})
		if (!response.ok) throw new Error("Failed to get response")
		const data = await response.json()
		const assistantMessage: Message = {
			id: (Date.now() + 1).toString(),
			content: data.response,
			role: "assistant",
			timestamp: new Date(),
			reasoning: data.reasoning,
			sources: data.sources || [],
		}
		setMessages((prev) => [...prev, assistantMessage])
		setTypingMessageId(assistantMessage.id)
	}

	const handleSend = async () => {
		if (!input.trim() || loading || isStreaming) return

		const userMessage: Message = {
			id: Date.now().toString(),
			content: input.trim(),
			role: "user",
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInput("")
		setFiles([])
		setLoading(true)

		const isFlightIntent =
			/\b([A-Z]{3})\b.*\b(to|→|-)\b.*\b([A-Z]{3})\b/i.test(userMessage.content) ||
			/\bflight|vuelo|vuelos\b/i.test(userMessage.content)

		// Always connect userId for Mem0 association
		if (!user) {
			const { data } = await supabase.auth.getUser()
			setUser(data.user)
		}

		try {
			if (isFlightIntent || showReasoning) {
				await sendWithReasoning(userMessage)
				return
			}
			let streamed = ""
			await start({ message: userMessage.content, history: messages, userId: user?.id }, async (token) => {
				streamed += token
				setTypingMessageId("streaming")
				setMessages((prev) => {
					const others = prev.filter((m) => m.id !== "streaming-temp")
					return [...others, { id: "streaming-temp", content: streamed, role: "assistant", timestamp: new Date() }]
				})
			})
			setMessages((prev) => {
				const withoutTemp = prev.filter((m) => m.id !== "streaming-temp")
				return [
					...withoutTemp,
					{ id: (Date.now() + 1).toString(), content: streamed, role: "assistant", timestamp: new Date() },
				]
			})
			setTypingMessageId(null)
		} catch (err) {
			await sendNonStreaming(userMessage)
		} finally {
			setLoading(false)
		}
	}

	const handleSuggestion = (prompt: string) => {
		setInput(prompt)
	}

	const handleTypingComplete = () => setTypingMessageId(null)

	return (
		<VantaHaloBackground className="fixed inset-0">
			<div className="absolute inset-0 flex flex-col">
				<div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/60 px-4 sm:px-6 py-3">
					<div className="max-w-5xl mx-auto">
						<h1 className="text-lg sm:text-xl font-medium tracking-tight text-gray-900">Suitpax AI</h1>
						<p className="text-xs text-gray-500">Ask anything. Travel. Business. Code.</p>
					</div>
				</div>
				<div className="flex-1 min-h-0 relative bg-gradient-to-br from-gray-50 via-white to-gray-100">
					<ChatContainerRoot className="h-full max-w-5xl mx-auto w-full">
						<ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 relative min-h-[50vh] md:min-h-[60vh]">
							{messages.length === 0 && !loading && (
								<div className="space-y-4">
									<div className="flex items-center justify-center py-6 sm:py-8">
										<div className="text-center">
											<motion.h2
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5 }}
												className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#7a7a7a,#111)] bg-[length:200%_100%] animate-pulse"
											>
												Ask anything. Travel. Business. Code.
											</motion.h2>
											<div className="mt-2 flex items-center gap-3">
												<div className="text-[11px] text-gray-600 hidden sm:inline">Reasoning</div>
												<Switch checked={showReasoning} onCheckedChange={setShowReasoning} />
											</div>
										</div>
									</div>
									<PromptSuggestions suggestions={defaultSuggestions} onSelect={handleSuggestion} />
									<div className="text-[11px] text-gray-600">
										Markdown and code blocks supported. Use triple backticks with language for syntax highlighting and
										copying.
									</div>
								</div>
							)}

							{messages.map((message, index) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: index * 0.05 }}
									className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`${message.role === "user" ? "max-w-[85%] sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white" : "max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900"}`}
									>
										{message.role === "assistant" && (
											<div className="flex items-center space-x-2 mb-2">
												<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
													<img src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={24} height={24} className="w-full h-full object-contain p-0.5" loading="eager" fetchpriority="high" />
												</div>
												<span className="text-xs font-medium text-gray-700">Suitpax AI</span>
											</div>
										)}

										{message.role === "assistant" && message.reasoning && (
											<div className="mb-3">
												<Reasoning>
													<ReasoningTrigger className="text-xs text-gray-400 hover:text-gray-600">
														<span>View AI logic</span>
													</ReasoningTrigger>
													<ReasoningContent>
														<div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-2 border border-gray-100">
															<ReasoningResponse text={message.reasoning} className="text-xs text-gray-700" />
														</div>
													</ReasoningContent>
												</Reasoning>
											</div>
										)}

										<div className="prose prose-sm max-w-none prose-p:mb-2 prose-pre:mb-0">
											{message.role === "assistant" && typingMessageId === message.id ? (
												<p className="text-sm font-light leading-relaxed text-gray-900">Typing…</p>
											) : (
												<>
													<Markdown content={message.content} />
													{(() => {
														const match = message.content.match(/:::flight_offers_json\n([\s\S]*?)\n:::/)
														if (!match) return null
														try {
															const parsed = JSON.parse(match[1])
															return (
																<div className="mt-2">
																	<ChatFlightOffers
																		offers={parsed.offers || []}
																		onSelect={(id) => {
																			// Navigate to booking page
																			window.location.href = `/dashboard/flights/book/${id}`
																		}}
																	/>
																</div>
															)
														} catch {
														return null
														}
													})()}
												</>
											)}
										</div>
										{message.sources && message.sources.length > 0 && <SourceList items={message.sources} />}
										<p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
											{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
										</p>
									</div>
								</motion.div>
							))}

							{loading && (
								<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
									<div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 max-w-[90%] sm:max-w-xs">
										<div className="flex items-center space-x-2 mb-2">
											<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
												<img src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={24} height={24} className="w-full h-full object-contain p-0.5" loading="eager" fetchpriority="high" />
											</div>
											<span className="text-xs font-medium text-gray-700">Suitpax AI</span>
										</div>
										<div className="flex items-center space-x-2">
											<Loader2 className="h-4 w-4 animate-spin text-gray-600" />
											<span className="text-sm text-gray-600 font-light">{showReasoning ? "Analyzing and thinking..." : "Thinking..."}</span>
										</div>
									</div>
								</motion.div>
							)}
						</ChatContainerContent>

						<ChatContainerScrollAnchor />
						<ScrollButton className="bottom-24 md:bottom-28 right-4 sm:right-6" />
					</ChatContainerRoot>
				</div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border-t border-gray-200 flex-shrink-0" style={{ minHeight: "4rem" }}>
					<div className="p-3 sm:p-4 lg:p-6">
						<div className="max-w-4xl mx-auto w-full">
							<PromptInput value={input} onValueChange={setInput} isLoading={loading || isStreaming} onSubmit={handleSend} className="w-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
								{files.length > 0 && (
									<div className="flex flex-wrap gap-2 pb-2">
										{files.map((file, index) => {
											const { Icon, sizeText } = getFileMeta(file)
											return (
												<div key={index} className="bg-gray-100 flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm" onClick={(e) => e.stopPropagation()}>
													<Icon className="size-3.5 sm:size-4 text-gray-700" />
													<span className="max-w-[120px] truncate text-gray-800">{file.name}</span>
													<span className="text-[10px] text-gray-600">{sizeText}</span>
													<button onClick={() => handleRemoveFile(index)} className="hover:bg-gray-200 rounded-full p-1 transition-colors">
														<X className="size-3 sm:size-4 text-gray-600" />
													</button>
												</div>
											)
										})}
									</div>
								)}

								<PromptInputTextarea placeholder="Ask me about flights, hotels, travel planning, or code/design…" className="text-gray-900 placeholder-gray-500 font-light text-sm sm:text-base" disabled={loading || isStreaming} />

								<PromptInputActions className="flex items-center justify-between gap-2 pt-2">
									<PromptInputAction tooltip="Attach files">
										<label htmlFor="file-upload" className="hover:bg-gray-100 flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-2xl transition-colors">
											<input ref={uploadInputRef} type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
											<Paperclip className="size-3.5 sm:size-4 text-gray-700" />
										</label>
									</PromptInputAction>

									<PromptInputAction tooltip="Scan document">
										<DocumentScanner onScanned={(r) => {
											if (r?.raw_text) setInput((prev) => (prev ? `${prev}\n\n${r.raw_text}` : r.raw_text || ""))
										}} />
									</PromptInputAction>

									<PromptInputAction tooltip="Send message">
										<Button type="submit" size="sm" disabled={!input.trim() || loading || isStreaming} className="bg-black text-white hover:bg-gray-800 rounded-2xl h-7 w-7 sm:h-8 sm:w-8 p-0 disabled:opacity-50">
											<ArrowUp className="size-3.5 sm:size-4" />
										</Button>
									</PromptInputAction>
								</PromptInputActions>
							</PromptInput>
						</div>
					</div>
				</motion.div>
			</div>
		</VantaHaloBackground>
	)
}

export default function SuitpaxAIPage() {
	return <AIChatView />
}
