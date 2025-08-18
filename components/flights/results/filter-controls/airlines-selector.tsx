"use client"

import { Checkbox } from "@/components/ui/checkbox"
import Popover from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface AirlineOption { code: string; name: string }

interface AirlinesSelectorProps {
  options: AirlineOption[]
  value?: string[]
  onChange?: (codes: string[]) => void
}

export default function AirlinesSelector({ options, value = [], onChange }: AirlinesSelectorProps) {
  const toggle = (code: string) => {
    const set = new Set(value)
    if (set.has(code)) set.delete(code)
    else set.add(code)
    onChange?.(Array.from(set))
  }
  const clear = () => onChange?.([])
  const label = value.length === 0 ? "All" : `${value.length} selected`
  return (
    <Popover
      trigger={
        <Button variant="secondary" className="w-full justify-between rounded-xl border-gray-300 bg-white/80 text-gray-900 hover:bg-white backdrop-blur-sm h-9">
          <span>{label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-60"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
        </Button>
      }
      className="w-72 p-2"
      align="center"
    >
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="text-xs text-gray-600">Airlines</div>
        {value.length > 0 && (
          <button onClick={clear} className="text-xs text-gray-700 hover:underline">Clear</button>
        )}
      </div>
      <div className="max-h-64 overflow-auto space-y-1">
        {options.map((a) => (
          <label key={a.code} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
            <Checkbox checked={value.includes(a.code)} onCheckedChange={() => toggle(a.code)} />
            <Image
              src={`https://assets.duffel.com/img/airlines/for-dark-background/full-color-logo/${a.code}.svg`}
              alt={a.name}
              width={28}
              height={12}
              className="h-4 w-auto object-contain"
            />
            <span className="text-sm text-gray-900 font-medium">{a.name}</span>
            <span className="text-xs text-gray-500 ml-auto">{a.code}</span>
          </label>
        ))}
      </div>
    </Popover>
  )
}

