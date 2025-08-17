import { NextResponse } from 'next/server';
import { getAirportsHandler } from './controller';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const after = searchParams.get('after') || undefined;
    const before = searchParams.get('before') || undefined;
    const query = searchParams.get('query') || undefined;

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const result = await getAirportsHandler({ limit, after, before, query });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}