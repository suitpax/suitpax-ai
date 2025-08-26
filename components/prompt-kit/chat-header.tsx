"use client"

import React from "react"

type ChatHeaderProps = {
	title: string
	subtitle?: string
	className?: string
}

export default function ChatHeader({ title, subtitle, className }: ChatHeaderProps) {
	return (
		<header className={className}>
			<div className="mx-auto w-full max-w-4xl px-4 py-3">
				<h1 className="text-xl md:text-2xl font-medium tracking-tight">{title}</h1>
				{subtitle ? (
					<p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
				) : null}
			</div>
		</header>
	)
}