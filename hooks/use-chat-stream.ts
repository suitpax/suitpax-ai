"use client"

import { useCallback, useRef, useState } from "react"

export function useChatStream() {
	const [isStreaming, setIsStreaming] = useState(false)
	const abortRef = useRef<AbortController | null>(null)

	const start = useCallback(async (
		payload: { message: string; history?: Array<{ role: "user" | "assistant"; content: string }> },
		onToken: (token: string) => void,
	) => {
		if (isStreaming) return
		setIsStreaming(true)
		abortRef.current = new AbortController()
		try {
			const res = await fetch("/api/chat/stream", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				signal: abortRef.current.signal,
			})
			if (!res.ok || !res.body) throw new Error("Stream failed")
			const reader = res.body.getReader()
			const decoder = new TextDecoder()
			while (true) {
				const { value, done } = await reader.read()
				if (done) break
				onToken(decoder.decode(value))
			}
		} finally {
			setIsStreaming(false)
			abortRef.current = null
		}
	}, [isStreaming])

	const cancel = useCallback(() => {
		try { abortRef.current?.abort() } catch {}
		setIsStreaming(false)
	}, [])

	return { isStreaming, start, cancel }
}
