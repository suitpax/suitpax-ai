import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country") || "GB"

    if (!process.env.GOCARDLESS_SECRET_ID || !process.env.GOCARDLESS_SECRET_KEY) {
      return NextResponse.json({ error: "GoCardless credentials not configured" }, { status: 500 })
    }

    const client = getGoCardlessClient()
    const institutions = await client.getInstitutions(country)

    return NextResponse.json(institutions)
  } catch (error) {
    console.error("Error fetching institutions:", error)

    const errorMessage = error instanceof Error ? error.message : "Failed to fetch institutions"
    return NextResponse.json(
      {
        error: errorMessage,
        details: "Please check GoCardless configuration and credentials",
      },
      { status: 500 },
    )
  }
}
