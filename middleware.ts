import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host") || ""

  // Handle subdomain routing
  const isAppSubdomain = hostname.includes("app.suitpax.com") || hostname.includes("app.localhost")
  const isMainDomain = hostname.includes("suitpax.com") || hostname.includes("localhost:3000")

  // Create Supabase client
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
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Dashboard routes - require authentication and app subdomain
  if (url.pathname.startsWith("/dashboard")) {
    if (!user) {
      // Redirect to login on main domain
      return NextResponse.redirect(new URL("/login", `https://suitpax.com`))
    }

    if (!isAppSubdomain) {
      // Redirect to app subdomain
      return NextResponse.redirect(new URL(url.pathname, `https://app.suitpax.com`))
    }
  }

  // Auth routes - redirect authenticated users
  if (["/login", "/signup"].includes(url.pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", `https://app.suitpax.com`))
    }
  }

  // Main domain - redirect dashboard access to app subdomain
  if (isMainDomain && !isAppSubdomain && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL(url.pathname, `https://app.suitpax.com`))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
