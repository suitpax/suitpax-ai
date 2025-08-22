"use client"

export default function SourceList({ items }: { items: Array<{ title: string; url?: string; snippet?: string }> }) {
	if (!items?.length) return null
	return (
		<div className="mt-2 rounded-xl border border-gray-200 bg-white/80 p-2 space-y-1">
			<div className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Sources</div>
			{items.map((s, i) => (
				<div key={(s.url || s.title) + i} className="text-[12px]">
					{s.url ? (
						<a href={s.url} target="_blank" rel="noreferrer" className="text-gray-900 hover:underline">{s.title}</a>
					) : (
						<span className="text-gray-900">{s.title}</span>
					)}
					{s.snippet && <div className="text-[11px] text-gray-600">{s.snippet}</div>}
				</div>
			))}
		</div>
	)
}