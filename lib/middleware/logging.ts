import type { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export function withLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const startTime = Date.now()
    const endpoint = req.nextUrl.pathname
    const method = req.method

    // Extract user ID from headers if available
    const userId = req.headers.get("x-user-id") || undefined

    const requestLog = await logger.logRequest(endpoint, method, userId, {
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      referer: req.headers.get("referer"),
    })

    try {
      const response = await handler(req)
      requestLog.end(response.status)
      return response
    } catch (error) {
      logger.error(`Unhandled error in ${method} ${endpoint}`, {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        correlationId: requestLog.correlationId,
      })
      requestLog.end(500, { error: "Internal server error" })
      throw error
    }
  }
}
