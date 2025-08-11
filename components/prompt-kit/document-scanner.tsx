"use client"

import { useRef, useState } from "react"
import { FileUp, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type DocumentScannerResult = {
  raw_text?: string
  parsed?: any
}

export default function DocumentScanner({ onScanned, className }: { onScanned?: (r: DocumentScannerResult) => void; className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    inputRef.current?.click()
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setDone(false)
    try {
      const form = new FormData()
      form.append("receipt", file)
      form.append("parseOnly", "true")
      const resp = await fetch("/api/expenses", { method: "POST", body: form })
      const data = await resp.json()
      if (data?.success !== false) {
        setDone(true)
        onScanned?.({ raw_text: data?.raw_text, parsed: data?.parsed })
      }
    } catch {
      // ignore
    } finally {
      setIsUploading(false)
      setTimeout(() => setDone(false), 1500)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-2xl transition-colors hover:bg-gray-100 text-gray-700 relative",
        className
      )}
      aria-label="Scan document"
    >
      <input ref={inputRef} type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={handleChange} />
      {isUploading ? (
        <Loader2 className="size-3.5 sm:size-4 animate-spin" />
      ) : done ? (
        <Check className="size-3.5 sm:size-4 text-emerald-600" />
      ) : (
        <FileUp className="size-3.5 sm:size-4" />
      )}
    </button>
  )
}