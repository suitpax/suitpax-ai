"use client"

import { Button } from '@/components/ui/button'

interface Props {
  adults: number
  children: number
  infants: number
  onChange: (next: { adults: number; children: number; infants: number }) => void
}

export default function PassengerSelect({ adults, children, infants, onChange }: Props) {
  const set = (k: keyof Props, v: number) => {
    const next = { adults, children, infants } as any
    next[k] = Math.min(9, Math.max(0, v))
    onChange(next)
  }
  return (
    <div className="passengers">
      {([
        ['adults','Adults',adults],
        ['children','Children',children],
        ['infants','Infants',infants],
      ] as const).map(([k,label,val]) => (
        <div key={k} className="passenger-pill">
          <span className="text-sm text-gray-800">{label}</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="rounded-full h-7 w-7 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" onClick={() => set(k as any, (val as number) - 1)}>-</Button>
            <span className="w-4 text-center text-gray-900 text-sm">{val}</span>
            <Button className="rounded-full h-7 w-7 bg-black text-white hover:bg-gray-900" onClick={() => set(k as any, (val as number) + 1)}>+</Button>
          </div>
        </div>
      ))}
    </div>
  )
}