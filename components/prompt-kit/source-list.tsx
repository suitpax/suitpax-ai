"use client"

import React from "react"

export type SourceItem = { title: string; url?: string; snippet?: string }

export default function SourceList({ items }: { items: SourceItem[] }) {
	if (!items?.length) return null
	return (
		<div className="mt-3 space-y-2">
			{items.map((item, idx) => (
				<div key={idx} className="rounded-lg border border-gray-200 p-2">
					<div className="text-sm font-medium">
						{item.url ? (
							<a href={item.url} target="_blank" rel="noreferrer" className="text-primary underline">
								{item.title}
							</a>
						) : (
							<span>{item.title}</span>
						)}
					</div>
					{item.snippet ? (
						<p className="text-xs text-muted-foreground mt-1">{item.snippet}</p>
					) : null}
				</div>
			))}
		</div>
	)
}