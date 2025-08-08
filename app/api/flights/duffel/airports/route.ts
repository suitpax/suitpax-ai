import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel";

// Cache para aeropuertos - mejora el rendimiento
const airportCache = new Map<string, { data: any[], expires: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export async function GET(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q'); // Búsqueda por texto (nombre o código IATA)
    const lat = searchParams.get('lat'); // Latitud para búsqueda por área
    const lng = searchParams.get('lng'); // Longitud para búsqueda por área
    const radius = searchParams.get('radius'); // Radio en km para búsqueda por área
    const city = searchParams.get('city'); // Búsqueda por ciudad
    const country = searchParams.get('country'); // Búsqueda por país
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    
    // Verificar que tenemos al menos un parámetro de búsqueda
    if (!query && !lat && !lng && !city && !country) {
      return NextResponse.json({
        success: false,
        error: "At least one search parameter is required (q, lat/lng, city, or country)"
      }, { status: 400 });
    }
    
    // Si es búsqueda por texto, debe tener al menos 2 caracteres
    if (query && query.length < 2) {
      return NextResponse.json({
        success: false,
        error: "Text query must be at least 2 characters"
      }, { status: 400 });
    }

    // Verificar caché primero (para búsquedas por texto o ciudad/país)
    const cacheKey = query ? `query-${query}` : 
                    city ? `city-${city}` : 
                    country ? `country-${country}` : '';
                    
    if (cacheKey && airportCache.has(cacheKey)) {
      const cached = airportCache.get(cacheKey)!;
      if (Date.now() < cached.expires) {
        console.log(`Using cached airport data for "${cacheKey}"`);
        
        // Aplicar scoring y retornar resultados de caché
        const scoredAirports = applyScoring(cached.data, query || city || country || '');
        
        return NextResponse.json({
          success: true,
          airports: scoredAirports.slice(0, limit),
          query: query || city || country,
          total_found: scoredAirports.length,
          source: 'cache'
        });
      }
    }

    let airports: any[] = [];

    // 1. Búsqueda por coordenadas si se proporcionan
    if (lat && lng) {
      try {
        const nearbyAirports = await duffel.airports.list({
          limit: Math.max(limit, 20), // Buscar más para filtrar después
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          radius: radius ? parseInt(radius) : 50
        });
        airports = [...airports, ...nearbyAirports.data];
      } catch (error) {
        console.error("Error searching airports by location:", error);
      }
    }
    
    // 2. Búsqueda por código IATA exacto
    if (query && query.length === 3) {
      try {
        const iataSearch = await duffel.airports.list({
          limit: 5,
          iata_code: query.toUpperCase()
        });
        
        if (iataSearch.data.length > 0) {
          airports = [...airports, ...iataSearch.data];
        }
      } catch (error) {
        console.error("Error searching airports by IATA code:", error);
      }
    }
    
    // 3. Búsqueda por nombre o texto parcial
    if (query && query.length >= 2) {
      try {
        const nameSearch = await duffel.airports.list({
          limit: 15,
          name: query
        });
        airports = [...airports, ...nameSearch.data];
      } catch (error) {
        console.error("Error searching airports by name:", error);
      }
    }
    
    // 4. Búsqueda por ciudad
    if (city) {
      try {
        const citySearch = await duffel.airports.list({
          limit: 15,
          city: city
        });
        airports = [...airports, ...citySearch.data];
      } catch (error) {
        console.error("Error searching airports by city:", error);
      }
    }
    
    // 5. Búsqueda por país
    if (country) {
      try {
        const countrySearch = await duffel.airports.list({
          limit: 15,
          country: country
        });
        airports = [...airports, ...countrySearch.data];
      } catch (error) {
        console.error("Error searching airports by country:", error);
      }
    }
    
    // Eliminar duplicados
    const uniqueAirports = airports.filter((airport, index, self) => 
      index === self.findIndex(a => a.id === airport.id)
    );
    
    // Cachear resultados si es búsqueda por texto o ciudad/país
    if (cacheKey && uniqueAirports.length > 0) {
      airportCache.set(cacheKey, {
        data: uniqueAirports,
        expires: Date.now() + CACHE_TTL
      });
    }
    
    // Aplicar scoring y retornar resultados
    const searchTerm = query || city || country || '';
    const scoredAirports = applyScoring(uniqueAirports, searchTerm);
    
    return NextResponse.json({
      success: true,
      airports: scoredAirports.slice(0, limit),
      query: searchTerm,
      total_found: scoredAirports.length,
      source: 'api'
    });

  } catch (error) {
    console.error("Airports API Error:", error);
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status || 500 });
  }
}

/**
 * Aplica puntuación (scoring) a los aeropuertos para ordenarlos por relevancia
 */
function applyScoring(airports: any[], searchTerm: string): any[] {
  const queryLower = searchTerm.toLowerCase();
  
  // Asignar score a cada aeropuerto
  const scoredAirports = airports.map(airport => {
    let score = 0;
    
    // Prioridad máxima: código IATA exacto
    if (airport.iata_code?.toLowerCase() === queryLower) {
      score += 100;
    } else if (airport.iata_code?.toLowerCase().includes(queryLower)) {
      score += 50;
    }
    
    // Alta prioridad: nombre de ciudad
    if (airport.city?.name?.toLowerCase() === queryLower) {
      score += 80;
    } else if (airport.city_name?.toLowerCase() === queryLower) {
      score += 80;
    } else if (airport.city?.name?.toLowerCase().includes(queryLower)) {
      score += 40;
    } else if (airport.city_name?.toLowerCase().includes(queryLower)) {
      score += 40;
    }
    
    // Prioridad media: nombre del aeropuerto
    if (airport.name?.toLowerCase() === queryLower) {
      score += 60;
    } else if (airport.name?.toLowerCase().includes(queryLower)) {
      score += 30;
    }
    
    // Prioridad baja: país
    if (airport.country?.name?.toLowerCase().includes(queryLower)) {
      score += 20;
    } else if (airport.country_name?.toLowerCase().includes(queryLower)) {
      score += 20;
    }
    
    // Bonus para aeropuertos grandes e importantes
    if (airport.metadata?.is_major) {
      score += 15;
    }
    
    // Formato estandarizado de la respuesta
    return {
      id: airport.id,
      iata_code: airport.iata_code,
      name: airport.name,
      city_name: airport.city?.name || airport.city_name,
      country_name: airport.country?.name || airport.country_name,
      country_code: airport.country?.iso_country_code,
      time_zone: airport.time_zone,
      latitude: airport.latitude,
      longitude: airport.longitude,
      is_major: airport.metadata?.is_major || false,
      search_score: score
    };
  });
  
  // Ordenar por puntuación y retornar
  return scoredAirports.sort((a, b) => b.search_score - a.search_score);
}