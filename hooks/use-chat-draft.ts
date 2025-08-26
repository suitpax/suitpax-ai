"use client"

import { useCallback, useEffect, useState } from "react"

export function useChatDraft(storageKey: string) {
	const [draft, setDraftState] = useState<string>("")
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey)
			setDraftState(raw || "")
		} catch {
			setDraftState("")
		} finally {
			setLoaded(true)
		}
	}, [storageKey])

	const setDraft = useCallback((value: string | ((prev: string) => string)) => {
		setDraftState((prev) => {
			const next = value instanceof Function ? value(prev) : value
			try { localStorage.setItem(storageKey, next) } catch {}
			return next
		})
	}, [storageKey])

	const clear = useCallback(() => {
		setDraft("")
	}, [setDraft])

	return { draft, setDraft, clear, loaded }
}