"use client"

export function ContactSuggestion({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
      <span className="inline-block h-6 w-6 rounded-full bg-gray-200" />
      <span>{name}</span>
    </button>
  )
}