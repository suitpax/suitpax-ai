"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { AgentProfile } from "@/lib/voice-ai/types"

export function AgentCard({ agent, selected, onSelect }: { agent: AgentProfile; selected?: boolean; onSelect?: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect?.(agent.id)}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm text-left transition-all",
        selected ? "border-black shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      )}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100">
          <Image src={agent.id === "female_pro" ? "/avatars/female.png" : "/avatars/male.png"} alt={agent.displayName} width={48} height={48} />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 leading-none">{agent.displayName}</div>
          <div className="text-[11px] text-gray-600 mt-1">{agent.shortBio}</div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px]", selected ? "bg-black text-white" : "bg-gray-100 text-gray-700")}>Agent</span>
      </div>
    </button>
  )
}