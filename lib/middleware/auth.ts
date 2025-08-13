import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export async function withAuth(req: NextRequest, handler: (userId: string) => Promise<NextResponse>) {
  try {
    const supabase = createClient()

    // Get user from session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      logger.warn("Unauthorized access attempt", {
        endpoint: req.nextUrl.pathname,
        ip: req.headers.get("x-forwarded-for"),
        error: error?.message,
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Add user ID to request headers for logging
    const response = await handler(user.id)
    response.headers.set("x-user-id", user.id)

    return response
  } catch (error) {
    logger.error("Auth middleware error", {
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: req.nextUrl.pathname,
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function withOptionalAuth(req: NextRequest, handler: (userId?: string) => Promise<NextResponse>) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const response = await handler(user?.id)
    if (user?.id) {
      response.headers.set("x-user-id", user.id)
    }

    return response
  } catch (error) {
    logger.error("Optional auth middleware error", {
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: req.nextUrl.pathname,
    })

    return await handler()
  }
}
