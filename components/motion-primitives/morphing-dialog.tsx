"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"

export type MorphingDialogProps = {
	trigger: React.ReactNode
	title?: React.ReactNode
	description?: React.ReactNode
	children: React.ReactNode
	className?: string
	contentClassName?: string
}

export function MorphingDialog({ trigger, title, description, children, className, contentClassName }: MorphingDialogProps) {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<AnimatePresence>
				{open && (
					<DialogContent asChild>
						<motion.div
							className={cn("border border-gray-200 bg-white", className)}
							initial={{ opacity: 0, scale: 0.95, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.98, y: 6 }}
							transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
						>
							{(title || description) && (
								<DialogHeader>
									{title && <DialogTitle className="text-gray-900">{title}</DialogTitle>}
									{description && <DialogDescription className="text-gray-600">{description}</DialogDescription>}
								</DialogHeader>
							)}
							<div className={cn("text-gray-900", contentClassName)}>{children}</div>
						</motion.div>
					</DialogContent>
				)}
			</AnimatePresence>
		</Dialog>
	)
}