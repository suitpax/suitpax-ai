"use client"

import { useState, useRef } from "react"

interface StreamOptions {
  message: string
  history?: any[]
  userId?: string
}

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  const start = async (options: StreamOptions, onToken: (token: string) => void) => {
    if (isStreaming) return
    setIsStreaming(true)

    controllerRef.current = new AbortController()

    try {
      const res = await fetch("/api/ai-core/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: options.message, history: options.history || [], userId: options.userId }),
        signal: controllerRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error("Stream failed")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        onToken(chunk)
      }
    } catch (e) {
      // Swallow; fallback handled by caller
    } finally {
      setIsStreaming(false)
    }
  }

  const cancel = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
      controllerRef.current = null
    }
    setIsStreaming(false)
  }

  return { isStreaming, start, cancel }
}
