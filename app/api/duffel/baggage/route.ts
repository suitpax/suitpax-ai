import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"
import { createClient } from "@/lib/supabase/server"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

interface BaggageSearchRequest {
  orderId: string
}

interface BaggageAddRequest {
  orderId: string
  services: Array<{
    id: string
    quantity: number
    passenger_id?: string
    segment_id?: string
  }>
}

// Obtener servicios de equipaje disponibles para una orden
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: "Order ID is required"
      }, { status: 400 })
    }

    // Verificar que la orden pertenece al usuario
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: "Order not found"
      }, { status: 404 })
    }

    try {
      // Obtener servicios disponibles de Duffel
      const availableServices = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: []
        }
      })

      // Filtrar solo servicios de equipaje
      const baggageServices = availableServices.data.available_actions?.filter(
        (action: any) => action.type === 'add_service' && 
        (action.service?.type === 'baggage' || action.service?.metadata?.type === 'baggage')
      ) || []

      // Procesar y categorizar servicios de equipaje
      const processedServices = baggageServices.map((service: any) => {
        const serviceData = service.service || service
        
        return {
          id: serviceData.id,
          type: serviceData.type,
          name: serviceData.metadata?.name || serviceData.name || 'Extra Baggage',
          description: serviceData.metadata?.description || serviceData.description,
          price: {
            amount: serviceData.total_amount,
            currency: serviceData.total_currency
          },
          weight_limit: serviceData.metadata?.weight_kg || null,
          size_limits: serviceData.metadata?.dimensions || null,
          category: categorize_baggage(serviceData),
          segment_applicable: serviceData.segment_ids || [],
          passenger_applicable: serviceData.passenger_ids || [],
          restrictions: serviceData.metadata?.restrictions || [],
          included_services: serviceData.metadata?.included || []
        }
      })

      // Agrupar servicios por categoría
      const categorizedServices = {
        checked_bags: processedServices.filter(s => s.category === 'checked'),
        carry_on: processedServices.filter(s => s.category === 'carry_on'),
        overweight: processedServices.filter(s => s.category === 'overweight'),
        oversized: processedServices.filter(s => s.category === 'oversized'),
        sports_equipment: processedServices.filter(s => s.category === 'sports'),
        other: processedServices.filter(s => s.category === 'other')
      }

      return NextResponse.json({
        success: true,
        order_id: orderId,
        services: categorizedServices,
        total_available: processedServices.length,
        currency: booking.total_currency,
        booking_reference: booking.booking_reference
      })

    } catch (duffelError: any) {
      console.error("Duffel baggage services error:", duffelError)
      
      if (duffelError.message?.includes('order not found')) {
        return NextResponse.json({
          success: false,
          error: "Order not found in airline system",
          error_code: "ORDER_NOT_FOUND"
        }, { status: 404 })
      }

      if (duffelError.message?.includes('no services available')) {
        return NextResponse.json({
          success: true,
          order_id: orderId,
          services: {
            checked_bags: [],
            carry_on: [],
            overweight: [],
            oversized: [],
            sports_equipment: [],
            other: []
          },
          total_available: 0,
          message: "No additional baggage services available for this booking"
        })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to retrieve baggage options",
        error_code: "BAGGAGE_FETCH_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Baggage API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Agregar servicios de equipaje a una orden
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      orderId,
      services
    }: BaggageAddRequest = await request.json()

    if (!orderId || !services || services.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Order ID and services are required"
      }, { status: 400 })
    }

    // Verificar que la orden pertenece al usuario
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: "Order not found"
      }, { status: 404 })
    }

    try {
      // Crear change request para agregar servicios de equipaje
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: []
        },
        services: {
          add: services.map(service => ({
            id: service.id,
            quantity: service.quantity,
            passenger_id: service.passenger_id,
            segment_id: service.segment_id
          })),
          remove: []
        }
      })

      if (!changeRequest.data) {
        throw new Error("No change request data received")
      }

      // Confirmar el cambio si es automáticamente aprobado
      let confirmedChange
      if (changeRequest.data.requires_confirmation) {
        confirmedChange = await duffel.orderChangeOffers.create({
          order_change_request_id: changeRequest.data.id,
          selected_order_change_offer: changeRequest.data.order_change_offers[0].id
        })
      } else {
        confirmedChange = changeRequest
      }

      // Actualizar la base de datos
      const { error: dbError } = await supabase
        .from("flight_bookings")
        .update({
          metadata: {
            ...booking.metadata,
            baggage_services: services,
            last_updated: new Date().toISOString()
          }
        })
        .eq("duffel_order_id", orderId)

      if (dbError) {
        console.error("Database update error:", dbError)
      }

      // Calcular costos adicionales
      const additionalCost = confirmedChange.data.total_amount || '0'
      const newTotalAmount = (
        parseFloat(booking.total_amount) + parseFloat(additionalCost)
      ).toString()

      return NextResponse.json({
        success: true,
        change_request: {
          id: confirmedChange.data.id,
          status: confirmedChange.data.status || 'confirmed',
          additional_cost: {
            amount: additionalCost,
            currency: booking.total_currency
          },
          new_total: {
            amount: newTotalAmount,
            currency: booking.total_currency
          },
          services_added: services.length,
          confirmation_required: changeRequest.data.requires_confirmation || false
        },
        services: services.map(service => ({
          id: service.id,
          quantity: service.quantity,
          status: 'confirmed'
        }))
      })

    } catch (duffelError: any) {
      console.error("Duffel baggage add error:", duffelError)
      
      if (duffelError.message?.includes('service not available')) {
        return NextResponse.json({
          success: false,
          error: "One or more baggage services are no longer available",
          error_code: "SERVICE_UNAVAILABLE"
        }, { status: 409 })
      }

      if (duffelError.message?.includes('payment required')) {
        return NextResponse.json({
          success: false,
          error: "Payment is required to add baggage services",
          error_code: "PAYMENT_REQUIRED"
        }, { status: 402 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to add baggage services",
        error_code: "BAGGAGE_ADD_FAILED",
        details: process.env.NODE_ENV === 'development' ? duffelError.message : undefined
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Baggage add API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Helper function para categorizar equipaje
function categorize_baggage(service: any): string {
  const name = (service.metadata?.name || service.name || '').toLowerCase()
  const description = (service.metadata?.description || service.description || '').toLowerCase()
  const combined = `${name} ${description}`

  if (combined.includes('checked') || combined.includes('hold')) {
    return 'checked'
  }
  if (combined.includes('carry') || combined.includes('cabin')) {
    return 'carry_on'
  }
  if (combined.includes('overweight') || combined.includes('heavy')) {
    return 'overweight'
  }
  if (combined.includes('oversized') || combined.includes('large')) {
    return 'oversized'
  }
  if (combined.includes('sport') || combined.includes('ski') || combined.includes('golf') || combined.includes('bike')) {
    return 'sports'
  }
  
  return 'other'
}

// Obtener historial de cambios de equipaje para una orden
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const serviceId = searchParams.get('serviceId')

    if (!orderId || !serviceId) {
      return NextResponse.json({
        success: false,
        error: "Order ID and Service ID are required"
      }, { status: 400 })
    }

    // Verificar que la orden pertenece al usuario
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: "Order not found"
      }, { status: 404 })
    }

    try {
      // Crear change request para remover servicio de equipaje
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: []
        },
        services: {
          add: [],
          remove: [{ id: serviceId }]
        }
      })

      return NextResponse.json({
        success: true,
        message: "Baggage service removed successfully",
        change_request_id: changeRequest.data.id
      })

    } catch (duffelError: any) {
      console.error("Duffel baggage remove error:", duffelError)
      
      return NextResponse.json({
        success: false,
        error: "Failed to remove baggage service",
        error_code: "BAGGAGE_REMOVE_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Baggage remove API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
