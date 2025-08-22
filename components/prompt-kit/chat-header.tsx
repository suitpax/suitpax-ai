"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
	title?: string
	subtitle?: string
	className?: string
	backHref?: string
}

export default function ChatHeader({ title = "Suitpax AI", subtitle = "Ask anything. Travel. Business. Code.", className = "", backHref = "/dashboard" }: ChatHeaderProps) {
	return (
		<header className={cn("bg-white/70 backdrop-blur-sm border-b border-gray-200 px-3 lg:px-4 py-2 sticky top-0 z-40", className)} aria-label="Chat header">
			<div className="mx-auto w-full max-w-4xl flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<Link href={backHref} aria-label="Back to dashboard" className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<div className="min-w-0">
						<h1 className="text-sm font-medium tracking-tight text-gray-900 leading-none truncate">{title}</h1>
						<p className="text-[11px] text-gray-600 truncate">{subtitle}</p>
					</div>
				</div>
				<div className="hidden sm:flex items-center gap-2">
					<span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px]">
						<Sparkles className="h-3 w-3 mr-1" />
						AI Ready
					</span>
				</div>
			</div>
		</header>
	)
}