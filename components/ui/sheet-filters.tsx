"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default function SheetFilters({ trigger, children, open: controlledOpen, onOpenChange }: { trigger?: React.ReactNode; children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : uncontrolledOpen
  const setOpen = (v: boolean) => {
    if (typeof controlledOpen === 'boolean' && onOpenChange) onOpenChange(v)
    else setUncontrolledOpen(v)
  }
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e: MouseEvent) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false) }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.addEventListener('mousedown', onClick)
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger || <Button variant="default" className="rounded-full h-9 px-4 bg-black text-white hover:bg-gray-900">Filters</Button>}
      </div>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" />
          <div ref={panelRef} className="absolute right-0 top-0 h-full w-full sm:w-[90%] md:w-[420px] bg-white shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-medium">Filters</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(100%-56px)]">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

