"use client"

import { useCallback, useRef, useState } from "react"

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const start = useCallback(async (body: any, onToken: (t: string) => void) => {
    setIsStreaming(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch("/api/suitpax-ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        onToken(chunk)
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message || "Stream error")
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [])

  const cancel = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
  }, [])

  return { isStreaming, error, start, cancel }
}
