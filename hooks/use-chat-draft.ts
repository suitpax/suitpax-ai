"use client"

import { useCallback, useEffect, useState } from "react"

export function useChatDraft(storageKey: string) {
	const [draft, setDraft] = useState<string>("")
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey)
			setDraft(raw || "")
		} catch {
			setDraft("")
		} finally {
			setLoaded(true)
		}
	}, [storageKey])

	const save = useCallback((value: string) => {
		setDraft(value)
		try { localStorage.setItem(storageKey, value) } catch {}
	}, [storageKey])

	const clear = useCallback(() => {
		save("")
	}, [save])

	return { draft, setDraft: save, clear, loaded }
}