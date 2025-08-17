import { NextResponse } from 'next/server';
import { getDuffelClient } from '@/lib/duffel';

export async function GET(_request: Request, context: { params: { orderId: string } }) {
  try {
    const { orderId } = context.params;
    const duffel = getDuffelClient();
    const order = await duffel.orders.get(orderId as any);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}