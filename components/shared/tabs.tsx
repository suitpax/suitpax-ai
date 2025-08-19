"use client"

interface TabItem { id: string; label: string }
interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
}

export default function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} className={`px-3 py-1.5 rounded-xl border text-sm ${value === t.id ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300'}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

