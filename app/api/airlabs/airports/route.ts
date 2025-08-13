import { type NextRequest, NextResponse } from "next/server"
import { airLabsClient } from "@/lib/airlabs/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      iata_code: searchParams.get("iata_code") || undefined,
      icao_code: searchParams.get("icao_code") || undefined,
      country_code: searchParams.get("country_code") || undefined,
      city_code: searchParams.get("city_code") || undefined,
      name: searchParams.get("name") || undefined,
    }

    const airports = await airLabsClient.getAirports(params)

    return NextResponse.json(airports)
  } catch (error) {
    console.error("Error fetching airports:", error)
    return NextResponse.json({ error: "Failed to fetch airports data" }, { status: 500 })
  }
}
