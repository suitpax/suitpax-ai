import type { NextRequest, NextResponse } from "next/server"
import { withLogging } from "./logging"
import { withRateLimit, rateLimiters } from "./rate-limit"
import { withSecurity, type SecurityConfig } from "./security"
import { handleApiError } from "@/lib/api/error-handler"

interface ApiWrapperConfig {
  rateLimit?: keyof typeof rateLimiters
  security?: SecurityConfig
  requireAuth?: boolean
}

export function createApiHandler(handler: (req: NextRequest) => Promise<NextResponse>, config: ApiWrapperConfig = {}) {
  return async (req: NextRequest) => {
    // Apply logging middleware
    return withLogging(async (request: NextRequest) => {
      try {
        // Apply rate limiting if specified
        if (config.rateLimit) {
          const limiter = rateLimiters[config.rateLimit]
          return await withRateLimit(limiter)(request, async () => {
            // Apply security middleware if specified
            if (config.security) {
              return await withSecurity(config.security)(request, async () => {
                return await handler(request)
              })
            }
            return await handler(request)
          })
        }

        // Apply security middleware if specified (without rate limiting)
        if (config.security) {
          return await withSecurity(config.security)(request, async () => {
            return await handler(request)
          })
        }

        // Execute handler directly
        return await handler(request)
      } catch (error) {
        return handleApiError(error)
      }
    })(req)
  }
}

// Convenience functions for common patterns
export const createPublicApiHandler = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  createApiHandler(handler, { rateLimit: "api" })

export const createAuthApiHandler = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  createApiHandler(handler, { rateLimit: "api", requireAuth: true })

export const createAiApiHandler = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  createApiHandler(handler, { rateLimit: "ai", requireAuth: true })

export const createUploadApiHandler = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  createApiHandler(handler, { rateLimit: "upload", requireAuth: true })
