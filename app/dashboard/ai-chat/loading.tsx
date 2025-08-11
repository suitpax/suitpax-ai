"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={28} height={28} className="object-contain" />
        </div>
        <div className="inline-flex items-center gap-2 text-gray-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading Suitpax AI…</span>
        </div>
        <div className="text-[11px] text-gray-500">Preparing your workspace</div>
      </div>
    </div>
  )
}