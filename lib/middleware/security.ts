import { type NextRequest, NextResponse } from "next/server"
import { createHash, timingSafeEqual } from "crypto"
import { logger } from "@/lib/logger"

export interface SecurityConfig {
  requireApiKey?: boolean
  requireSignature?: boolean
  allowedOrigins?: string[]
  maxBodySize?: number // in bytes
}

export class SecurityValidator {
  private config: SecurityConfig

  constructor(config: SecurityConfig = {}) {
    this.config = {
      maxBodySize: 10 * 1024 * 1024, // 10MB default
      ...config,
    }
  }

  async validateRequest(req: NextRequest): Promise<{ valid: boolean; error?: string }> {
    // Validate API key if required
    if (this.config.requireApiKey) {
      const apiKey = req.headers.get("x-api-key")
      if (!apiKey) {
        return { valid: false, error: "API key required" }
      }

      const validApiKey = process.env.SUITPAX_API_KEY
      if (!validApiKey || !timingSafeEqual(Buffer.from(apiKey), Buffer.from(validApiKey))) {
        logger.warn("Invalid API key attempt", {
          ip: req.headers.get("x-forwarded-for"),
          userAgent: req.headers.get("user-agent"),
          endpoint: req.nextUrl.pathname,
        })
        return { valid: false, error: "Invalid API key" }
      }
    }

    // Validate request signature for webhooks
    if (this.config.requireSignature) {
      const signature = req.headers.get("x-signature")
      if (!signature) {
        return { valid: false, error: "Signature required" }
      }

      const body = await req.text()
      const expectedSignature = this.generateSignature(body)

      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        logger.warn("Invalid signature attempt", {
          ip: req.headers.get("x-forwarded-for"),
          endpoint: req.nextUrl.pathname,
        })
        return { valid: false, error: "Invalid signature" }
      }
    }

    // Validate CORS
    if (this.config.allowedOrigins) {
      const origin = req.headers.get("origin")
      if (origin && !this.config.allowedOrigins.includes(origin)) {
        return { valid: false, error: "Origin not allowed" }
      }
    }

    // Validate content length
    const contentLength = req.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > this.config.maxBodySize!) {
      return { valid: false, error: "Request body too large" }
    }

    return { valid: true }
  }

  private generateSignature(body: string): string {
    const secret = process.env.WEBHOOK_SECRET || "default-secret"
    return createHash("sha256")
      .update(body + secret)
      .digest("hex")
  }

  setCorsHeaders(response: NextResponse, origin?: string): NextResponse {
    if (this.config.allowedOrigins && origin && this.config.allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key, X-Signature")
      response.headers.set("Access-Control-Max-Age", "86400")
    }
    return response
  }
}

// Input validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, (match) => {
    const entities: { [key: string]: string } = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "&": "&amp;",
    }
    return entities[match]
  })
}

export function withSecurity(config: SecurityConfig = {}) {
  const validator = new SecurityValidator(config)

  return async (req: NextRequest, handler: () => Promise<NextResponse>) => {
    const { valid, error } = await validator.validateRequest(req)

    if (!valid) {
      return NextResponse.json({ error }, { status: 401 })
    }

    const response = await handler()
    return validator.setCorsHeaders(response, req.headers.get("origin") || undefined)
  }
}
