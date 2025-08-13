import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { z } from "zod"

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
  correlationId?: string
}

export class StandardApiError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: any
  public readonly correlationId?: string

  constructor(code: string, message: string, statusCode = 500, details?: any, correlationId?: string) {
    super(message)
    this.name = "StandardApiError"
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.correlationId = correlationId
  }
}

export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // Resources
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",

  // External Services
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  DUFFEL_ERROR: "DUFFEL_ERROR",
  GOCARDLESS_ERROR: "GOCARDLESS_ERROR",
  SUPABASE_ERROR: "SUPABASE_ERROR",

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // Business Logic
  OFFER_EXPIRED: "OFFER_EXPIRED",
  PRICE_CHANGED: "PRICE_CHANGED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",

  // System
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE_ERROR: "SERVICE_UNAVAILABLE_ERROR",
} as const

export function createApiError(
  code: keyof typeof ErrorCodes,
  message: string,
  statusCode = 500,
  details?: any,
  correlationId?: string,
): StandardApiError {
  return new StandardApiError(ErrorCodes[code], message, statusCode, details, correlationId)
}

export function handleApiError(error: unknown, correlationId?: string): NextResponse {
  // Handle StandardApiError
  if (error instanceof StandardApiError) {
    logger.error(`API Error: ${error.code}`, {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      correlationId: error.correlationId || correlationId,
    })

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: process.env.NODE_ENV === "development" ? error.details : undefined,
        },
        correlationId: error.correlationId || correlationId,
      },
      { status: error.statusCode },
    )
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    logger.warn("Validation error", {
      errors: error.errors,
      correlationId,
    })

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Invalid input data",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        correlationId,
      },
      { status: 400 },
    )
  }

  // Handle generic errors
  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
  const errorStack = error instanceof Error ? error.stack : undefined

  logger.error("Unhandled API error", {
    message: errorMessage,
    stack: errorStack,
    correlationId,
  })

  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      correlationId,
    },
    { status: 500 },
  )
}

// Specific error handlers for external services
export function handleDuffelError(error: any, correlationId?: string): StandardApiError {
  if (error?.response?.data?.errors) {
    const duffelErrors = error.response.data.errors
    return createApiError(
      "DUFFEL_ERROR",
      "Flight service error",
      error.response.status || 400,
      duffelErrors,
      correlationId,
    )
  }

  if (error?.message?.includes("offer_expired")) {
    return createApiError(
      "OFFER_EXPIRED",
      "Offer has expired. Please search for new flights.",
      410,
      null,
      correlationId,
    )
  }

  if (error?.message?.includes("price_changed")) {
    return createApiError(
      "PRICE_CHANGED",
      "Flight price has changed. Please review the updated price.",
      409,
      null,
      correlationId,
    )
  }

  return createApiError("DUFFEL_ERROR", "Flight service error", 500, null, correlationId)
}

export function handleSupabaseError(error: any, correlationId?: string): StandardApiError {
  if (error?.code === "PGRST116") {
    return createApiError("NOT_FOUND", "Resource not found", 404, null, correlationId)
  }

  if (error?.code === "23505") {
    return createApiError("ALREADY_EXISTS", "Resource already exists", 409, null, correlationId)
  }

  if (error?.code === "42501") {
    return createApiError("FORBIDDEN", "Insufficient permissions", 403, null, correlationId)
  }

  return createApiError("SUPABASE_ERROR", "Database error", 500, error?.message, correlationId)
}

export function handleGoCardlessError(error: any, correlationId?: string): StandardApiError {
  if (error?.response?.status === 404) {
    return createApiError("NOT_FOUND", "Bank account or institution not found", 404, null, correlationId)
  }

  if (error?.response?.status === 401) {
    return createApiError("UNAUTHORIZED", "Invalid GoCardless credentials", 401, null, correlationId)
  }

  if (error?.response?.status === 429) {
    return createApiError("RATE_LIMIT_EXCEEDED", "Too many requests to banking service", 429, null, correlationId)
  }

  return createApiError("GOCARDLESS_ERROR", "Banking service error", 500, error?.message, correlationId)
}

// Utility function to wrap API handlers with standardized error handling
export function withErrorHandling<T extends any[], R>(handler: (...args: T) => Promise<R>, correlationId?: string) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error, correlationId)
    }
  }
}
