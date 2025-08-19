import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  const response = NextResponse.next()

  response.headers.set('x-url', pathname)
  response.headers.set('x-pathname', pathname)

  if (process.env.NODE_ENV === 'development') {
    console.log("Middleware - Setting pathname header:", pathname)
  }

  const isAppSubdomain =
    hostname.includes('app.suitpax.com') ||
    hostname.startsWith('app.') ||
    hostname.includes('localhost')

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

  if (isAppSubdomain) {
    const allowedAppPaths = ['/login', '/signup', '/dashboard', '/api', '/auth']
    const isAllowedAppPath = allowedAppPaths.some(path => pathname.startsWith(path))

    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (!isAllowedAppPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      if (pathname !== '/login') {
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
    "/password",
    "/api/public",
    "/api/password/verify",
  ]

  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + "/")
  )

  const launchMode = process.env.LAUNCH_MODE === 'on'
  if (isPublicPath) {
    return response
  }

  if (launchMode) {
    const cookie = request.cookies.get('site_access_ok')?.value
    if (!cookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/password'
      return NextResponse.redirect(url)
    }
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
