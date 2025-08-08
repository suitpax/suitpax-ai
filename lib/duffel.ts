import { Duffel } from "@duffel/api";
import { v4 as uuidv4 } from 'uuid';

export const createDuffelClient = () => {
 const isProduction = process.env.NODE_ENV === 'production';
 
 const token = process.env.DUFFEL_API_KEY;
   
 const environment = isProduction ? 'production' : 'test';
 
 if (!token) {
   throw new Error(`Duffel API key not configured for ${environment} environment`);
 }

 console.log(`Creating Duffel client for ${environment} environment`);

 return new Duffel({
   token,
   environment: environment as 'test' | 'production'
 });
};

export const handleDuffelError = (error: any) => {
 console.error("Duffel API Error:", error);
 
 if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
   return { 
     success: false,
     error: "API authentication failed", 
     error_code: "AUTH_FAILED",
     status: 401 
   };
 }
 
 if (error.message?.includes('rate limit')) {
   return { 
     success: false,
     error: "Too many requests. Please try again in a moment.", 
     error_code: "RATE_LIMIT",
     status: 429 
   };
 }

 if (error.message?.includes('airport not found')) {
   return { 
     success: false,
     error: "Invalid airport codes", 
     error_code: "AIRPORT_NOT_FOUND",
     status: 400 
   };
 }

 if (error.message?.includes('no offers available')) {
   return { 
     success: true,
     offers: [],
     message: "No flights available for selected dates",
     status: 200 
   };
 }
 
 return { 
   success: false,
   error: "Service temporarily unavailable", 
   error_code: "SERVICE_ERROR",
   status: 500 
 };
};

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

export function buildPaginationParams(limit = 50, after?: string, before?: string) {
 const params: any = { limit };
 if (after) params.after = after;
 if (before) params.before = before;
 return params;
}

export function generateIdempotencyKey(): string {
 return uuidv4();
}

export function verifyWebhookSignature(payload: string, signature?: string | null): boolean {
 if (!signature || !process.env.DUFFEL_WEBHOOK_SECRET) {
   console.warn("Missing signature or webhook secret");
   return false;
 }
 
 try {
   const crypto = require('crypto');
   const hmac = crypto.createHmac('sha256', process.env.DUFFEL_WEBHOOK_SECRET);
   hmac.update(payload);
   const calculatedSignature = hmac.digest('hex');
   
   return calculatedSignature === signature;
 } catch (error) {
   console.error("Signature verification error:", error);
   return false;
 }
}

export interface FlightSearchParams {
 origin: string
 destination: string
 departure_date: string
 return_date?: string
 passengers: {
   adults: number
   children?: number
   infants?: number
 }
 cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first'
}

export interface BookingPassenger {
 given_name: string
 family_name: string
 title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr'
 gender: 'male' | 'female'
 born_on: string
 phone_number: string
 email: string
}

export function mapDuffelStatus(duffelStatus: string): string {
 const statusMap: Record<string, string> = {
   'confirmed': 'confirmed',
   'cancelled': 'cancelled',
   'draft': 'pending',
   'pending_payment': 'pending',
   'hold': 'hold',
 };
 
 return statusMap[duffelStatus] || 'unknown';
}