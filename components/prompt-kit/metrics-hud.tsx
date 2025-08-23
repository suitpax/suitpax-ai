"use client"

import { useEffect, useRef, useState } from "react"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type MetricsHUDProps = {
	className?: string
	visible?: boolean
	estimatedInputTokens?: number
	estimatedOutputTokens?: number
}

export default function MetricsHUD({ className, visible = true, estimatedInputTokens = 0, estimatedOutputTokens = 0 }: MetricsHUDProps) {
	const [ttfbMs, setTtfbMs] = useState<number | null>(null)
	const startRef = useRef<number | null>(null)

	useEffect(() => {
		startRef.current = performance.now()
		const timer = setTimeout(() => {
			if (startRef.current !== null) setTtfbMs(Math.round(performance.now() - startRef.current))
		}, 0)
		return () => clearTimeout(timer)
	}, [])

	if (!visible) return null

	return (
		<div className={cn("fixed bottom-24 right-4 z-30 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm px-3 py-2 text-xs text-gray-700 flex items-center gap-3", className)}>
			<div>TTFB: {ttfbMs ?? "—"} ms</div>
			<div>Tokens est.: {estimatedInputTokens + estimatedOutputTokens}</div>
			<div className="inline-flex items-center gap-1">
				<button className="hover:text-green-600" title="Good answer" aria-label="Good answer"><ThumbsUp className="size-4" /></button>
				<button className="hover:text-red-600" title="Needs work" aria-label="Needs work"><ThumbsDown className="size-4" /></button>
			</div>
		</div>
	)
}