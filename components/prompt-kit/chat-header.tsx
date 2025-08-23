"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ChatHeaderProps {
	title?: string
	subtitle?: string
	className?: string
	backHref?: string
}

export default function ChatHeader({ title = "Suitpax AI", subtitle = "Try the superpowers", className = "", backHref = "/dashboard" }: ChatHeaderProps) {
	const [agent] = useState<"core">("core")

	useEffect(() => {
		window.dispatchEvent(new CustomEvent("suitpax-agent-change", { detail: { agent: "core" } }))
	}, [])

	return (
		<header className={cn("bg-white/70 backdrop-blur-sm border-b border-gray-200 px-3 lg:px-4 py-2 sticky top-0 z-40", className)} aria-label="Chat header">
			<div className="mx-auto w-full max-w-5xl flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<Link href={backHref} aria-label="Back to dashboard" className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-gray-300 bg-white hover:bg-gray-50">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={60} height={12} className="h-3.5 w-auto ml-1" />
					<div className="min-w-0">
						<h1 className="text-sm font-medium tracking-tight text-gray-900 leading-none truncate">{title}</h1>
						<p className="text-[11px] text-gray-600 truncate">{subtitle}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{/* Core pill + dual pulse orb */}
					<span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-[10px] text-gray-800">
						Core
						<span className="inline-flex items-center gap-1">
							<span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
							<span className="h-2 w-2 rounded-full bg-blue-200 animate-pulse" />
						</span>
					</span>
				</div>
			</div>
		</header>
	)
}