"use client"

export function TranscriptPanel({ text }: { text: string }) {
  return (
    <div className="min-h-[72px] rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
      {text || "Start talking to begin a conversation"}
    </div>
  )
}