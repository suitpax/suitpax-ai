import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError } from "@/lib/duffel-config"

export async function GET(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius')
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: false,
        error: "Query must be at least 2 characters"
      }, { status: 400 })
    }

    let airports: any[] = []

    // Búsqueda por coordenadas si se proporcionan
    if (lat && lng) {
      try {
        const nearbyAirports = await duffel.airports.list({
          limit: 20,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          radius: radius ? parseInt(radius) : 50
        })
        airports = nearbyAirports.data
      } catch (error) {
        console.error("Error searching airports by location:", error)
      }
    }

    // Búsqueda por nombre/código IATA
    try {
      // Primero intentar búsqueda por código IATA exacto
      const iataSearch = await duffel.airports.list({
        limit: 5,
        iata_code: query.toUpperCase()
      })
      
      if (iataSearch.data.length > 0) {
        airports = [...airports, ...iataSearch.data]
      } else {
        // Si no hay resultados por IATA, buscar por nombre
        const nameSearch = await duffel.airports.list({
          limit: 15,
          name: query
        })
        airports = [...airports, ...nameSearch.data]
      }
    } catch (error) {
      console.error("Error searching airports:", error)
    }
    
    // Eliminar duplicados
    const uniqueAirports = airports.filter((airport, index, self) => 
      index === self.findIndex(a => a.id === airport.id)
    )

    // Mejorar scoring
    const scoredAirports = uniqueAirports.map(airport => {
      let score = 0
      const queryLower = query.toLowerCase()
      
      if (airport.iata_code?.toLowerCase() === queryLower) {
        score += 100
      } else if (airport.iata_code?.toLowerCase().includes(queryLower)) {
        score += 50
      }
      
      if (airport.city_name?.toLowerCase().includes(queryLower)) {
        score += 30
      }
      
      if (airport.name?.toLowerCase().includes(queryLower)) {
        score += 20
      }

      return { ...airport, search_score: score }
    })

    // Ordenar y limitar resultados
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
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}