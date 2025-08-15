import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"

export function createSupabaseFromRequest(request: NextRequest, response?: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  let _response = response || NextResponse.next({ request })

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        _response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => _response.cookies.set(name, value, options))
      },
    },
  })

  return { supabase, response: _response }
}

export async function ensureAuthenticated(request: NextRequest, redirectTo: string = "/auth/login") {
  const { supabase, response } = createSupabaseFromRequest(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = redirectTo
    return NextResponse.redirect(url)
  }

  return response
}