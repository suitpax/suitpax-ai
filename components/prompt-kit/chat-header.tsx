"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChatHeaderProps {
	title?: string
	subtitle?: string
	className?: string
	backHref?: string
}

export default function ChatHeader({ title = "Suitpax AI", subtitle = "Try the superpowers", className = "", backHref = "/dashboard" }: ChatHeaderProps) {
	const [agent, setAgent] = useState<"core" | "flights" | "hotels">("core")
	const [reasoning, setReasoning] = useState<boolean>(true)

	useEffect(() => {
		window.dispatchEvent(new CustomEvent("suitpax-agent-change", { detail: { agent } }))
	}, [agent])

	useEffect(() => {
		window.dispatchEvent(new CustomEvent("suitpax-reasoning-toggle", { detail: { enabled: reasoning } }))
	}, [reasoning])

	return (
		<header className={cn("bg-white/70 backdrop-blur-sm border-b border-gray-200 px-3 lg:px-4 py-2 sticky top-0 z-40", className)} aria-label="Chat header">
			<div className="mx-auto w-full max-w-5xl flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<Link href={backHref} aria-label="Back to dashboard" className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={60} height={12} className="h-3.5 w-auto ml-1" />
					<div className="min-w-0">
						<h1 className="text-sm font-medium tracking-tight text-gray-900 leading-none truncate">{title}</h1>
						<p className="text-[11px] text-gray-600 truncate">{subtitle}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{/* Reasoning switch - black */}
					<button
						onClick={() => setReasoning((v) => !v)}
						className={cn(
							"inline-flex h-6 w-11 items-center rounded-full border px-0.5 transition-colors",
							reasoning ? "bg-black border-black" : "bg-white border-gray-300"
						)}
						aria-label="Toggle reasoning"
					>
						<span className={cn("h-5 w-5 rounded-full bg-white transform transition-transform", reasoning ? "translate-x-5" : "translate-x-0")}></span>
					</button>
					<span className="text-[11px] text-gray-700 hidden sm:inline">Reasoning</span>

					{/* Agent selector using UI Select */}
					<div className="min-w-[140px]">
						<Select value={agent} onValueChange={(v) => setAgent(v as any)}>
							<SelectTrigger className="h-8 rounded-xl border-gray-200 bg-white text-gray-800">
								<SelectValue placeholder="Agent" />
							</SelectTrigger>
							<SelectContent className="rounded-xl border-gray-200">
								<SelectItem value="core">Core</SelectItem>
								<SelectItem value="flights">Flights</SelectItem>
								<SelectItem value="hotels">Hotels</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</header>
	)
}