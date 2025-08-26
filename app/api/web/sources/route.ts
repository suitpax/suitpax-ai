import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const url = new URL(req.url)
  const recent = url.searchParams.get('recent')

  if (recent) {
    const { data, error } = await supabase
      .from('web_sources')
      .select('*')
      .or(`user_id.is.null, user_id.eq.${user?.id || ''}`)
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ items: data })
  }

  return NextResponse.json({ items: [] })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const { sources } = await req.json()
    if (!Array.isArray(sources)) return NextResponse.json({ error: 'sources must be array' }, { status: 400 })

    const rows = sources.map((s: any) => ({
      href: s.url || s.href,
      title: s.title || null,
      description: s.snippet || s.description || null,
      favicon_url: s.favicon_url || null,
      content_snippet: s.snippet || null,
      user_id: user?.id || null,
    })).filter((r: any) => r.href)

    if (rows.length === 0) return NextResponse.json({ items: [] })

    const { data, error } = await supabase.from('web_sources').insert(rows).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ items: data })
  } catch (e: any) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
