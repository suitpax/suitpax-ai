import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country") || "GB"

    const client = getGoCardlessClient()
    const institutions = await client.getInstitutions(country)

    return NextResponse.json(institutions)
  } catch (error) {
    console.error("Error fetching institutions:", error)
    return NextResponse.json({ error: "Failed to fetch institutions" }, { status: 500 })
  }
}
