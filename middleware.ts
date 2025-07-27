import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    },
  )

  // Refresh session if expired - important!
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl
  const hostname = request.headers.get("host")!

  const isDevelopment = process.env.NODE_ENV === "development"
  const appUrl = isDevelopment ? "http://app.localhost:3000" : "https://app.suitpax.com"
  const mainUrl = isDevelopment ? "http://localhost:3000" : "https://suitpax.com"

  const isAppSubdomain = hostname.startsWith("app.")
  const isProtectedRoute = url.pathname.startsWith("/dashboard")

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", mainUrl))
  }

  // If user is authenticated...
  if (user) {
    // and tries to access login/signup, redirect to dashboard
    if (url.pathname === "/login" || url.pathname === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", appUrl))
    }
    // and is on the main domain trying to access dashboard, redirect to app subdomain
    if (!isAppSubdomain && isProtectedRoute) {
      return NextResponse.redirect(new URL(url.pathname, appUrl))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
