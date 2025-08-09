import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError, getAirlineData, processConditions, processStops, processPrivateFare } from "@/lib/duffel";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Esquema de validación mejorado para búsqueda
const searchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a valid 3-letter IATA code'),
  destination: z.string().length(3, 'Destination must be a valid 3-letter IATA code'),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: z.object({
    adults: z.number().int().min(1).max(9, 'Maximum 9 adults allowed'),
    children: z.number().int().min(0).max(8).optional(),
    infants: z.number().int().min(0).max(4).optional(),
  }),
  cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']).optional(),
  max_connections: z.number().int().min(0).max(3).optional(),
  use_loyalty_programs: z.boolean().optional(),
  use_corporate_codes: z.boolean().optional(),
  preferred_airlines: z.array(z.string()).optional(),
  exclude_airlines: z.array(z.string()).optional(),
  currency: z.string().length(3).optional(),
  tracking_id: z.string().optional(),
});

/**
 * POST - Búsqueda optimizada de vuelos implementando todas las mejores prácticas
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now(); // Para medir el tiempo de respuesta
  
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // La autenticación es opcional para búsquedas básicas
    const isAuthenticated = !!user;

    const body = await request.json();
    const searchParams = searchSchema.parse(body);
    
    // Crear cliente Duffel
    const duffel = createDuffelClient();
    
    // Preparar slices para la búsqueda
    const slices = [
      {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departure_date,
      }
    ];
    
    // Añadir vuelta si es ida y vuelta
    if (searchParams.return_date) {
      slices.push({
        origin: searchParams.destination,
        destination: searchParams.origin,
        departure_date: searchParams.return_date,
      });
    }
    
    // Preparar pasajeros de forma eficiente
    const passengers = [];
    
    // Añadir adultos
    for (let i = 0; i < searchParams.passengers.adults; i++) {
      passengers.push({ type: 'adult' });
    }
    
    // Añadir niños si existen
    if (searchParams.passengers.children && searchParams.passengers.children > 0) {
      for (let i = 0; i < searchParams.passengers.children; i++) {
        passengers.push({ type: 'child' });
      }
    }
    
    // Añadir bebés si existen
    if (searchParams.passengers.infants && searchParams.passengers.infants > 0) {
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        passengers.push({ type: 'infant_without_seat' });
      }
    }
    
    // Opciones base para la búsqueda
    const searchOptions: any = {
      slices,
      passengers,
      cabin_class: searchParams.cabin_class || 'economy',
      return_offers: true,
      max_connections: searchParams.max_connections ?? 2,
    };
    
    // Añadir preferencias de aerolíneas si se especifican
    if (searchParams.preferred_airlines && searchParams.preferred_airlines.length > 0) {
      searchOptions.only_show_offers_for_airline_iata_codes = searchParams.preferred_airlines;
    }
    
    // Añadir exclusiones de aerolíneas si se especifican
    if (searchParams.exclude_airlines && searchParams.exclude_airlines.length > 0) {
      searchOptions.exclude_airline_iata_codes = searchParams.exclude_airlines;
    }
    
    // Especificar moneda si se proporciona
    if (searchParams.currency) {
      searchOptions.currency = searchParams.currency;
    }
    
    // ID para tracking de la petición
    if (searchParams.tracking_id) {
      searchOptions.client_request_tracking_id = searchParams.tracking_id;
    } else {
      // Generar ID de tracking único si no se proporciona
      searchOptions.client_request_tracking_id = `search-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Añadir programas de fidelidad y códigos corporativos si el usuario está autenticado y lo solicita
    if (isAuthenticated) {
      if (searchParams.use_loyalty_programs) {
        const { data: userLoyaltyPrograms } = await supabase
          .from("user_loyalty_programs")
          .select("*")
          .eq("user_id", user.id);
        
        if (userLoyaltyPrograms && userLoyaltyPrograms.length > 0) {
          searchOptions.loyalty_programme_accounts = userLoyaltyPrograms.map(program => ({
            airline_iata_code: program.airline_iata_code,
            account_number: program.account_number,
            account_holder_first_name: program.account_holder_first_name,
            account_holder_last_name: program.account_holder_last_name,
            account_holder_title: program.account_holder_title
          }));
        }
      }
      
      if (searchParams.use_corporate_codes) {
        const { data: userCorporateCodes } = await supabase
          .from("user_corporate_codes")
          .select("*")
          .eq("user_id", user.id);
        
        if (userCorporateCodes && userCorporateCodes.length > 0) {
          searchOptions.corporate_codes = userCorporateCodes.map(code => code.code);
        }
      }
    }
    
    // Registrar la búsqueda en la base de datos para análisis
    let searchRecordId = null;
    if (isAuthenticated) {
      try {
        const { data: searchRecord } = await supabase
          .from("flight_searches")
          .insert({
            user_id: user.id,
            origin: searchParams.origin,
            destination: searchParams.destination,
            departure_date: searchParams.departure_date,
            return_date: searchParams.return_date,
            passengers: searchParams.passengers,
            cabin_class: searchParams.cabin_class,
            search_params: searchOptions,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (searchRecord) {
          searchRecordId = searchRecord.id;
        }
      } catch (error) {
        console.error("Error recording search:", error);
        // No interrumpir la búsqueda si hay error al registrar
      }
    }
    
    // Realizar la búsqueda
    console.log(`Performing flight search from ${searchParams.origin} to ${searchParams.destination}`);
    const offerRequest = await duffel.offerRequests.create(searchOptions);
    
    // Procesar las ofertas recibidas
    const offers = offerRequest.data.offers || [];
    
    // Registrar resultados y tiempo de respuesta
    const searchTime = Date.now() - startTime;
    console.log(`Search completed in ${searchTime}ms, found ${offers.length} offers`);
    
    // Actualizar registro de búsqueda con resultados
    if (searchRecordId) {
      await supabase
        .from("flight_searches")
        .update({
          offers_count: offers.length,
          response_time_ms: searchTime,
          updated_at: new Date().toISOString()
        })
        .eq("id", searchRecordId);
    }
    
    // Procesar y enriquecer ofertas
    const processedOffers = await Promise.all(offers.map(async offer => {
      // 1. Enriquecer con información de aerolíneas
      const airlineCodes = new Set<string>();
      
      offer.slices.forEach(slice => {
        slice.segments.forEach(segment => {
          if (segment.marketing_carrier?.iata_code) {
            airlineCodes.add(segment.marketing_carrier.iata_code);
          }
          if (segment.operating_carrier?.iata_code) {
            airlineCodes.add(segment.operating_carrier.iata_code);
          }
        });
      });
      
      // Obtener info de aerolíneas en paralelo
      const airlinePromises = Array.from(airlineCodes).map(code => 
        getAirlineData(duffel, code)
      );
      
      const airlineData = await Promise.all(airlinePromises);
      const airlineMap = new Map();
      
      airlineData.forEach((data, index) => {
        if (data) {
          airlineMap.set(Array.from(airlineCodes)[index], data);
        }
      });
      
      // 2. Enriquecer segmentos con logos y aerolíneas
      const enrichedSlices = offer.slices.map(slice => {
        return {
          ...slice,
          segments: slice.segments.map(segment => ({
            ...segment,
            marketing_carrier: segment.marketing_carrier ? {
              ...segment.marketing_carrier,
              ...airlineMap.get(segment.marketing_carrier.iata_code)
            } : segment.marketing_carrier,
            operating_carrier: segment.operating_carrier ? {
              ...segment.operating_carrier,
              ...airlineMap.get(segment.operating_carrier.iata_code)
            } : segment.operating_carrier,
          }))
        };
      });
      
      // 3. Procesar información de escalas
      const slicesWithStops = processStops(enrichedSlices);
      
      // 4. Procesar condiciones
      const conditions = processConditions(offer.conditions);
      
      // 5. Procesar información de tarifa privada
      const privateFareInfo = processPrivateFare(offer);
      
      // 6. Obtener aerolínea principal
      const primaryAirlineCode = offer.owner?.iata_code || 
        offer.slices[0]?.segments[0]?.marketing_carrier?.iata_code;
      
      const primaryAirline = airlineMap.get(primaryAirlineCode) || null;
      
      return {
        ...offer,
        slices: slicesWithStops,
        conditions: conditions,
        private_fare: privateFareInfo,
        primary_airline: primaryAirline,
      };
    }));
    
    // Ordenar ofertas: primero tarifas privadas, luego por precio
    const sortedOffers = processedOffers.sort((a, b) => {
      // Primero tarifas privadas
      if (a.private_fare.is_private_fare && !b.private_fare.is_private_fare) return -1;
      if (!a.private_fare.is_private_fare && b.private_fare.is_private_fare) return 1;
      
      // Luego por precio
      return parseFloat(a.total_amount) - parseFloat(b.total_amount);
    });
    
    // Agrupar ofertas por aerolínea
    const offersByAirline: Record<string, any[]> = {};
    
    sortedOffers.forEach(offer => {
      const airlineCode = offer.primary_airline?.iata_code || 'unknown';
      if (!offersByAirline[airlineCode]) {
        offersByAirline[airlineCode] = [];
      }
      offersByAirline[airlineCode].push(offer);
    });
    
    // Preparar resumen de resultados
    const summary = {
      total_offers: sortedOffers.length,
      price_range: {
        min: sortedOffers.length > 0 ? parseFloat(sortedOffers[0].total_amount) : null,
        max: sortedOffers.length > 0 ? parseFloat(sortedOffers[sortedOffers.length - 1].total_amount) : null,
        currency: sortedOffers.length > 0 ? sortedOffers[0].total_currency : null
      },
      airlines_count: Object.keys(offersByAirline).length,
      private_fares_count: sortedOffers.filter(o => o.private_fare.is_private_fare).length,
      refundable_offers_count: sortedOffers.filter(o => o.conditions?.refundable).length,
      search_time_ms: searchTime
    };
    
    return NextResponse.json({
      success: true,
      data: {
        id: offerRequest.data.id,
        offers: sortedOffers,
        offers_by_airline: offersByAirline,
        summary: summary,
        created_at: new Date().toISOString(),
        search_record_id: searchRecordId
      }
    });
    
  } catch (error) {
    console.error("Optimized search error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status || 500 });
  }
}
