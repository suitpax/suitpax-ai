import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from 'crypto';
import { createDuffelClient } from "@/lib/duffel";

export async function POST(request: NextRequest) {
  try {
    // Verificar firma del webhook
    const signature = request.headers.get('duffel-signature');
    const payload = await request.text();
    const isValid = verifySignature(payload, signature);
    
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    const event = JSON.parse(payload);
    console.log("Webhook received:", event.type);
    
    const supabase = createClient();
    
    // Manejar diferentes tipos de eventos
    if (event.type === 'order.updated') {
      await supabase
        .from("flight_bookings")
        .update({
          status: mapDuffelStatus(event.data.status),
          updated_at: new Date().toISOString()
        })
        .eq("duffel_order_id", event.data.id);
        
      console.log(`Order ${event.data.id} updated to status: ${event.data.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}

function verifySignature(payload: string, signature?: string | null): boolean {
  if (!signature || !process.env.DUFFEL_WEBHOOK_SECRET) {
    console.warn("Missing signature or webhook secret");
    return false;
  }
  
  try {
    const hmac = crypto.createHmac('sha256', process.env.DUFFEL_WEBHOOK_SECRET);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('hex');
    
    return calculatedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

function mapDuffelStatus(duffelStatus: string): string {
  // Mapear estados de Duffel a estados de tu aplicación
  const statusMap: Record<string, string> = {
    'confirmed': 'confirmed',
    'cancelled': 'cancelled',
    'draft': 'pending',
    'pending_payment': 'pending',
    'hold': 'hold',
    // Añadir otros mapeos de estado según necesites
  };
  
  return statusMap[duffelStatus] || 'unknown';
}