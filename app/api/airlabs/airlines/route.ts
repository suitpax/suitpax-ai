import { type NextRequest, NextResponse } from "next/server"
import { airLabsClient } from "@/lib/airlabs/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      iata_code: searchParams.get("iata_code") || undefined,
      icao_code: searchParams.get("icao_code") || undefined,
      name: searchParams.get("name") || undefined,
      country_code: searchParams.get("country_code") || undefined,
    }

    const airlines = await airLabsClient.getAirlines(params)

    return NextResponse.json(airlines)
  } catch (error) {
    console.error("Error fetching airlines:", error)
    return NextResponse.json({ error: "Failed to fetch airlines data" }, { status: 500 })
  }
}
