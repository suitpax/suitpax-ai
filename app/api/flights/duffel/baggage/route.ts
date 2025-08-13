import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createDuffelClient } from "@/lib/duffel"

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

    const duffel = createDuffelClient()

    try {
      // Obtener acciones disponibles para la orden
      const available = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: { add: [], remove: [] }
      } as any)

      const actions = (available as any)?.data?.available_actions || []

      // Filtrar solo servicios de equipaje
      const baggageServices = actions.filter(
        (action: any) => action.type === 'add_service' && 
        (action.service?.type === 'baggage' || action.service?.metadata?.type === 'baggage')
      )

      // Procesar y categorizar servicios de equipaje
      const processedServices = baggageServices.map((service: any) => {
        const serviceData = service.service || service

        return {
          id: serviceData.id,
          type: serviceData.type,
          name: serviceData.metadata?.name || serviceData.name || 'Extra Baggage',
          description: serviceData.metadata?.description || serviceData.description,
          price: {
            amount: serviceData.total_amount || serviceData.price?.amount,
            currency: serviceData.total_currency || serviceData.price?.currency,
          },
          metadata: serviceData.metadata,
        }
      })

      return NextResponse.json({ success: true, services: processedServices })
    } catch (error) {
      console.error('Duffel API Error (baggage GET):', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch baggage services' }, { status: 500 })
    }
  } catch (error) {
    console.error('Auth/validation error (baggage GET):', error)
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 })
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

    const body = (await request.json()) as BaggageAddRequest
    const { orderId, services } = body

    if (!orderId || !services?.length) {
      return NextResponse.json({ success: false, error: 'Order ID and services are required' }, { status: 400 })
    }

    // Verificar que la orden pertenece al usuario
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const duffel = createDuffelClient()

    try {
      // Crear change request para agregar servicios de equipaje
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: [],
        },
        // @ts-expect-error services typing can differ
        services: {
          add: services.map((s) => ({
            id: s.id,
            quantity: s.quantity ?? 1,
            passenger_id: s.passenger_id,
            segment_id: s.segment_id,
          })),
          remove: [],
        },
      } as any)

      return NextResponse.json({ success: true, change_request_id: (changeRequest as any).data?.id })
    } catch (error) {
      console.error('Duffel API Error (baggage POST):', error)
      return NextResponse.json({ success: false, error: 'Failed to add baggage services' }, { status: 500 })
    }
  } catch (error) {
    console.error('Auth/validation error (baggage POST):', error)
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 })
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
      return NextResponse.json({ success: false, error: 'Order ID and serviceId are required' }, { status: 400 })
    }

    // Verificar que la orden pertenece al usuario
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const duffel = createDuffelClient()

    try {
      // Crear change request para remover servicio de equipaje
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: [],
        },
        // @ts-expect-error services typing can differ
        services: {
          add: [],
          remove: [{ id: serviceId }],
        },
      } as any)

      return NextResponse.json({ success: true, change_request_id: (changeRequest as any).data?.id })
    } catch (error) {
      console.error('Duffel API Error (baggage DELETE):', error)
      return NextResponse.json({ success: false, error: 'Failed to remove baggage service' }, { status: 500 })
    }
  } catch (error) {
    console.error('Auth/validation error (baggage DELETE):', error)
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 })
  }
}
