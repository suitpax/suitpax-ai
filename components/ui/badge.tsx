"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "bg-black text-white border-black",
				secondary: "bg-gray-100 text-gray-800 border-gray-200",
				outline: "bg-white text-gray-800 border-gray-200",
				muted: "bg-gray-50 text-gray-700 border-gray-200",
				compact: "bg-gray-50 text-gray-700 border-gray-200 px-2 py-0 text-[11px]",
			},
			size: {
				md: "px-2.5 py-0.5 text-xs",
				sm: "px-2 py-0.5 text-[11px]",
				xs: "px-1.5 py-0 text-[10px]",
			},
		},
		defaultVariants: {
			variant: "outline",
			size: "sm",
		},
	}
)

interface BaseBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

// Named export: used across dashboard/app for small inline badges
export function Badge({ className, variant, size, ...props }: BaseBadgeProps) {
	return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

// Default export: Fancy marketing badge with `text` prop (backwards compatible)
interface FancyBadgeProps {
	text: string
	href?: string
	label?: string
	isNew?: boolean
	className?: string
}

export default function FancyBadge({ text, href = "#", label = "Update", isNew = true, className = "" }: FancyBadgeProps) {
	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={cn("mx-auto", className)}>
			<Link aria-label={`View ${text}`} href={href} className="mx-auto inline-block">
				<div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-white/80 px-2 py-0.5 pr-2.5 pl-0.5 text-xs font-medium text-gray-900 ring-1 shadow-sm ring-gray-200 backdrop-blur-[1px] transition-colors hover:bg-white">
					{isNew && (
						<span className="shrink-0 truncate rounded-xl border bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-700 border-gray-200">{label}</span>
					)}
					<span className="flex items-center gap-1 truncate">
						<span className="w-full truncate">{text}</span>
					</span>
				</div>
			</Link>
		</motion.div>
	)
}
