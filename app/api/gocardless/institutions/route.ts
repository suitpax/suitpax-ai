import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"
import { handleApiError, handleGoCardlessError } from "@/lib/api/error-handler"
import { withRateLimit, rateLimiters } from "@/lib/middleware/rate-limit"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  return withRateLimit(rateLimiters.api)(request, async () => {
    try {
      const { searchParams } = new URL(request.url)
      const country = searchParams.get("country") || "GB"

      if (!/^[A-Z]{2}$/.test(country)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_INPUT",
              message: "Country must be a valid 2-letter ISO code",
            },
          },
          { status: 400 },
        )
      }

      const client = getGoCardlessClient()

      logger.info("Fetching GoCardless institutions", { country })

      const institutions = await client.getInstitutions(country)

      logger.info("Successfully fetched institutions", {
        country,
        count: institutions?.data?.length || 0,
      })

      return NextResponse.json({
        success: true,
        data: institutions,
        country,
      })
    } catch (error) {
      logger.error("Error fetching GoCardless institutions", {
        error: error instanceof Error ? error.message : "Unknown error",
        country: new URL(request.url).searchParams.get("country") || "GB",
      })

      const goCardlessError = handleGoCardlessError(error)
      return handleApiError(goCardlessError)
    }
  })
}
