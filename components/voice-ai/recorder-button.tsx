"use client"

import { MicIcon, Square } from "lucide-react"

export function RecorderButton({ recording, onClick }: { recording: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-2xl px-4 h-9 inline-flex items-center gap-2 ${recording ? "bg-red-600 text-white" : "bg-black text-white"}`}>
      {recording ? <Square className="h-3.5 w-3.5" /> : <MicIcon className="h-3.5 w-3.5" />}
      <span className="text-xs font-medium">{recording ? "Stop" : "Start"}</span>
    </button>
  )
}