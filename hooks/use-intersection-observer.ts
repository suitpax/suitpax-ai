"use client"

import { RefObject, useEffect, useState } from "react"

export function useIntersectionObserver<T extends Element>(ref: RefObject<T>, options?: IntersectionObserverInit) {
	const [isIntersecting, setIsIntersecting] = useState(false)
	useEffect(() => {
		const el = ref.current
		if (!el) return
		const observer = new IntersectionObserver(([entry]) => setIsIntersecting(Boolean(entry?.isIntersecting)), options)
		observer.observe(el)
		return () => observer.disconnect()
	}, [ref, options])
	return isIntersecting
}