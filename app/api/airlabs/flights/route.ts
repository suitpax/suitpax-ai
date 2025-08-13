import { type NextRequest, NextResponse } from "next/server"
import { airLabsClient } from "@/lib/airlabs/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      bbox: searchParams.get("bbox") || undefined,
      airline_icao: searchParams.get("airline_icao") || undefined,
      airline_iata: searchParams.get("airline_iata") || undefined,
      flight_icao: searchParams.get("flight_icao") || undefined,
      flight_iata: searchParams.get("flight_iata") || undefined,
      flight_number: searchParams.get("flight_number") || undefined,
      dep_icao: searchParams.get("dep_icao") || undefined,
      dep_iata: searchParams.get("dep_iata") || undefined,
      arr_icao: searchParams.get("arr_icao") || undefined,
      arr_iata: searchParams.get("arr_iata") || undefined,
      aircraft_icao: searchParams.get("aircraft_icao") || undefined,
      flag: searchParams.get("flag") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    const flights = await airLabsClient.getFlights(params)

    return NextResponse.json(flights)
  } catch (error) {
    console.error("Error fetching flights:", error)
    return NextResponse.json({ error: "Failed to fetch flights data" }, { status: 500 })
  }
}
