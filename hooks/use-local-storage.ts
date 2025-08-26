"use client"

import { useCallback, useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
	const readValue = useCallback((): T => {
		if (typeof window === "undefined") return initialValue
		try {
			const item = window.localStorage.getItem(key)
			return item ? (JSON.parse(item) as T) : initialValue
		} catch {
			return initialValue
		}
	}, [key, initialValue])

	const [storedValue, setStoredValue] = useState<T>(readValue)

	useEffect(() => {
		setStoredValue(readValue())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key])

	const setValue = useCallback((value: T | ((val: T) => T)) => {
		try {
			const next = value instanceof Function ? value(storedValue) : value
			setStoredValue(next)
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(next))
			}
		} catch {}
	}, [key, storedValue])

	return [storedValue, setValue] as const
}