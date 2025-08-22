"use client"

export function CommandChips({ items, onPick }: { items: string[]; onPick: (t: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((q) => (
        <button key={q} onClick={() => onPick(q)} className="text-xs rounded-full border border-gray-200 bg-white px-2.5 py-1 hover:bg-gray-50">
          {q}
        </button>
      ))}
    </div>
  )
}