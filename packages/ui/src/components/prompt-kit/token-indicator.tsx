"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface TokenIndicatorProps {
  className?: string
}

export default function TokenIndicator({ className }: TokenIndicatorProps) {
  const supabase = createClient()
  const [plan, setPlan] = useState<string>("free")
  const [used, setUsed] = useState<number>(0)
  const [limit, setLimit] = useState<number>(100)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.id) return
        const { data, error } = await supabase
          .from("profiles")
          .select("subscription_plan, ai_tokens_used, ai_tokens_limit")
          .eq("id", user.id)
          .single()
        if (!error && data) {
          setPlan((data as any).subscription_plan || "free")
          setUsed((data as any).ai_tokens_used || 0)
          setLimit((data as any).ai_tokens_limit || 100)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [supabase])

  const remaining = Math.max(0, limit - used)
  const percent = Math.min(100, Math.round((used / Math.max(1, limit)) * 100))
  const barColor = percent < 70 ? "bg-green-500" : percent < 90 ? "bg-yellow-500" : "bg-red-500"

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-gray-700">AI tokens</span>
        <span className="text-[10px] text-gray-500 capitalize">{plan} plan</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-2 ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 text-[10px] text-gray-600">
        {loading ? "Loading…" : `${remaining} remaining (${used}/${limit})`}
      </div>
    </div>
  )
}
