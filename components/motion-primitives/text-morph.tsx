"use client"

import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

export function TextMorph({ items, intervalMs = 2000, className = "" }: { items: string[]; intervalMs?: number; className?: string }) {
	const [idx, setIdx] = React.useState(0)
	React.useEffect(() => {
		if (items.length <= 1) return
		const id = setInterval(() => setIdx((i) => (i + 1) % items.length), intervalMs)
		return () => clearInterval(id)
	}, [items.length, intervalMs])
	return (
		<div className={className}>
			<AnimatePresence mode="popLayout">
				<motion.span key={idx} initial={{ opacity: 0, y: 4, filter: "blur(2px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -4, filter: "blur(2px)" }} transition={{ duration: 0.25 }}>{items[idx]}</motion.span>
			</AnimatePresence>
		</div>
	)
}