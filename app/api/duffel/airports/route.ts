import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius')
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: false,
        error: "Query must be at least 2 characters"
      })
    }

    let airports: any[] = []

    // Si se proporcionan coordenadas, buscar por área geográfica
    if (lat && lng) {
      try {
        const nearbyAirports = await duffel.airports.list({
          limit: 20,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          radius: radius ? parseInt(radius) : 50 // Default 50km radius
        })
        airports = nearbyAirports.data
      } catch (error) {
        console.error("Error searching airports by location:", error)
      }
    }

    // Búsqueda principal por nombre/código
    try {
      const searchResults = await duffel.airports.list({
        limit: 15,
        name: query
      })
      
      // Combinar resultados y eliminar duplicados
      const allAirports = [...airports, ...searchResults.data]
      const uniqueAirports = allAirports.filter((airport, index, self) => 
        index === self.findIndex(a => a.id === airport.id)
      )

      // Mejorar scoring para búsquedas por código IATA
      const scoredAirports = uniqueAirports.map(airport => {
        let score = 0
        const queryLower = query.toLowerCase()
        
        // Priorizar coincidencias exactas de código IATA
        if (airport.iata_code?.toLowerCase() === queryLower) {
          score += 100
        } else if (airport.iata_code?.toLowerCase().includes(queryLower)) {
          score += 50
        }
        
        // Priorizar coincidencias de nombre de ciudad
        if (airport.city_name?.toLowerCase().includes(queryLower)) {
          score += 30
        }
        
        // Priorizar coincidencias de nombre de aeropuerto
        if (airport.name?.toLowerCase().includes(queryLower)) {
          score += 20
        }
        
        // Boost para aeropuertos más grandes (más conexiones)
        if (airport.time_zone && airport.iata_code) {
          score += 10
        }

        return { ...airport, search_score: score }
      })

      // Ordenar por score y tomar los mejores
      const sortedAirports = scoredAirports
        .sort((a, b) => b.search_score - a.search_score)
        .slice(0, 10)

      return NextResponse.json({
        success: true,
        airports: sortedAirports.map(airport => ({
          id: airport.id,
          iata_code: airport.iata_code,
          name: airport.name,
          city_name: airport.city_name,
          country_name: airport.country?.name || airport.country_name,
          country_code: airport.country?.iso_country_code,
          time_zone: airport.time_zone,
          latitude: airport.latitude,
          longitude: airport.longitude,
          search_score: airport.search_score
        })),
        query: query,
        total_found: sortedAirports.length
      })

    } catch (error) {
      console.error("Airports API Error:", error)
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to fetch airports",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("General API Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    )
  }
}