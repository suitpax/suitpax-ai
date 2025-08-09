import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/types"
import { cookieStore } from "@/lib/supabase/cookies"

export async function GET(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // cost centers owned or where user is member
  const { data: owned } = await supabase.from('cost_centers').select('*').eq('owner_id', user.id)
  const { data: memberships } = await supabase
    .from('user_cost_centers')
    .select('cost_center_id, cost_centers(*)')
    .eq('user_id', user.id)

  const memberCenters = (memberships || []).map((m: any) => m.cost_centers).filter(Boolean)
  const all = [...(owned || []), ...memberCenters]

  return NextResponse.json({ success: true, data: all })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, code, description, budget_monthly } = body || {}
  if (!name || !code) return NextResponse.json({ error: 'Name and code are required' }, { status: 400 })

  const { data, error } = await supabase.from('cost_centers').insert({
    owner_id: user.id,
    name,
    code,
    description: description || null,
    budget_monthly: budget_monthly || 0
  }).select('*').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true, data })
}