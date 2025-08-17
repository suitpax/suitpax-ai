import { NextResponse } from 'next/server';
import { getDuffelClient } from '@/lib/duffel';

export async function GET(_request: Request, context: { params: { offerId: string } }) {
  try {
    const { offerId } = context.params;
    const duffel = getDuffelClient();
    const offer = await (duffel as any).offers.get(offerId);
    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}