import { NextResponse } from 'next/server';
import { getAirportByIdHandler } from '../controller';

export async function GET(_request: Request, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    const result = await getAirportByIdHandler({ id });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}