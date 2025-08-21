"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function PlanUsageCard() {
  const [profile, setProfile] = useState<any>(null)
  const [usage, setUsage] = useState<{ searches?: number; searchesLimit?: number; aiTokens?: number; aiTokensLimit?: number }>({})

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: p } = await supabase
          .from('profiles')
          .select('full_name, company_name, avatar_url, plan, usage_searches, usage_searches_limit, ai_tokens_used, ai_tokens_limit')
          .eq('id', user.id)
          .single()
        setProfile(p)
        setUsage({
          searches: p?.usage_searches || 0,
          searchesLimit: p?.usage_searches_limit || 100,
          aiTokens: p?.ai_tokens_used || 0,
          aiTokensLimit: p?.ai_tokens_limit || 0,
        })
        try { localStorage.setItem('suitpax_user_name', p?.full_name || '') } catch {}
      } catch {}
    }
    run()
  }, [])

  const percent = (num?: number, den?: number) => `${Math.min(100, Math.round(((num || 0) / (den || 1)) * 100))}%`

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-3 space-y-2">
      <div className="flex items-center gap-2">
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="avatar" width={24} height={24} className="h-6 w-6 rounded-full border border-gray-200" />
        ) : (
          <div className="h-6 w-6 rounded-full border border-gray-200 bg-gray-100" />
        )}
        <div className="min-w-0">
          <div className="text-[11px] text-gray-800 truncate">{profile?.full_name || 'User'}</div>
          <div className="text-[10px] text-gray-500 truncate">{profile?.company_name || ''}</div>
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

