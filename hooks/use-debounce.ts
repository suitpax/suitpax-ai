"use client"

import { useEffect, useRef } from "react"

export function useDebounce<T>(value: T, delayMs: number, onDebounced?: (v: T) => void): T {
	const latest = useRef(value)
	useEffect(() => {
		latest.current = value
		if (!onDebounced) return
		const id = setTimeout(() => onDebounced(latest.current), Math.max(0, delayMs))
		return () => clearTimeout(id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, delayMs])
	return value
}

export function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delayMs: number) {
	const cbRef = useRef<T>(callback)
	useEffect(() => { cbRef.current = callback }, [callback])
	return (...args: Parameters<T>) => {
		const id = setTimeout(() => cbRef.current(...args), Math.max(0, delayMs))
		return () => clearTimeout(id)
	}
}