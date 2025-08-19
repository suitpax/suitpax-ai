"use client"

interface StopsSelectorProps {
  value?: number[]
  onChange?: (val: number[]) => void
}

const OPTIONS = [0, 1, 2]

export default function StopsSelector({ value = [], onChange }: StopsSelectorProps) {
  const toggle = (n: number) => {
    const set = new Set(value)
    if (set.has(n)) set.delete(n)
    else set.add(n)
    onChange?.(Array.from(set))
  }
  return (
    <div className="flex gap-2">
      {OPTIONS.map((n) => (
        <button
          key={n}
          onClick={() => toggle(n)}
          className={`px-2 py-1 rounded-lg border text-sm ${value.includes(n) ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300'}`}
        >
          {n === 0 ? 'Non-stop' : `${n} stop`}
        </button>
      ))}
    </div>
  )
}

