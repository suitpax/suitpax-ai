"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type Mode = "admin" | "personal"

export default function AccountUsageCard({ mode = "admin", className }: { mode?: Mode; className?: string }) {
  const [profile, setProfile] = useState<any>(null)
  const [usage, setUsage] = useState<{ searches?: number; searchesLimit?: number; aiTokens?: number; aiTokensLimit?: number; bookings?: number }>({})

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: p } = await supabase
          .from('profiles')
          .select('full_name, company_name, avatar_url, plan, subscription_status, usage_searches, usage_searches_limit, ai_tokens_used, ai_tokens_limit')
          .eq('id', user.id)
          .single()
        setProfile(p)
        setUsage({
          searches: p?.usage_searches || 0,
          searchesLimit: p?.usage_searches_limit || 100,
          aiTokens: p?.ai_tokens_used || 0,
          aiTokensLimit: p?.ai_tokens_limit || 0,
          bookings: undefined,
        })
        try { localStorage.setItem('suitpax_user_name', p?.full_name || '') } catch {}
      } catch {}
    }
    run()
    const handler = (e: any) => {
      if (e?.detail?.avatar_url) setProfile((prev: any) => ({ ...(prev || {}), avatar_url: e.detail.avatar_url }))
    }
    if (typeof window !== 'undefined') window.addEventListener('profile:updated', handler)
    return () => { if (typeof window !== 'undefined') window.removeEventListener('profile:updated', handler) }
  }, [])

  const percent = (num?: number, den?: number) => `${Math.min(100, Math.round(((num || 0) / (den || 1)) * 100))}%`

  if (mode === "personal") {
    return (
      <div className={cn("rounded-2xl border border-gray-200 bg-white/80 p-3 flex items-center gap-3", className)}>
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="avatar" width={32} height={32} className="h-8 w-8 rounded-full border border-gray-200" />
        ) : (
          <div className="h-8 w-8 rounded-full border border-gray-200 bg-gray-100" />
        )}
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-gray-900 truncate">{profile?.full_name || "User"}</div>
          <div className="text-[11px] text-gray-600 truncate">{profile?.company_name || ""}</div>
        </div>
        <span className="ml-auto rounded-md bg-gray-900 text-white text-[10px] px-1.5 py-[1px]">{(profile?.plan || 'Free')}</span>
      </div>
    )
  }

  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white/80 p-3 space-y-2", className)}>
      <div className="flex items-center gap-3">
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="avatar" width={40} height={40} className="h-10 w-10 rounded-full border border-gray-200" />
        ) : (
          <div className="h-10 w-10 rounded-full border border-gray-200 bg-gray-100" />
        )}
        <div className="min-w-0">
          <div className="text-[12px] text-gray-800 truncate">{profile?.full_name || 'User'}</div>
          <div className="text-[11px] text-gray-500 truncate">{profile?.company_name || ''}</div>
        </div>
        <span className="ml-auto rounded-md bg-gray-900 text-white text-[10px] px-1.5 py-[1px]">{(profile?.plan || 'Free')}</span>
      </div>
      <div className="h-px bg-gray-200" />
      <div className="text-[10px] text-gray-600">Flight searches</div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900" style={{ width: percent(usage.searches, usage.searchesLimit) }} />
      </div>
      <div className="text-[10px] text-gray-500">{usage.searches}/{usage.searchesLimit}</div>
      <div className="text-[10px] text-gray-600 mt-1">AI tokens</div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900" style={{ width: percent(usage.aiTokens, usage.aiTokensLimit) }} />
      </div>
      <div className="text-[10px] text-gray-500">{usage.aiTokens}/{usage.aiTokensLimit || '∞'}</div>
    </div>
  )
}

