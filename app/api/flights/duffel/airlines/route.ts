import { NextRequest, NextResponse } from 'next/server';
import { getAirlinesHandler } from './controller';

// Maneja GET /api/flights/duffel/airlines
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
  const after = searchParams.get('after') || undefined;
  const before = searchParams.get('before') || undefined;

  try {
    const airlines = await getAirlinesHandler({ limit, after, before });
    return NextResponse.json(airlines);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
