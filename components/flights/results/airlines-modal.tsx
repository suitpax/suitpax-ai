"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function AirlinesModal({
  open,
  onOpenChange,
  airlines = [] as Array<{ code: string; name: string; logo?: string }>,
  selected = [] as string[],
  onChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  airlines?: Array<{ code: string; name: string; logo?: string }>
  selected?: string[]
  onChange?: (codes: string[]) => void
}) {
  const [list, setList] = useState(airlines)
  const [picked, setPicked] = useState<string[]>(selected)

  useEffect(() => { setList(airlines) }, [airlines])
  useEffect(() => { setPicked(selected) }, [selected])

  const toggle = (code: string) => {
    setPicked(prev => {
      const has = prev.includes(code)
      const next = has ? prev.filter(c => c !== code) : [...prev, code]
      onChange?.(next)
      return next
    })
  }

  const clear = () => { setPicked([]); onChange?.([]) }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Select Airlines</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          {list.map(a => (
            <button key={a.code} type="button" onClick={() => toggle(a.code)} className="flex items-center justify-between rounded-xl border border-gray-200 p-2 hover:bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                {a.logo ? <img src={a.logo} alt={a.name} className="h-5 w-5 rounded" /> : <div className="h-5 w-5 rounded bg-gray-100 border border-gray-200" />}
                <div className="truncate text-sm text-gray-800">{a.name} <span className="text-gray-500">({a.code})</span></div>
              </div>
              <Checkbox checked={picked.includes(a.code)} onCheckedChange={() => toggle(a.code)} />
            </button>
          ))}
          {list.length === 0 && <div className="text-sm text-gray-600">No airlines available</div>}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button onClick={clear} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100">Clear</button>
          <button onClick={() => onOpenChange(false)} className="text-xs px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-900">Apply</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

