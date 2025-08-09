import { Duffel } from "@duffel/api";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Cache para datos frecuentemente accedidos
const CACHE_TTL = 3600000; // 1 hora en milisegundos
const airlineCache = new Map<string, { data: any; expires: number }>();
const airportCache = new Map<string, { data: any; expires: number }>();
const duffelClientCache = new Map<string, Duffel>();

/**
 * Crea un cliente Duffel estandarizado con caché
 */
export const createDuffelClient = (options?: { 
  token?: string; 
  environment?: 'test' | 'production';
}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const token = options?.token || process.env.DUFFEL_API_KEY || "";
  const environment = options?.environment || (isProduction ? 'production' : 'test');
  
  // Usar cliente en caché si existe
  const cacheKey = `${token}-${environment}`;
  if (duffelClientCache.has(cacheKey)) {
    return duffelClientCache.get(cacheKey)!;
  }
  
  if (!token) {
    throw new Error(`Duffel API key not configured for ${environment} environment`);
  }

  console.log(`Creating Duffel client for ${environment} environment`);

  const client = new Duffel({
    token,
    environment: environment as 'test' | 'production'
  });
  
  // Guardar en caché
  duffelClientCache.set(cacheKey, client);
  
  return client;
};

// ... [Todo tu código existente se mantiene igual] ...

/**
 * Manejo estandarizado de errores de Duffel con más detalle
 */
export const handleDuffelError = (error: any) => {
  console.error("Duffel API Error:", error);
  
  // Extraer mensaje más detallado si está disponible
  const errorMessage = error.message || 
                      (error.errors && error.errors[0]?.message) || 
                      "Unknown error";
  
  // Mapear tipos de errores comunes
  if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized') || error.status === 401) {
    return { 
      success: false,
      error: "API authentication failed", 
      error_code: "AUTH_FAILED",
      status: 401,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
  }
  
  if (errorMessage.includes('rate limit') || error.status === 429) {
    return { 
      success: false,
      error: "Too many requests. Please try again in a moment.", 
      error_code: "RATE_LIMIT",
      status: 429,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
  }

  if (errorMessage.includes('airport not found')) {
    return { 
      success: false,
      error: "Invalid airport codes", 
      error_code: "AIRPORT_NOT_FOUND",
      status: 400,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
  }

  if (errorMessage.includes('no offers available') || errorMessage.includes('no results found')) {
    return { 
      success: true,
      offers: [],
      message: "No flights available for selected dates",
      status: 200 
    };
  }
  
  if (error.status === 404) {
    return {
      success: false,
      error: "Resource not found",
      error_code: "NOT_FOUND",
      status: 404,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
  }
  
  if (error.status === 422) {
    return {
      success: false,
      error: "Invalid parameters",
      error_code: "INVALID_PARAMS",
      status: 422,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
  }
  
  // Error general
  return { 
    success: false,
    error: "Service temporarily unavailable", 
    error_code: "SERVICE_ERROR",
    status: error.status || 500,
    details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
  };
};

/**
 * Obtiene el método de pago adecuado según el entorno
 */
export const getPaymentMethod = (currency: string, amount: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return {
      type: "arc_bsp_cash",
      currency,
      amount
    };
  } else {
    return {
      type: "balance",
      currency,
      amount
    };
  }
};

/**
 * Construye parámetros de paginación estandarizados
 */
export function buildPaginationParams(limit = 50, after?: string, before?: string) {
  const params: any = { limit };
  if (after) params.after = after;
  if (before) params.before = before;
  return params;
}

/**
 * Genera una clave de idempotencia para operaciones seguras
 */
export function generateIdempotencyKey(): string {
  return uuidv4();
}

/**
 * Verifica la firma de webhooks de Duffel con seguridad mejorada
 */
export function verifyWebhookSignature(payload: string, signature?: string | null): boolean {
  if (!signature || !process.env.DUFFEL_WEBHOOK_SECRET) {
    console.warn("Missing signature or webhook secret");
    return false;
  }
  
  try {
    const hmac = crypto.createHmac('sha256', process.env.DUFFEL_WEBHOOK_SECRET);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('hex');
    
    // Comparación segura para evitar ataques de timing
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Mapea estados de Duffel a estados internos de la aplicación
 */
export function mapDuffelStatus(duffelStatus: string): string {
  const statusMap: Record<string, string> = {
    'confirmed': 'confirmed',
    'cancelled': 'cancelled',
    'draft': 'pending',
    'pending_payment': 'pending_payment',
    'hold': 'hold',
    'awaiting_passenger_information': 'awaiting_passenger_info',
    'ready_for_ticketing': 'ready_for_ticketing',
    'ticketed': 'ticketed',
    'in_process': 'in_process',
    'voided': 'voided'
  };
  
  return statusMap[duffelStatus] || 'unknown';
}

/**
 * Obtiene información de aerolínea con caché inteligente
 */
export async function getAirlineData(duffel: Duffel, iataCode: string) {
  const now = Date.now();
  const cacheKey = `airline-${iataCode}`;
  
  // Verificar caché
  if (airlineCache.has(cacheKey)) {
    const cached = airlineCache.get(cacheKey)!;
    if (now < cached.expires) {
      return cached.data;
    }
  }
  
  try {
    const airlines = await duffel.airlines.list({ iata_code: iataCode });
    
    if (airlines.data.length > 0) {
      const airlineData = {
        id: airlines.data[0].id,
        name: airlines.data[0].name,
        iata_code: airlines.data[0].iata_code,
        logo_lockup_url: airlines.data[0].logo_lockup_url,
        logo_symbol_url: airlines.data[0].logo_symbol_url,
        conditions_of_carriage_url: airlines.data[0].conditions_of_carriage_url,
      };
      
      // Guardar en caché
      airlineCache.set(cacheKey, {
        data: airlineData,
        expires: now + CACHE_TTL
      });
      
      return airlineData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching airline ${iataCode}:`, error);
    return null;
  }
}

/**
 * Obtiene información de aeropuerto con caché inteligente
 */
export async function getAirportData(duffel: Duffel, iataCode: string) {
  const now = Date.now();
  const cacheKey = `airport-${iataCode}`;
  
  // Verificar caché
  if (airportCache.has(cacheKey)) {
    const cached = airportCache.get(cacheKey)!;
    if (now < cached.expires) {
      return cached.data;
    }
  }
  
  try {
    const airports = await duffel.airports.list({ 
      iata_code: iataCode,
      limit: 1
    });
    
    if (airports.data.length > 0) {
      const airportData = airports.data[0];
      
      // Guardar en caché
      airportCache.set(cacheKey, {
        data: airportData,
        expires: now + CACHE_TTL
      });
      
      return airportData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching airport ${iataCode}:`, error);
    return null;
  }
}

/**
 * Procesa las condiciones de una oferta/orden para mejor visualización
 */
export function processConditions(conditions: any): any {
  if (!conditions) return null;
  
  const processed: any = {
    refundable: conditions.refund_before_departure?.allowed ?? false,
    changeable: conditions.change_before_departure?.allowed ?? false,
    refund_fee: conditions.refund_before_departure?.penalty_amount,
    change_fee: conditions.change_before_departure?.penalty_amount,
    refund_currency: conditions.refund_before_departure?.penalty_currency,
    change_currency: conditions.change_before_departure?.penalty_currency,
    baggage: {
      included_checked_bags: 0,
      included_carry_on_bags: 0,
      details: []
    }
  };
  
  // Procesar información de equipaje
  if (conditions.baggages) {
    conditions.baggages.forEach((baggage: any) => {
      if (baggage.type === 'checked') {
        processed.baggage.included_checked_bags += baggage.quantity;
      }
      if (baggage.type === 'carry_on') {
        processed.baggage.included_carry_on_bags += baggage.quantity;
      }
      
      processed.baggage.details.push({
        type: baggage.type,
        quantity: baggage.quantity,
        weight: baggage.weight,
        dimensions: baggage.dimensions,
        passenger_type: baggage.passenger_type || 'adult'
      });
    });
  }
  
  return processed;
}

/**
 * Procesa información de escalas para mejor visualización
 */
export function processStops(slices: any[]): any[] {
  return slices.map(slice => {
    // Calcular número de paradas
    const stopCount = slice.segments.length - 1;
    
    // Extraer aeropuertos de parada
    const stopAirports = stopCount > 0 
      ? slice.segments.slice(0, -1).map((segment: any) => segment.destination.iata_code)
      : [];
    
    // Determinar si hay conexiones nocturnas
    const hasOvernightConnection = stopCount > 0 && slice.segments.some((segment: any, index: number) => {
      if (index < slice.segments.length - 1) {
        const arrivalDate = new Date(segment.arriving_at);
        const departureDate = new Date(slice.segments[index + 1].departing_at);
        return departureDate.getDate() !== arrivalDate.getDate();
      }
      return false;
    });
    
    return {
      ...slice,
      stops: {
        count: stopCount,
        airports: stopAirports,
        has_overnight_connection: hasOvernightConnection
      }
    };
  });
}

/**
 * Determina si una tarifa es privada y calcula el descuento
 */
export function processPrivateFare(offer: any): any {
  // Determinar si es una tarifa privada
  const isPrivateFare = offer.private_fares?.length > 0;
  
  // Obtener detalles de las tarifas privadas
  const privateFareDetails = isPrivateFare ? offer.private_fares.map((fare: any) => ({
    type: fare.type,
    code: fare.code,
    owner_code: fare.owner_code,
    owner_name: fare.owner_name
  })) : [];
  
  // Determinar si se aplicó un programa de fidelidad
  const hasLoyaltyFare = offer.private_fares?.some((fare: any) => fare.type === 'loyalty_programme_account');
  
  // Determinar si se aplicó un código corporativo
  const hasCorporateFare = offer.private_fares?.some((fare: any) => fare.type === 'corporate_code');
  
  // Calcular el descuento en comparación con la tarifa pública (si hay una disponible)
  let discountAmount = null;
  let discountPercentage = null;
  
  if (isPrivateFare && offer.public_base_amount && offer.base_amount) {
    discountAmount = parseFloat(offer.public_base_amount) - parseFloat(offer.base_amount);
    discountPercentage = (discountAmount / parseFloat(offer.public_base_amount)) * 100;
  }
  
  return {
    is_private_fare: isPrivateFare,
    private_fare_details: privateFareDetails,
    has_loyalty_fare: hasLoyaltyFare,
    has_corporate_fare: hasCorporateFare,
    discount: {
      amount: discountAmount,
      percentage: discountPercentage ? parseFloat(discountPercentage.toFixed(2)) : null,
      currency: offer.total_currency
    }
  };
}

// Interfaces mejoradas
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  max_connections?: number;
  loyalty_programme_accounts?: Array<{
    airline_iata_code: string;
    account_number: string;
    account_holder_first_name?: string;
    account_holder_last_name?: string;
  }>;
  corporate_codes?: string[];
}

export interface BookingPassenger {
  given_name: string;
  family_name: string;
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
  gender: 'male' | 'female';
  born_on: string;
  phone_number: string;
  email: string;
}

export interface SeatSelection {
  passenger_id: string;
  seat_id: string;
  segment_id: string;
}

export interface BaggageService {
  id: string;
  quantity: number;
  passenger_id?: string;
  segment_id?: string;
}

// ✅ SOLUCIÓN: Eliminar instancia por defecto para evitar creación en build time
// Antes había una exportación de instancia por defecto que causaba errores si faltaba DUFFEL_API_KEY
// export const duffel = createDuffelClient();
// export default duffel;
