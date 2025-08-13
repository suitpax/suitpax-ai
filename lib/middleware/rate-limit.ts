import { type NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  private getKey(req: NextRequest): string {
    // Use IP address and user agent for rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get("user-agent") || "unknown"
    return `${ip}:${userAgent.slice(0, 50)}`
  }

  async isAllowed(req: NextRequest): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
    const key = this.getKey(req)
    const now = Date.now()

    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      }
      return { allowed: true, resetTime: this.store[key].resetTime, remaining: this.config.maxRequests - 1 }
    }

    this.store[key].count++
    const remaining = Math.max(0, this.config.maxRequests - this.store[key].count)
    const allowed = this.store[key].count <= this.config.maxRequests

    if (!allowed) {
      logger.warn("Rate limit exceeded", {
        key,
        count: this.store[key].count,
        maxRequests: this.config.maxRequests,
        endpoint: req.nextUrl.pathname,
      })
    }

    return { allowed, resetTime: this.store[key].resetTime, remaining }
  }
}

// Different rate limits for different endpoints
export const rateLimiters = {
  api: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 100 }), // 100 requests per 15 minutes
  auth: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 auth attempts per 15 minutes
  ai: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 AI requests per minute
  upload: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 5 }), // 5 uploads per minute
}

export function withRateLimit(limiter: RateLimiter) {
  return async (req: NextRequest, handler: () => Promise<NextResponse>) => {
    const { allowed, resetTime, remaining } = await limiter.isAllowed(req)

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetTime: new Date(resetTime).toISOString(),
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limiter["config"].maxRequests.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(resetTime).toISOString(),
            "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    const response = await handler()

    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", limiter["config"].maxRequests.toString())
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Reset", new Date(resetTime).toISOString())

    return response
  }
}
