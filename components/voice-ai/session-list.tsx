"use client"

export interface SessionItem { id: string; title: string; ts: string }

export function SessionList({ items, onOpen }: { items: SessionItem[]; onOpen: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-3 backdrop-blur-sm">
      <div className="text-xs text-gray-700 mb-2">Recent sessions</div>
      <div className="space-y-1">
        {items.map((it) => (
          <button key={it.id} onClick={() => onOpen(it.id)} className="w-full text-left text-sm px-2 py-1 rounded-lg hover:bg-gray-50">
            <div className="font-medium text-gray-900">{it.title}</div>
            <div className="text-[10px] text-gray-500">{new Date(it.ts).toLocaleString()}</div>
          </button>
        ))}
      </div>
    </div>
  )
}