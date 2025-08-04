import { NextRequest, NextResponse } from 'next/server';
import { getAirlineByIdHandler } from '../controller';

// Maneja GET /api/flights/duffel/airlines/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const airline = await getAirlineByIdHandler({ id: params.id });
    return NextResponse.json(airline);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
