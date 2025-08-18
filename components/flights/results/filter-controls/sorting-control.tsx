"use client"

interface SortingControlProps {
  value?: 'recommended' | 'price' | 'duration'
  onChange?: (val: 'recommended' | 'price' | 'duration') => void
}

export default function SortingControl({ value = 'recommended', onChange }: SortingControlProps) {
  return (
    <div className="flex gap-2">
      {([
        ['recommended', 'Recommended'],
        ['price', 'Price'],
        ['duration', 'Duration'],
      ] as const).map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange?.(val)}
          className={`px-2 py-1 rounded-lg border text-sm ${value === val ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

