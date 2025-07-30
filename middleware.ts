import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/manifesto",
    "/pricing",
    "/travel-expense-management",
    "/contact",
    "/solutions",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/callback",
    "/api/public",
    "/api/contact",
    "/api/elevenlabs",
    "/voice-ai-demo",
  ]

  // Archivos estáticos y recursos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Permitir rutas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar autenticación para rutas protegidas (dashboard, api privadas)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/private")) {
    try {
      const supabase = createClient()
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        // Redirigir a login si no hay sesión válida
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verificar que el usuario existe en la base de datos
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, onboarding_completed")
        .eq("id", session.user.id)
        .single()

      if (userError && userError.code !== "PGRST116") {
        console.error("Error verificando usuario:", userError)
        const loginUrl = new URL("/auth/login", request.url)
        return NextResponse.redirect(loginUrl)
      }

      // Si el usuario no existe, permitir acceso para que se cree automáticamente
      return NextResponse.next()
    } catch (error) {
      console.error("Error en middleware:", error)
      const loginUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Permitir todas las demás rutas
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
