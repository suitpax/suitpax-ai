"use client"

export default function PromptSuggestions({ suggestions, onSelect }: { suggestions: Array<{ id: string; title: string; prompt: string }>; onSelect: (p: string) => void }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			{suggestions.map((s) => (
				<button key={s.id} onClick={() => onSelect(s.prompt)} className="text-left rounded-xl border border-gray-200 bg-white/80 px-3 py-2 hover:bg-white focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-300">
					<div className="text-[12px] font-medium text-gray-900">{s.title}</div>
					<div className="text-[11px] text-gray-600 line-clamp-2">{s.prompt}</div>
				</button>
			))}
		</div>
	)
}