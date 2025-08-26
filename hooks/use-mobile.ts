"use client"

import { useEffect, useMemo, useState } from "react"

export function useMobile() {
	const [ua, setUa] = useState<string>("")
	const [width, setWidth] = useState<number>(typeof window === "undefined" ? 1024 : window.innerWidth)
	useEffect(() => {
		if (typeof navigator !== "undefined") setUa(navigator.userAgent || "")
		const onResize = () => setWidth(window.innerWidth)
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [])
	const isMobileUa = useMemo(() => /Mobi|Android|iPhone|iPad|iPod/i.test(ua), [ua])
	const isNarrow = width < 768
	return { isMobile: isMobileUa || isNarrow, isNarrow, userAgent: ua, width }
}