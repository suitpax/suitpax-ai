"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

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

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
	asChild?: boolean
}

export default function Badge({ className, variant, size, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
