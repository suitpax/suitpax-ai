import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError, getAirportData } from "@/lib/duffel";

/**
 * Endpoint para obtener y procesar información de escalas de vuelos en Duffel
 * Implementa las mejores prácticas para visualización de escalas según documentación
 */
export async function GET(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const { searchParams } = new URL(request.url);
    
    const offerId = searchParams.get('offer_id');
    const sliceId = searchParams.get('slice_id');
    
    if (!offerId) {
      return NextResponse.json({
        success: false,
        error: "offer_id is required"
      }, { status: 400 });
    }
    
    // Obtener la oferta con todos los detalles
    const offer = await duffel.offers.get(offerId);
    
    if (!offer.data) {
      return NextResponse.json({
        success: false,
        error: "Offer not found"
      }, { status: 404 });
    }
    
    let slices = offer.data.slices;
    
    // Si se especifica un slice_id, filtrar solo ese slice
    if (sliceId) {
      slices = slices.filter(slice => slice.id === sliceId);
      
      if (slices.length === 0) {
        return NextResponse.json({
          success: false,
          error: "Slice not found in this offer"
        }, { status: 404 });
      }
    }
    
    // Procesar y enriquecer información de escalas
    const processedSlices = await Promise.all(slices.map(async slice => {
      // Calcular número total de escalas
      const stopCount = slice.segments.length - 1;
      
      // Procesar cada segmento y sus escalas
      const processedSegments = await Promise.all(slice.segments.map(async (segment, index) => {
        // Obtener info del aeropuerto de origen
        const originInfo = await getAirportData(duffel, segment.origin.iata_code);
        
        // Obtener info del aeropuerto de destino
        const destinationInfo = await getAirportData(duffel, segment.destination.iata_code);
        
        return {
          id: segment.id,
          origin: {
            ...segment.origin,
            city: originInfo?.city?.name || null,
            country: originInfo?.country?.name || null,
            time_zone: originInfo?.time_zone || null
          },
          destination: {
            ...segment.destination,
            city: destinationInfo?.city?.name || null,
            country: destinationInfo?.country?.name || null,
            time_zone: destinationInfo?.time_zone || null
          },
          departing_at: segment.departing_at,
          arriving_at: segment.arriving_at,
          duration: segment.duration,
          marketing_carrier: segment.marketing_carrier,
          operating_carrier: segment.operating_carrier,
          flight_number: segment.flight_number,
          aircraft: segment.aircraft,
          // Si no es el último segmento, este es una escala para el itinerario
          is_stop: index < slice.segments.length - 1,
          // Calcular tiempo de conexión con el siguiente segmento
          connection_duration: index < slice.segments.length - 1 
            ? calculateConnectionDuration(segment.arriving_at, slice.segments[index + 1].departing_at)
            : null
        };
      }));
      
      // Extraer información de escalas
      const stops = processedSegments
        .filter((segment, index) => index < processedSegments.length - 1)
        .map((segment, index) => {
          return {
            airport: {
              iata_code: segment.destination.iata_code,
              name: segment.destination.name,
              city: segment.destination.city,
              country: segment.destination.country
            },
            arriving_at: segment.arriving_at,
            departing_at: processedSegments[index + 1].departing_at,
            duration_minutes: segment.connection_duration,
            connection_type: classifyConnection(segment.connection_duration),
            change_planes: segment.aircraft?.iata_code !== processedSegments[index + 1].aircraft?.iata_code,
            change_terminals: false // Esta info no está disponible en Duffel, se podría enriquecer con una API externa
          };
        });
      
      // Calcular duración total del viaje (de origen final a destino final)
      const totalDuration = calculateTotalDuration(
        processedSegments[0].departing_at,
        processedSegments[processedSegments.length - 1].arriving_at
      );
      
      // Calcular duración de vuelo y duración de conexiones
      const flightDurationMinutes = processedSegments.reduce((sum, segment) => {
        // Extraer minutos de la duración ISO 8601 (PT2H30M -> 150 minutos)
        const durationPattern = /PT(?:(\d+)H)?(?:(\d+)M)?/;
        const matches = segment.duration.match(durationPattern);
        
        if (!matches) return sum;
        
        const hours = matches[1] ? parseInt(matches[1]) : 0;
        const minutes = matches[2] ? parseInt(matches[2]) : 0;
        
        return sum + (hours * 60 + minutes);
      }, 0);
      
      const connectionDurationMinutes = stops.reduce((sum, stop) => sum + stop.duration_minutes, 0);
      
      return {
        id: slice.id,
        origin: processedSegments[0].origin,
        destination: processedSegments[processedSegments.length - 1].destination,
        departing_at: processedSegments[0].departing_at,
        arriving_at: processedSegments[processedSegments.length - 1].arriving_at,
        duration: {
          total_minutes: totalDuration,
          flight_minutes: flightDurationMinutes,
          connection_minutes: connectionDurationMinutes,
          formatted: formatDuration(totalDuration)
        },
        stops: {
          count: stopCount,
          details: stops,
          airports: stops.map(stop => stop.airport.iata_code),
          longest_connection: stops.length > 0 
            ? Math.max(...stops.map(stop => stop.duration_minutes))
            : 0,
          shortest_connection: stops.length > 0 
            ? Math.min(...stops.map(stop => stop.duration_minutes))
            : 0,
          has_overnight_connection: stops.some(stop => isOvernightConnection(stop.arriving_at, stop.departing_at))
        },
        segments: processedSegments
      };
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        id: offer.data.id,
        slices: processedSlices,
        total_duration_minutes: processedSlices.reduce((sum, slice) => sum + slice.duration.total_minutes, 0),
        total_stops: processedSlices.reduce((sum, slice) => sum + slice.stops.count, 0)
      }
    });
    
  } catch (error) {
    console.error("Stops API Error:", error);
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status || 500 });
  }
}

/**
 * Calcula la duración de la conexión en minutos
 */
function calculateConnectionDuration(arrivingAt: string, departingAt: string): number {
  const arrivalTime = new Date(arrivingAt);
  const departureTime = new Date(departingAt);
  
  // Diferencia en milisegundos
  const diffMs = departureTime.getTime() - arrivalTime.getTime();
  
  // Convertir a minutos
  return Math.floor(diffMs / (1000 * 60));
}

/**
 * Calcula la duración total del viaje en minutos
 */
function calculateTotalDuration(departingAt: string, arrivingAt: string): number {
  const departureTime = new Date(departingAt);
  const arrivalTime = new Date(arrivingAt);
  
  // Diferencia en milisegundos
  const diffMs = arrivalTime.getTime() - departureTime.getTime();
  
  // Convertir a minutos
  return Math.floor(diffMs / (1000 * 60));
}

/**
 * Clasifica la conexión según su duración
 */
function classifyConnection(durationMinutes: number): string {
  if (durationMinutes < 45) {
    return "short";
  } else if (durationMinutes < 90) {
    return "standard";
  } else if (durationMinutes < 180) {
    return "long";
  } else {
    return "very_long";
  }
}

/**
 * Formatea duración en minutos a formato legible
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

/**
 * Determina si una conexión es nocturna (pasa la noche)
 */
function isOvernightConnection(arrivingAt: string, departingAt: string): boolean {
  const arrivalDate = new Date(arrivingAt);
  const departureDate = new Date(departingAt);
  
  // Si el día de salida es diferente al día de llegada
  return departureDate.getDate() !== arrivalDate.getDate();
}