export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDuffelClient, verifyWebhookSignature, mapDuffelStatus } from "@/lib/duffel";

/**
 * Maneja webhooks de Duffel para actualizar el estado de las órdenes y otras entidades
 * Implementa verificación de firma y procesamiento eficiente de eventos
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('duffel-signature');
    
    // Verificar firma del webhook para seguridad
    if (!verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    const event = JSON.parse(payload);
    const eventType = event.type;
    const eventId = event.id;
    
    console.log(`Processing Duffel webhook: ${eventType} (${eventId})`);
    
    const supabase = createClient();
    
    // Registrar el evento en la base de datos
    await supabase
      .from("webhook_events")
      .insert({
        event_id: eventId,
        event_type: eventType,
        provider: 'duffel',
        payload: event,
        processed_at: new Date().toISOString()
      })
      .catch(error => {
        console.error("Error logging webhook event:", error);
      });
    
    // Procesar diferentes tipos de eventos
    switch (eventType) {
      case 'order.created':
      case 'order.updated':
        await handleOrderUpdate(supabase, event.data);
        break;
        
      case 'order.cancelled':
        await handleOrderCancellation(supabase, event.data);
        break;
        
      case 'payment.created':
      case 'payment.updated':
        await handlePaymentUpdate(supabase, event.data);
        break;
        
      case 'passenger.updated':
        await handlePassengerUpdate(supabase, event.data);
        break;
        
      case 'service.created':
      case 'service.updated':
        await handleServiceUpdate(supabase, event.data);
        break;
        
      case 'order_change_request.created':
      case 'order_change_request.updated':
        await handleOrderChangeUpdate(supabase, event.data);
        break;
        
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${eventType} event` 
    });
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ 
      error: "Webhook processing error",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

/**
 * Maneja actualizaciones de órdenes
 */
async function handleOrderUpdate(supabase: any, orderData: any) {
  try {
    // Verificar si ya existe esta orden en nuestra base de datos
    const { data: existingBooking } = await supabase
      .from("flight_bookings")
      .select("id, duffel_order_id, status, metadata")
      .eq("duffel_order_id", orderData.id)
      .single();
    
    if (existingBooking) {
      // Actualizar orden existente
      await supabase
        .from("flight_bookings")
        .update({
          status: mapDuffelStatus(orderData.status),
          booking_reference: orderData.booking_reference,
          updated_at: new Date().toISOString(),
          metadata: {
            ...(existingBooking.metadata || {}),
            last_webhook_update: {
              timestamp: new Date().toISOString(),
              status: orderData.status,
              available_actions: orderData.available_actions
            }
          }
        })
        .eq("duffel_order_id", orderData.id);
      
      console.log(`Updated order ${orderData.id} to status: ${orderData.status}`);
    } else {
      // La orden no está en nuestra base de datos, podría ser una orden creada por otra vía
      console.log(`Received update for unknown order: ${orderData.id}`);
    }
    
    // Registrar historial de estado
    await supabase
      .from("order_status_history")
      .insert({
        order_id: orderData.id,
        status: orderData.status,
        booking_reference: orderData.booking_reference,
        created_at: new Date().toISOString(),
        source: 'webhook'
      });
      
  } catch (error) {
    console.error(`Error handling order update for ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Maneja cancelaciones de órdenes
 */
async function handleOrderCancellation(supabase: any, orderData: any) {
  try {
    // Actualizar estado de la orden en nuestra base de datos
    await supabase
      .from("flight_bookings")
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          cancellation: {
            cancelled_at: new Date().toISOString(),
            reason: 'Cancelled via webhook',
            initiated_by: 'airline'
          }
        }
      })
      .eq("duffel_order_id", orderData.id);
    
    // Buscar si hay alguna solicitud de cancelación pendiente
    const { data: pendingCancellation } = await supabase
      .from("order_cancellations")
      .select("*")
      .eq("order_id", orderData.id)
      .eq("status", "pending")
      .single();
    
    if (pendingCancellation) {
      // Actualizar el estado de la solicitud de cancelación
      await supabase
        .from("order_cancellations")
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq("id", pendingCancellation.id);
    }
    
    console.log(`Order ${orderData.id} has been cancelled`);
  } catch (error) {
    console.error(`Error handling order cancellation for ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Maneja actualizaciones de pagos
 */
async function handlePaymentUpdate(supabase: any, paymentData: any) {
  try {
    // Actualizar información de pago para la orden asociada
    if (paymentData.order_id) {
      const { data: booking } = await supabase
        .from("flight_bookings")
        .select("metadata")
        .eq("duffel_order_id", paymentData.order_id)
        .single();
      
      if (booking) {
        await supabase
          .from("flight_bookings")
          .update({
            payment_status: paymentData.status,
            updated_at: new Date().toISOString(),
            metadata: {
              ...(booking.metadata || {}),
              payment: {
                id: paymentData.id,
                status: paymentData.status,
                amount: paymentData.amount,
                currency: paymentData.currency,
                updated_at: new Date().toISOString()
              }
            }
          })
          .eq("duffel_order_id", paymentData.order_id);
        
        console.log(`Updated payment status for order ${paymentData.order_id} to ${paymentData.status}`);
      }
    }
  } catch (error) {
    console.error(`Error handling payment update for ${paymentData.id}:`, error);
    throw error;
  }
}

/**
 * Maneja actualizaciones de pasajeros
 */
async function handlePassengerUpdate(supabase: any, passengerData: any) {
  try {
    // Buscar la orden a la que pertenece este pasajero
    if (passengerData.order_id) {
      const { data: order } = await supabase
        .from("flight_bookings")
        .select("id, metadata")
        .eq("duffel_order_id", passengerData.order_id)
        .single();
      
      if (order) {
        // Actualizar información del pasajero en el metadata de la orden
        const metadata = order.metadata || {};
        const passengers = metadata.passengers || [];
        
        // Buscar y actualizar el pasajero específico
        const passengerIndex = passengers.findIndex((p: any) => p.id === passengerData.id);
        
        if (passengerIndex >= 0) {
          passengers[passengerIndex] = {
            ...passengers[passengerIndex],
            ...passengerData,
            updated_at: new Date().toISOString()
          };
        } else {
          passengers.push({
            ...passengerData,
            updated_at: new Date().toISOString()
          });
        }
        
        metadata.passengers = passengers;
        
        // Actualizar la orden
        await supabase
          .from("flight_bookings")
          .update({
            metadata,
            updated_at: new Date().toISOString()
          })
          .eq("id", order.id);
        
        console.log(`Updated passenger ${passengerData.id} for order ${passengerData.order_id}`);
      }
    }
  } catch (error) {
    console.error(`Error handling passenger update for ${passengerData.id}:`, error);
    throw error;
  }
}

/**
 * Maneja actualizaciones de servicios (equipaje, asientos, etc.)
 */
async function handleServiceUpdate(supabase: any, serviceData: any) {
  try {
    // Buscar la orden a la que pertenece este servicio
    if (serviceData.order_id) {
      const { data: order } = await supabase
        .from("flight_bookings")
        .select("id, metadata")
        .eq("duffel_order_id", serviceData.order_id)
        .single();
      
      if (order) {
        // Actualizar información del servicio en el metadata de la orden
        const metadata = order.metadata || {};
        const services = metadata.services || [];
        
        // Buscar y actualizar el servicio específico
        const serviceIndex = services.findIndex((s: any) => s.id === serviceData.id);
        
        if (serviceIndex >= 0) {
          services[serviceIndex] = {
            ...services[serviceIndex],
            ...serviceData,
            updated_at: new Date().toISOString()
          };
        } else {
          services.push({
            ...serviceData,
            updated_at: new Date().toISOString()
          });
        }
        
        metadata.services = services;
        
        // Actualizar la orden
        await supabase
          .from("flight_bookings")
          .update({
            metadata,
            updated_at: new Date().toISOString()
          })
          .eq("id", order.id);
        
        console.log(`Updated service ${serviceData.id} for order ${serviceData.order_id}`);
      }
    }
  } catch (error) {
    console.error(`Error handling service update for ${serviceData.id}:`, error);
    throw error;
  }
}

/**
 * Maneja actualizaciones de solicitudes de cambio de orden
 */
async function handleOrderChangeUpdate(supabase: any, changeData: any) {
  try {
    // Actualizar el estado de la solicitud de cambio en nuestra base de datos
    const { data: existingChange } = await supabase
      .from("order_changes")
      .select("*")
      .eq("duffel_change_request_id", changeData.id)
      .single();
    
    if (existingChange) {
      await supabase
        .from("order_changes")
        .update({
          status: changeData.status,
          updated_at: new Date().toISOString(),
          confirmation_data: changeData
        })
        .eq("duffel_change_request_id", changeData.id);
      
      console.log(`Updated change request ${changeData.id} to status: ${changeData.status}`);
      
      // Si el cambio se ha confirmado, actualizar la orden principal
      if (changeData.status === 'confirmed' && changeData.order) {
        await supabase
          .from("flight_bookings")
          .update({
            status: mapDuffelStatus(changeData.order.status),
            updated_at: new Date().toISOString(),
            metadata: {
              ...existingChange.original_data,
              last_change: {
                id: changeData.id,
                type: existingChange.change_type,
                confirmed_at: new Date().toISOString(),
                status: 'confirmed'
              },
              updated_order: changeData.order
            }
          })
          .eq("duffel_order_id", existingChange.order_id);
        
        console.log(`Updated order ${existingChange.order_id} with change request data`);
      }
    } else {
      // La solicitud de cambio no está en nuestra base de datos
      console.log(`Received update for unknown change request: ${changeData.id}`);
    }
  } catch (error) {
    console.error(`Error handling order change update for ${changeData.id}:`, error);
    throw error;
  }
}
