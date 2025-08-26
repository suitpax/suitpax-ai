"use client"

import { RefObject, useEffect } from "react"

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: (event: MouseEvent | TouchEvent) => void) {
	useEffect(() => {
		function onEvent(e: MouseEvent | TouchEvent) {
			const el = ref.current
			if (!el) return
			if (e.target && el.contains(e.target as Node)) return
			handler(e)
		}
		document.addEventListener("mousedown", onEvent)
		document.addEventListener("touchstart", onEvent)
		return () => {
			document.removeEventListener("mousedown", onEvent)
			document.removeEventListener("touchstart", onEvent)
		}
	}, [ref, handler])
}