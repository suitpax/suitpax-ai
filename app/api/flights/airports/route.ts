import { type NextRequest, NextResponse } from "next/server"

// Popular airports database - in production, this would come from Duffel or another service
const AIRPORTS = [
  { iata_code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States" },
  { iata_code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "United States" },
  { iata_code: "LHR", name: "London Heathrow Airport", city: "London", country: "United Kingdom" },
  { iata_code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { iata_code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan" },
  { iata_code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
  { iata_code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates" },
  { iata_code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { iata_code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { iata_code: "MAD", name: "Adolfo Suárez Madrid-Barajas Airport", city: "Madrid", country: "Spain" },
  { iata_code: "BCN", name: "Barcelona-El Prat Airport", city: "Barcelona", country: "Spain" },
  { iata_code: "FCO", name: "Leonardo da Vinci International Airport", city: "Rome", country: "Italy" },
  { iata_code: "MXP", name: "Milan Malpensa Airport", city: "Milan", country: "Italy" },
  { iata_code: "ZUR", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
  { iata_code: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria" },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (query.length < 2) {
      return NextResponse.json({ airports: [] })
    }

    const filteredAirports = AIRPORTS.filter(
      (airport) =>
        airport.iata_code.toLowerCase().includes(query) ||
        airport.name.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query),
    ).slice(0, 10) // Limit to 10 results

    return NextResponse.json({ airports: filteredAirports })
  } catch (error) {
    console.error("Airport search error:", error)
    return NextResponse.json({ error: "Airport search failed" }, { status: 500 })
  }
}
