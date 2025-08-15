import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseFromRequest, ensureAuthenticated } from "@/lib/supabase/middleware"

export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  // Skip static and public assets
  const isStaticRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/health") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"

  if (isStaticRoute) {
    return NextResponse.next()
  }

  // Initialize Supabase cookies bridge (only if configured)
  let response = NextResponse.next({ request })
  if (isSupabaseConfigured) {
    const { supabase, response: supaResponse } = createSupabaseFromRequest(request, response)
    response = supaResponse

    // OAuth code exchange -> redirect to dashboard
    const code = request.nextUrl.searchParams.get("code")
    if (code) {
      try {
        await supabase.auth.exchangeCodeForSession(code)
      } catch {}
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      url.searchParams.delete("code")
      return NextResponse.redirect(url)
    }
  }

  // Subdomain routing (app.* or localhost) keeps only app paths
  const isAppSubdomain = hostname.includes("app.suitpax.com") || hostname.startsWith("app.") || hostname.includes("localhost")
  if (isAppSubdomain) {
    const allowedAppPaths = ["/login", "/signup", "/dashboard", "/api", "/auth"]
    const isAllowedAppPath = allowedAppPaths.some((path) => pathname.startsWith(path))

    if (pathname === "/") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    if (!isAllowedAppPath) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  // Protected areas
  const requiresAuth =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/user")

  if (isSupabaseConfigured && requiresAuth) {
    const authResult = await ensureAuthenticated(request, "/auth/login")
    return authResult
  }

  return response
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|public).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
