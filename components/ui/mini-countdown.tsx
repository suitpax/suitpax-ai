"use client"

import { useEffect, useMemo, useState } from "react"

export default function MiniCountdownBadge({ target, title = "Suitpax Launch", variant = "dark" }: { target: string | Date; title?: string; variant?: "dark" | "light" }) {
	const targetDate = useMemo(() => (typeof target === "string" ? new Date(target) : target), [target])
	const [now, setNow] = useState<Date>(new Date())

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 30000)
		return () => clearInterval(t)
	}, [])

	const ms = Math.max(0, targetDate.getTime() - now.getTime())
	const totalMinutes = Math.floor(ms / (1000 * 60))
	const days = Math.floor(totalMinutes / (60 * 24))
	const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
	const mins = totalMinutes % 60

	const baseClass =
		variant === "light"
			? "inline-flex items-center gap-2 rounded-xl bg-white px-2.5 py-0.5 text-[9px] font-medium text-black border border-black/10"
			: "inline-flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-0.5 text-[9px] font-medium text-white/90 border border-white/15"
	const dotPrimary = variant === "light" ? "bg-black" : "bg-white"
	const dotSecondary = variant === "light" ? "bg-gray-400" : "bg-gray-400"

	return (
		<span className={baseClass}>
			<span className="flex items-center gap-1">
				<span className={`w-1.5 h-1.5 rounded-full ${dotPrimary} animate-pulse`} />
				<span className={`w-1.5 h-1.5 rounded-full ${dotSecondary} animate-pulse [animation-delay:150ms]`} />
			</span>
			<span>{title}</span>
			<span className="opacity-80">•</span>
			<span>{days}d {hours}h {mins}m</span>
			<span className={variant === "light" ? "opacity-60 text-gray-600" : "opacity-60"}>to Oct 21</span>
		</span>
	)
}

