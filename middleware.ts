import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Solo manejar rutas públicas, permitir todas las demás
  const { pathname } = request.nextUrl

  // Permitir todas las rutas públicas y estáticas
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

  // Permitir todas las rutas de auth y dashboard localmente
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
