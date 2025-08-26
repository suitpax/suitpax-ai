"use client"

import { useCallback, useEffect, useState } from "react"

export function useClipboard(options: { timeoutMs?: number } = {}) {
	const { timeoutMs = 1500 } = options
	const [copied, setCopied] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const copy = useCallback(async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setError(null)
		} catch (e: any) {
			setError(e?.message || "Clipboard error")
		}
	}, [])
	useEffect(() => {
		if (!copied) return
		const id = setTimeout(() => setCopied(false), timeoutMs)
		return () => clearTimeout(id)
	}, [copied, timeoutMs])
	return { copied, error, copy }
}