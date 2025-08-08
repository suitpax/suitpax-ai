// 1. ELIMINAR IMPORTACIÓN FALTANTE
// app/api/flights/route.ts
import { NextRequest, NextResponse } from "next/server";
// ❌ ELIMINAR: import { searchDuffel } from "./duffel/route";

export async function POST(req: NextRequest) {
  const params = await req.json();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const duffelResponse = await fetch(`${baseUrl}/api/flights/duffel/flight-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const duffelData = await duffelResponse.json();
    
    return NextResponse.json({
      success: true,
      offers: duffelData.offers || [],
      providers: ['duffel']
    });

  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to search flights",
      offers: []
    }, { status: 500 });
  }
}

// 2. CONFIGURACIÓN DUFFEL CONDICIONAL
// Crear utils/duffel-config.ts
import { Duffel } from "@duffel/api";

export const createDuffelClient = () => {
  const token = process.env.NODE_ENV === 'production' 
    ? process.env.DUFFEL_PRODUCTION_API_KEY 
    : process.env.DUFFEL_API_KEY;
    
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'test';
  
  if (!token) {
    throw new Error(`Duffel API key not configured for ${environment}`);
  }

  return new Duffel({
    token,
    environment: environment as 'test' | 'production'
  });
};

// 3. ACTUALIZAR FLIGHT-SEARCH
// app/api/flights/duffel/flight-search/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/utils/duffel-config"

export async function POST(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass
    } = await request.json()

    // Validaciones mejoradas
    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields"
      }, { status: 400 })
    }

    if (origin.length !== 3 || destination.length !== 3) {
      return NextResponse.json({
        success: false,
        error: "Invalid airport codes"
      }, { status: 400 })
    }

    const slices = [{ origin, destination, departure_date: departureDate }]
    if (returnDate) {
      slices.push({ origin: destination, destination: origin, departure_date: returnDate })
    }

    const passengerArray = Array(passengers).fill({ type: "adult" })

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: passengerArray,
      cabin_class: cabinClass || "economy"
    })

    return NextResponse.json({
      success: true,
      offers: offerRequest.data.offers || [],
      request_id: offerRequest.data.id
    })

  } catch (error) {
    console.error("Duffel API Error:", error)
    
    // Manejo específico de errores
    if (error instanceof Error) {
      if (error.message.includes('airport not found')) {
        return NextResponse.json({
          success: false,
          error: "Invalid airport codes",
          error_code: "AIRPORT_NOT_FOUND"
        }, { status: 400 })
      }
      
      if (error.message.includes('no offers available')) {
        return NextResponse.json({
          success: true,
          offers: [],
          message: "No flights available for selected dates"
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: "Failed to search flights"
    }, { status: 500 })
  }
}

// 4. ACTUALIZAR BOOKING (SIN PAGOS STRIPE POR AHORA)
// app/api/flights/duffel/booking/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/utils/duffel-config"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { offerId, passengers } = await request.json()

    if (!offerId || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Offer ID and passengers required"
      }, { status: 400 })
    }

    // Obtener oferta actualizada
    const offer = await duffel.offers.get(offerId)

    // Configurar método de pago según environment
    const paymentMethod = process.env.NODE_ENV === 'production' 
      ? { type: "arc_bsp_cash" } // Para producción con acreditación
      : { type: "balance" }; // Para test/sandbox

    const order = await duffel.orders.create({
      selected_offers: [offerId],
      passengers: passengers.map((passenger: any) => ({
        id: passenger.id,
        phone_number: passenger.phone_number,
        email: passenger.email,
        born_on: passenger.born_on,
        title: passenger.title,
        gender: passenger.gender,
        family_name: passenger.family_name,
        given_name: passenger.given_name
      })),
      payments: [{
        ...paymentMethod,
        currency: offer.data.total_currency,
        amount: offer.data.total_amount
      }]
    })

    // Guardar en DB
    await supabase.from("flight_bookings").insert({
      user_id: user.id,
      duffel_order_id: order.data.id,
      offer_id: offerId,
      status: 'confirmed',
      total_amount: order.data.total_amount,
      total_currency: order.data.total_currency,
      passengers: passengers,
      booking_reference: order.data.booking_reference,
      metadata: { duffel_response: order.data }
    })

    return NextResponse.json({
      success: true,
      order: order.data
    })

  } catch (error) {
    console.error("Booking Error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes('offer no longer available')) {
        return NextResponse.json({
          success: false,
          error: "Flight offer expired",
          error_code: "OFFER_EXPIRED"
        }, { status: 409 })
      }
    }

    return NextResponse.json({
      success: false,
      error: "Failed to create booking"
    }, { status: 500 })
  }
}

// 5. ACTUALIZAR TODOS LOS SERVICIOS CON CONFIGURACIÓN DINÁMICA
// Aplicar el mismo patrón a:
// - app/api/flights/duffel/aircraft/service.ts
// - app/api/flights/duffel/airlines/service.ts  
// - app/api/flights/duffel/airports/route.ts
// - app/api/flights/duffel/baggage/route.ts
// - Y todos los demás archivos de Duffel

// Ejemplo para airports/route.ts:
import { createDuffelClient } from "@/utils/duffel-config"

export async function GET(request: NextRequest) {
  try {
    const duffel = createDuffelClient(); // ✅ Usar configuración dinámica
    
    // resto del código...
  } catch (error) {
    // manejo de errores...
  }
}

// 6. VARIABLES DE ENTORNO REQUERIDAS
// .env.production
DUFFEL_PRODUCTION_API_KEY=duffel_live_xxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com

// .env.local (desarrollo)  
DUFFEL_API_KEY=duffel_test_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

// 7. VERIFICACIONES DE PRODUCCIÓN
// utils/production-checks.ts
export const checkProductionReadiness = () => {
  const issues = [];
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DUFFEL_PRODUCTION_API_KEY) {
      issues.push('DUFFEL_PRODUCTION_API_KEY missing');
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      issues.push('ANTHROPIC_API_KEY missing');
    }
    if (!process.env.BREVO_API_KEY) {
      issues.push('BREVO_API_KEY missing');
    }
  }
  
  return issues;
};

// 8. MANEJO DE ERRORES MEJORADO
export const handleDuffelError = (error: any) => {
  console.error("Duffel Error:", error);
  
  if (error.message?.includes('authentication')) {
    return { error: "API authentication failed", status: 401 };
  }
  
  if (error.message?.includes('rate limit')) {
    return { error: "Too many requests", status: 429 };
  }
  
  return { error: "Service temporarily unavailable", status: 500 };
};