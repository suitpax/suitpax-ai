"use client"

import { useEffect, useMemo, useState } from "react"

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl"

const BREAKPOINTS: Record<Breakpoint, number> = {
	xs: 0,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
}

function getBp(width: number): Breakpoint {
	if (width >= BREAKPOINTS.xl) return "xl"
	if (width >= BREAKPOINTS.lg) return "lg"
	if (width >= BREAKPOINTS.md) return "md"
	if (width >= BREAKPOINTS.sm) return "sm"
	return "xs"
}

export function useBreakpoint() {
	const [width, setWidth] = useState<number>(typeof window === "undefined" ? BREAKPOINTS.md : window.innerWidth)
	useEffect(() => {
		function onResize() {
			setWidth(window.innerWidth)
		}
		onResize()
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [])

	const current = useMemo(() => getBp(width), [width])
	const up = (bp: Breakpoint) => width >= BREAKPOINTS[bp]
	const down = (bp: Breakpoint) => width < BREAKPOINTS[bp]
	const between = (min: Breakpoint, max: Breakpoint) => width >= BREAKPOINTS[min] && width < BREAKPOINTS[max]

	return { width, breakpoint: current, up, down, between }
}