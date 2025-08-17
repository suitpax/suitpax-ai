import { NextResponse } from 'next/server';
import { getDuffelClient } from '@/lib/duffel';

function buildPassengerArray(passengers: any): Array<{ type: string }> {
  const result: Array<{ type: string }> = [];
  if (!passengers) return [{ type: 'adult' }];
  const { adults = 1, children = 0, infants = 0 } = passengers;
  for (let i = 0; i < adults; i++) result.push({ type: 'adult' });
  for (let i = 0; i < children; i++) result.push({ type: 'child' });
  for (let i = 0; i < infants; i++) result.push({ type: 'infant_without_seat' });
  return result.length > 0 ? result : [{ type: 'adult' }];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
      departure_date,
      return_date,
      passengers,
      cabin_class,
      loyalty_accounts,
      corporate_codes,
      currency
    } = body || {};

    if (!origin || !destination || !departure_date) {
      return NextResponse.json(
        { error: 'origin, destination y departure_date son obligatorios' },
        { status: 400 }
      );
    }

    const slices: Array<{ origin: string; destination: string; departure_date: string }> = [
      { origin, destination, departure_date }
    ];
    if (return_date) {
      slices.push({ origin: destination, destination: origin, departure_date: return_date });
    }

    const duffel = getDuffelClient();

    const requestPayload: any = {
      slices,
      passengers: buildPassengerArray(passengers),
      private_fares: {},
      return_offers: true,
    };

    if (cabin_class) requestPayload.cabin_class = cabin_class;
    if (currency) requestPayload.currency = currency;

    if (Array.isArray(loyalty_accounts) && loyalty_accounts.length > 0) {
      requestPayload.private_fares.loyalty_programme_accounts = loyalty_accounts;
    }

    if (Array.isArray(corporate_codes) && corporate_codes.length > 0) {
      requestPayload.private_fares.corporate = { codes: corporate_codes };
    }

    const offerRequest = await (duffel as any).offerRequests.create(requestPayload);
    const offers = offerRequest?.data?.offers || [];

    return NextResponse.json({ data: offers, offer_request_id: offerRequest?.data?.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}