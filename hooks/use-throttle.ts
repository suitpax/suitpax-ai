"use client"

import { useEffect, useRef, useState } from "react"

export function useThrottle<T>(value: T, intervalMs: number): T {
	const [throttled, setThrottled] = useState(value)
	const lastRan = useRef<number>(0)
	useEffect(() => {
		const now = Date.now()
		if (now - lastRan.current >= intervalMs) {
			setThrottled(value)
			lastRan.current = now
			return
		}
		const remaining = Math.max(0, intervalMs - (now - lastRan.current))
		const id = setTimeout(() => {
			setThrottled(value)
			lastRan.current = Date.now()
		}, remaining)
		return () => clearTimeout(id)
	}, [value, intervalMs])
	return throttled
}

export function useThrottledCallback<T extends (...args: any[]) => void>(callback: T, intervalMs: number) {
	const lastRunRef = useRef<number>(0)
	const saved = useRef<T>(callback)
	useEffect(() => { saved.current = callback }, [callback])
	return (...args: Parameters<T>) => {
		const now = Date.now()
		if (now - lastRunRef.current >= intervalMs) {
			lastRunRef.current = now
			saved.current(...args)
		}
	}
}