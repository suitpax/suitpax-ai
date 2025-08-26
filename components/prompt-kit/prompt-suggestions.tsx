"use client"

import React from "react"
import { PromptSuggestion } from "./prompt-suggestion"

export type Suggestion = { id: string; title: string; prompt: string }

export default function PromptSuggestions({ suggestions, onSelect }: { suggestions: Suggestion[]; onSelect: (prompt: string) => void }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			{suggestions.map((s) => (
				<PromptSuggestion key={s.id} variant="outline" size="sm" className="justify-start rounded-xl" onClick={() => onSelect(s.prompt)}>
					{s.title}
				</PromptSuggestion>
			))}
		</div>
	)
}