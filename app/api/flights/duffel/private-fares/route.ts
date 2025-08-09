import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from '@/lib/duffel';
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Esquema de validación para búsqueda con tarifas privadas
const privateSearchSchema = z.object({
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
  loyalty_programmes: z.array(z.string()).optional(),
  corporate_codes: z.array(z.string()).optional(),
  corporate_code_type: z.enum(['corporate_code', 'tour_code', 'discount_code']).optional()
});

/**
 * POST - Búsqueda de vuelos con tarifas privadas
 * Implementa las mejores prácticas para acceder a tarifas privadas (corporate y loyalty)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const searchParams = privateSearchSchema.parse(body);
    
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
    
    // Preparar pasajeros
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
    };
    
    // Array para almacenar programas de fidelidad a incluir
    const loyaltyProgrammeAccounts: any[] = [];
    
    // Si se solicitan programas de fidelidad específicos
    if (searchParams.loyalty_programmes && searchParams.loyalty_programmes.length > 0) {
      // Obtener programas de fidelidad del usuario
      const { data: userLoyaltyPrograms } = await supabase
        .from("user_loyalty_programs")
        .select("*")
        .eq("user_id", user.id)
        .in("id", searchParams.loyalty_programmes);
      
      if (userLoyaltyPrograms && userLoyaltyPrograms.length > 0) {
        userLoyaltyPrograms.forEach(program => {
          loyaltyProgrammeAccounts.push({
            airline_iata_code: program.airline_iata_code,
            account_number: program.account_number,
            account_holder_first_name: program.account_holder_first_name,
            account_holder_last_name: program.account_holder_last_name,
            account_holder_title: program.account_holder_title
          });
        });
      }
    } else {
      // Obtener todos los programas de fidelidad del usuario
      const { data: allUserLoyaltyPrograms } = await supabase
        .from("user_loyalty_programs")
        .select("*")
        .eq("user_id", user.id);
      
      if (allUserLoyaltyPrograms && allUserLoyaltyPrograms.length > 0) {
        allUserLoyaltyPrograms.forEach(program => {
          loyaltyProgrammeAccounts.push({
            airline_iata_code: program.airline_iata_code,
            account_number: program.account_number,
            account_holder_first_name: program.account_holder_first_name,
            account_holder_last_name: program.account_holder_last_name,
            account_holder_title: program.account_holder_title
          });
        });
      }
    }
    
    // Añadir programas de fidelidad a la búsqueda si hay alguno disponible
    if (loyaltyProgrammeAccounts.length > 0) {
      searchOptions.loyalty_programme_accounts = loyaltyProgrammeAccounts;
    }
    
    // Array para almacenar códigos corporativos a incluir
    const corporateCodes: string[] = [];
    
    // Si se solicitan códigos corporativos específicos
    if (searchParams.corporate_codes && searchParams.corporate_codes.length > 0) {
      // Obtener códigos corporativos del usuario
      const { data: userCorporateCodes } = await supabase
        .from("user_corporate_codes")
        .select("*")
        .eq("user_id", user.id)
        .in("id", searchParams.corporate_codes);
      
      if (userCorporateCodes && userCorporateCodes.length > 0) {
        userCorporateCodes.forEach(code => {
          // Solo incluir los del tipo correcto si se especifica
          if (!searchParams.corporate_code_type || code.code_type === searchParams.corporate_code_type) {
            corporateCodes.push(code.code);
          }
        });
      }
    } else {
      // Obtener todos los códigos corporativos del usuario
      const { data: allUserCorporateCodes } = await supabase
        .from("user_corporate_codes")
        .select("*")
        .eq("user_id", user.id);
      
      if (allUserCorporateCodes && allUserCorporateCodes.length > 0) {
        allUserCorporateCodes.forEach(code => {
          // Solo incluir los del tipo correcto si se especifica
          if (!searchParams.corporate_code_type || code.code_type === searchParams.corporate_code_type) {
            corporateCodes.push(code.code);
          }
        });
      }
    }
    
    // Añadir códigos corporativos a la búsqueda si hay alguno disponible
    if (corporateCodes.length > 0) {
      searchOptions.corporate_codes = corporateCodes;
    }
    
    // Realizar la búsqueda
    const offerRequest = await duffel.offerRequests.create(searchOptions);
    
    // Procesar las ofertas recibidas
    const offers = offerRequest.data.offers || [];
    
    // Procesar las ofertas para destacar aquellas con tarifas privadas
    const processedOffers = offers.map(offer => {
      // Determinar si es una tarifa privada
      const isPrivateFare = offer.private_fares?.length > 0;
      
      // Obtener detalles de las tarifas privadas
      const privateFareDetails = isPrivateFare ? offer.private_fares.map(fare => ({
        type: fare.type,
        code: fare.code,
        owner_code: fare.owner_code,
        owner_name: fare.owner_name
      })) : [];
      
      // Determinar si se aplicó un programa de fidelidad
      const hasLoyaltyFare = offer.private_fares?.some(fare => fare.type === 'loyalty_programme_account');
      
      // Determinar si se aplicó un código corporativo
      const hasCorporateFare = offer.private_fares?.some(fare => fare.type === 'corporate_code');
      
      // Calcular el descuento en comparación con la tarifa pública (si hay una disponible)
      let discountAmount = null;
      let discountPercentage = null;
      
      if (isPrivateFare && offer.public_base_amount && offer.base_amount) {
        discountAmount = parseFloat(offer.public_base_amount) - parseFloat(offer.base_amount);
        discountPercentage = (discountAmount / parseFloat(offer.public_base_amount)) * 100;
      }
      
      return {
        ...offer,
        enhanced: {
          is_private_fare: isPrivateFare,
          private_fare_details: privateFareDetails,
          has_loyalty_fare: hasLoyaltyFare,
          has_corporate_fare: hasCorporateFare,
          discount: {
            amount: discountAmount,
            percentage: discountPercentage ? parseFloat(discountPercentage.toFixed(2)) : null,
            currency: offer.total_currency
          }
        }
      };
    });
    
    // Ordenar ofertas: primero las privadas, luego por precio
    const sortedOffers = processedOffers.sort((a, b) => {
      // Primero por tarifa privada
      if (a.enhanced.is_private_fare && !b.enhanced.is_private_fare) return -1;
      if (!a.enhanced.is_private_fare && b.enhanced.is_private_fare) return 1;
      
      // Luego por descuento (mayor primero)
      if (a.enhanced.discount.percentage && b.enhanced.discount.percentage) {
        if (a.enhanced.discount.percentage > b.enhanced.discount.percentage) return -1;
        if (a.enhanced.discount.percentage < b.enhanced.discount.percentage) return 1;
      }
      
      // Finalmente por precio (menor primero)
      return parseFloat(a.total_amount) - parseFloat(b.total_amount);
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: offerRequest.data.id,
        loyalty_programmes_used: loyaltyProgrammeAccounts.length,
        corporate_codes_used: corporateCodes.length,
        offers: sortedOffers,
        total_offers: sortedOffers.length,
        private_fare_offers: sortedOffers.filter(o => o.enhanced.is_private_fare).length
      }
    });
    
  } catch (error) {
    console.error("Private fares search error:", error);
    
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
