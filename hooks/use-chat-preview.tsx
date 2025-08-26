"use client"

import { useMemo } from "react"
import { Markdown } from "@/components/prompt-kit/markdown"

export type ChatPreviewOptions = {
	className?: string
}

export function useChatPreview(content: string, options: ChatPreviewOptions = {}) {
	const node = useMemo(() => {
		if (!content) return null
		return (
			<div className={options.className}>
				<Markdown>{content}</Markdown>
			</div>
		)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content, options.className])
	return node
}