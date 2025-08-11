"use client"

interface SourceItem {
  title: string
  url?: string
  snippet?: string
}

export default function SourceList({ items }: { items: SourceItem[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">Sources</p>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <li key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-2">
            <div className="text-xs font-medium text-gray-800">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-gray-400 underline-offset-2 hover:decoration-black">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
            </div>
            {s.snippet && <p className="text-[11px] text-gray-700 mt-1 line-clamp-3">{s.snippet}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}