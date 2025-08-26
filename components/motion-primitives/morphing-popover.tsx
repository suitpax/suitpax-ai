"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type MorphingPopoverProps = {
	trigger: React.ReactNode
	children: React.ReactNode
	className?: string
	align?: "left" | "right"
}

export function MorphingPopover({ trigger, children, className, align = "right" }: MorphingPopoverProps) {
	const [open, setOpen] = React.useState(false)
	const triggerRef = React.useRef<HTMLDivElement | null>(null)

	return (
		<div className="relative inline-block" ref={triggerRef}>
			<div onClick={() => setOpen((s) => !s)} className="cursor-pointer select-none">
				{trigger}
			</div>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.97, y: 6 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.98, y: 4 }}
						transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
						className={cn(
							"absolute z-50 min-w-[220px] rounded-md border border-gray-200 bg-white p-2 shadow-sm",
							align === "right" ? "right-0 mt-2" : "left-0 mt-2",
							className,
						)}
						role="dialog"
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}