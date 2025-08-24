"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: number
}

export function Loader({ size = 16, className, ...props }: LoaderProps) {
	return (
		<div role="status" aria-live="polite" aria-label="Loading" className={cn("inline-flex items-center", className)} {...props}>
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				className="animate-spin"
				aria-hidden
			>
				<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20 fill-none" />
				<path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" className="opacity-80 fill-none" strokeLinecap="round" />
			</svg>
		</div>
	)
}

export default Loader