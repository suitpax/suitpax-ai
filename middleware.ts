import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Verificar si es el subdominio app (más flexible)
  const isAppSubdomain = hostname.includes('app.suitpax.com') || 
                        hostname.startsWith('app.') ||
                        (process.env.NODE_ENV === 'development' && hostname.includes('localhost:3001'))

  // Rutas que siempre deben permitirse (static files, Next.js internals)
  const isStaticRoute = 
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") || // Cualquier archivo con extensión
    pathname.startsWith("/api/health") || // Health check endpoint
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"

  // Si es una ruta estática, siempre permitir
  if (isStaticRoute) {
    return NextResponse.next()
  }

  // Lógica específica para app.suitpax.com
  if (isAppSubdomain) {
    // Rutas permitidas en el subdominio app
    const allowedAppPaths = ['/login', '/signup', '/dashboard', '/api', '/auth']
    const isAllowedAppPath = allowedAppPaths.some(path => pathname.startsWith(path))
    
    // Si es la ruta raíz, redirigir a login
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Si no es una ruta permitida, redirigir a login
    if (!isAllowedAppPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      // Evitar loops infinitos
      if (pathname !== '/login') {
        return NextResponse.redirect(url)
      }
    }
    
    return NextResponse.next()
  }

  // Lógica para el dominio principal (suitpax.com)
  const publicPaths = [
    "/",
    "/manifesto",
    "/pricing",
    "/travel-expense-management",
    "/contact",
    "/solutions",
    "/public",
    "/api/public"
  ]
  
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Para rutas protegidas en el dominio principal
  // Aquí podrías agregar lógica de autenticación si es necesario
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|public).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
