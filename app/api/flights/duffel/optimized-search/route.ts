import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const slices: any[] = []
    const origin = (body?.origin || '').toUpperCase()
    const destination = (body?.destination || '').toUpperCase()
    const departure_date = body?.departure_date
    const return_date = body?.return_date
    const adults = Number(body?.passengers?.adults || 1)
    const cabin_class = body?.cabin_class || 'economy'
    const max_connections = body?.max_connections

    if (!origin || !destination || !departure_date) {
      return NextResponse.json({ error: 'Missing required fields: origin, destination, departure_date' }, { status: 400 })
    }

    slices.push({ origin, destination, departure_date })
    if (return_date) slices.push({ origin: destination, destination: origin, departure_date: return_date })

    const reqBody = {
      data: {
        slices,
        passengers: Array.from({ length: adults }).map(() => ({ type: 'adult' })),
        cabin_class,
        ...(typeof max_connections === 'number' ? { max_connections } : {}),
      },
    }

    const resp = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',
      },
      body: JSON.stringify(reqBody),
      cache: 'no-store',
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error' }, { status: resp.status })
    }

    const json = await resp.json()
    const data = json?.data || json
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import { getDuffelClient } from '@/lib/duffel';
import { enrichOffersWithAirlineInfo } from '@/lib/duffel-enrichment';
import { enrichOffersWithAircraftInfo } from '@/lib/duffel-aircraft';

export const runtime = 'nodejs'

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
      max_connections,
      sort,
      max_results,
      currency,
      slices: inputSlices
    } = body || {};

    // Build slices: accept multi-city via body.slices, else fallback to origin/destination
    let slices: Array<{ origin: string; destination: string; departure_date: string }> = []
    if (Array.isArray(inputSlices) && inputSlices.length > 0) {
      slices = inputSlices
        .filter((s: any) => s?.origin && s?.destination && s?.departure_date)
        .map((s: any) => ({
          origin: String(s.origin).toUpperCase(),
          destination: String(s.destination).toUpperCase(),
          departure_date: String(s.departure_date),
        }))
    } else {
      if (!origin || !destination || !departure_date) {
        return NextResponse.json(
          { error: 'origin, destination y departure_date son obligatorios' },
          { status: 400 }
        );
      }
      slices = [
        { origin, destination, departure_date }
      ];
      if (return_date) {
        slices.push({ origin: destination, destination: origin, departure_date: return_date });
      }
    }

    const duffel = getDuffelClient();

    const requestPayload: any = {
      slices,
      passengers: buildPassengerArray(passengers),
      return_offers: false,
    };

    if (cabin_class) requestPayload.cabin_class = cabin_class;
    if (typeof max_connections === 'number') requestPayload.max_connections = max_connections;
    if (sort) requestPayload.sort = sort;
    if (currency) requestPayload.currency = currency;

    const offerRequest = await (duffel as any).offerRequests.create(requestPayload);
    const offer_request_id = offerRequest?.data?.id;

    const listParams: any = { offer_request_id };
    if (typeof max_results === 'number') listParams.limit = max_results;

    // Polling loop to wait for offers to be ready
    let list = await (duffel as any).offers.list(listParams);
    let offers = list?.data || list?.offers || [];
    let meta = list?.meta || {};
    let attempts = 0;

    while (offers.length === 0 && attempts < 8) {
      await new Promise((r) => setTimeout(r, 800));
      list = await (duffel as any).offers.list(listParams);
      offers = list?.data || list?.offers || [];
      meta = list?.meta || {};
      attempts += 1;
    }

    const withAirlines = await enrichOffersWithAirlineInfo(offers)
    const withAircraft = await enrichOffersWithAircraftInfo(withAirlines)

    return NextResponse.json({ data: withAircraft, offer_request_id, meta });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}