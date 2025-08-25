"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AirlinesModal({ open, onOpenChange, airlines = [] as Array<{ code: string; name: string; logo?: string }> }) {
  const [list, setList] = useState(airlines)
  useEffect(() => { setList(airlines) }, [airlines])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Select Airlines</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          {list.map(a => (
            <div key={a.code} className="flex items-center justify-between rounded-xl border border-gray-200 p-2">
              <div className="flex items-center gap-2 min-w-0">
                {a.logo ? <img src={a.logo} alt={a.name} className="h-5 w-5 rounded" /> : <div className="h-5 w-5 rounded bg-gray-100 border border-gray-200" />}
                <div className="truncate text-sm text-gray-800">{a.name} <span className="text-gray-500">({a.code})</span></div>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-sm text-gray-600">No airlines available</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

