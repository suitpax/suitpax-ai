import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host')

  // Specific logic for app.suitpax.com
  if (hostname === 'app.suitpax.com') {
    // Allowed routes on the app subdomain
    const allowedAppPaths = ['/login', '/signup', '/dashboard', '/api']
    const isAllowedAppPath = allowedAppPaths.some(path => pathname.startsWith(path))
    
    // Allow static files and Next.js files
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
    ) {
      return NextResponse.next()
    }
    
    // If root path, redirect to login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // If not an allowed path, redirect to login
    if (!isAllowedAppPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next()
  }

  // Original logic for suitpax.com (main domain)
  // Allow all public and static routes
  if (
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/" ||
    pathname.startsWith("/manifesto") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/travel-expense-management") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Allow all auth and dashboard routes locally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}