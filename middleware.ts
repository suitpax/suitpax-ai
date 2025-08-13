import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  let supabaseResponse = NextResponse.next({
    request,
  })

  if (isSupabaseConfigured) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    const code = request.nextUrl.searchParams.get("code")
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      url.searchParams.delete("code")
      return NextResponse.redirect(url)
    }

    await supabase.auth.getUser()
  }

  const response = supabaseResponse
  response.headers.set("x-url", pathname)
  response.headers.set("x-pathname", pathname)

  if (process.env.NODE_ENV === "development") {
    console.log("Middleware - Setting pathname header:", pathname)
  }

  const isAppSubdomain =
    hostname.includes("app.suitpax.com") || hostname.startsWith("app.") || hostname.includes("localhost")

  const isStaticRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/health") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"

  if (isStaticRoute) {
    return response
  }

  if (isSupabaseConfigured && (pathname.startsWith("/dashboard") || pathname.startsWith("/api/user"))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !pathname.startsWith("/auth/")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

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
      if (pathname !== "/auth/login") {
        return NextResponse.redirect(url)
      }
    }

    return response
  }

  const publicPaths = [
    "/",
    "/manifesto",
    "/pricing",
    "/travel-expense-management",
    "/contact",
    "/solutions",
    "/public",
    "/api/public",
  ]

  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  if (isPublicPath) {
    return response
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
