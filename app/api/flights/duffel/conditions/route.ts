import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel";

/**
 * Endpoint para obtener y procesar condiciones de ofertas y órdenes de Duffel
 * Implementa las mejores prácticas para visualización de condiciones
 */
export async function GET(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const { searchParams } = new URL(request.url);
    
    const offerId = searchParams.get('offer_id');
    const orderId = searchParams.get('order_id');
    
    if (!offerId && !orderId) {
      return NextResponse.json({
        success: false,
        error: "Either offer_id or order_id is required"
      }, { status: 400 });
    }
    
    let conditions: any = null;
    let metadata: any = {};
    
    // Obtener condiciones de una oferta
    if (offerId) {
      const offer = await duffel.offers.get(offerId);
      conditions = offer.data.conditions;
      metadata = {
        type: 'offer',
        id: offer.data.id,
        created_at: offer.data.created_at,
        expires_at: offer.data.expires_at,
        owner: offer.data.owner,
        total_amount: offer.data.total_amount,
        total_currency: offer.data.total_currency
      };
    }
    
    // Obtener condiciones de una orden
    if (orderId) {
      const order = await duffel.orders.get(orderId);
      conditions = order.data.conditions;
      metadata = {
        type: 'order',
        id: order.data.id,
        booking_reference: order.data.booking_reference,
        created_at: order.data.created_at,
        owner: order.data.owner,
        total_amount: order.data.total_amount,
        total_currency: order.data.total_currency
      };
    }
    
    if (!conditions) {
      return NextResponse.json({
        success: true,
        message: "No conditions available for this offer/order",
        metadata
      });
    }
    
    // Procesar condiciones para mejor legibilidad
    const processedConditions = processConditions(conditions);
    
    return NextResponse.json({
      success: true,
      metadata,
      conditions: processedConditions,
      raw_conditions: conditions // Incluir también las condiciones originales
    });
    
  } catch (error) {
    console.error("Conditions API Error:", error);
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status || 500 });
  }
}

/**
 * Procesa y formatea las condiciones para una mejor visualización
 */
function processConditions(conditions: any): any {
  const processed: any = {
    fare_rules: {},
    refund_info: null,
    change_info: null,
    cancellation_info: null,
    baggage_info: null,
    additional_info: []
  };
  
  // Procesar reglas de cambios
  if (conditions?.change_before_departure) {
    processed.change_info = {
      allowed: conditions.change_before_departure.allowed,
      penalty: conditions.change_before_departure.penalty_amount ? {
        amount: conditions.change_before_departure.penalty_amount,
        currency: conditions.change_before_departure.penalty_currency
      } : null,
      restrictions: formatRestrictions(conditions.change_before_departure.restrictions),
      deadline: conditions.change_before_departure.deadline_hours ? 
        `${conditions.change_before_departure.deadline_hours} hours before departure` : 
        "No specific deadline",
      user_friendly: getUserFriendlyText('change', conditions.change_before_departure)
    };
  }
  
  // Procesar reglas de reembolso
  if (conditions?.refund_before_departure) {
    processed.refund_info = {
      allowed: conditions.refund_before_departure.allowed,
      penalty: conditions.refund_before_departure.penalty_amount ? {
        amount: conditions.refund_before_departure.penalty_amount,
        currency: conditions.refund_before_departure.penalty_currency
      } : null,
      restrictions: formatRestrictions(conditions.refund_before_departure.restrictions),
      deadline: conditions.refund_before_departure.deadline_hours ? 
        `${conditions.refund_before_departure.deadline_hours} hours before departure` : 
        "No specific deadline",
      user_friendly: getUserFriendlyText('refund', conditions.refund_before_departure)
    };
  }
  
  // Procesar reglas de cancelación
  if (processed.refund_info && processed.change_info) {
    processed.cancellation_info = {
      fully_refundable: processed.refund_info.allowed && !processed.refund_info.penalty,
      non_refundable: !processed.refund_info.allowed,
      partially_refundable: processed.refund_info.allowed && processed.refund_info.penalty,
      penalty_amount: processed.refund_info.penalty?.amount,
      penalty_currency: processed.refund_info.penalty?.currency,
      user_friendly: getUserFriendlyCancellationText(processed.refund_info)
    };
  }
  
  // Procesar reglas de equipaje
  if (conditions?.baggages) {
    const baggagesByPassenger: any = {};
    
    conditions.baggages.forEach((baggage: any) => {
      const passengerId = baggage.passenger_id || 'default';
      
      if (!baggagesByPassenger[passengerId]) {
        baggagesByPassenger[passengerId] = {
          checked: [],
          carry_on: []
        };
      }
      
      if (baggage.type === 'checked') {
        baggagesByPassenger[passengerId].checked.push({
          quantity: baggage.quantity,
          weight: baggage.weight ? {
            amount: baggage.weight.amount,
            unit: baggage.weight.unit
          } : null,
          dimensions: baggage.dimensions || null
        });
      }
      
      if (baggage.type === 'carry_on') {
        baggagesByPassenger[passengerId].carry_on.push({
          quantity: baggage.quantity,
          weight: baggage.weight ? {
            amount: baggage.weight.amount,
            unit: baggage.weight.unit
          } : null,
          dimensions: baggage.dimensions || null
        });
      }
    });
    
    processed.baggage_info = {
      by_passenger: baggagesByPassenger,
      user_friendly: getBaggageSummary(baggagesByPassenger)
    };
  }
  
  // Procesar reglas de tarifa
  if (conditions?.fare_conditions) {
    conditions.fare_conditions.forEach((rule: any) => {
      if (!processed.fare_rules[rule.origin_type]) {
        processed.fare_rules[rule.origin_type] = {};
      }
      
      processed.fare_rules[rule.origin_type][rule.destination_type] = {
        type: rule.type,
        available: rule.available,
        details: rule.details
      };
    });
  }
  
  return processed;
}

/**
 * Formatea restricciones para legibilidad
 */
function formatRestrictions(restrictions: string[] | undefined): string[] {
  if (!restrictions || restrictions.length === 0) {
    return ["No specific restrictions mentioned"];
  }
  
  // Mejora la legibilidad de las restricciones
  return restrictions.map(restriction => {
    // Capitalizar primera letra y añadir punto si no tiene
    let improved = restriction.charAt(0).toUpperCase() + restriction.slice(1);
    if (!improved.endsWith('.')) {
      improved += '.';
    }
    
    // Reemplazar abreviaciones comunes
    improved = improved
      .replace(/tkt/gi, 'ticket')
      .replace(/pax/gi, 'passenger')
      .replace(/orig/gi, 'origin')
      .replace(/dest/gi, 'destination')
      .replace(/intl/gi, 'international')
      .replace(/dom/gi, 'domestic');
    
    return improved;
  });
}

/**
 * Genera texto amigable para cambios/reembolsos
 */
function getUserFriendlyText(type: 'change' | 'refund', conditions: any): string {
  if (!conditions.allowed) {
    return `This ticket does not allow ${type}s.`;
  }
  
  let text = '';
  
  if (conditions.penalty_amount) {
    text = `This ticket allows ${type}s with a fee of ${conditions.penalty_amount} ${conditions.penalty_currency}.`;
  } else {
    text = `This ticket allows ${type}s without any fee.`;
  }
  
  if (conditions.deadline_hours) {
    text += ` The ${type} must be requested at least ${conditions.deadline_hours} hours before departure.`;
  }
  
  return text;
}

/**
 * Genera texto amigable para cancelaciones
 */
function getUserFriendlyCancellationText(refundInfo: any): string {
  if (!refundInfo.allowed) {
    return "This ticket is non-refundable and cannot be cancelled for a refund.";
  }
  
  if (refundInfo.penalty && parseFloat(refundInfo.penalty.amount) > 0) {
    return `This ticket can be cancelled with a partial refund. Cancellation fee: ${refundInfo.penalty.amount} ${refundInfo.penalty.currency}.`;
  }
  
  return "This ticket is fully refundable if cancelled.";
}

/**
 * Genera resumen de equipaje
 */
function getBaggageSummary(baggagesByPassenger: any): string {
  const defaultBaggage = baggagesByPassenger.default || Object.values(baggagesByPassenger)[0];
  
  if (!defaultBaggage) {
    return "Baggage information not available.";
  }
  
  const checkedCount = defaultBaggage.checked.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const carryOnCount = defaultBaggage.carry_on.reduce((sum: number, item: any) => sum + item.quantity, 0);
  
  let summary = "";
  
  if (checkedCount > 0) {
    summary += `${checkedCount} checked bag${checkedCount !== 1 ? 's' : ''} included`;
    
    // Añadir información de peso si está disponible
    if (defaultBaggage.checked[0]?.weight) {
      summary += ` (up to ${defaultBaggage.checked[0].weight.amount}${defaultBaggage.checked[0].weight.unit} each)`;
    }
    
    if (carryOnCount > 0) {
      summary += " and ";
    }
  }
  
  if (carryOnCount > 0) {
    summary += `${carryOnCount} carry-on bag${carryOnCount !== 1 ? 's' : ''} included`;
    
    // Añadir información de peso si está disponible
    if (defaultBaggage.carry_on[0]?.weight) {
      summary += ` (up to ${defaultBaggage.carry_on[0].weight.amount}${defaultBaggage.carry_on[0].weight.unit} each)`;
    }
  }
  
  return summary || "No baggage included with this fare.";
}