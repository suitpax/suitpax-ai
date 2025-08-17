import { NextResponse } from 'next/server';
import { getAirlinesHandler } from './controller';

export async function GET() {
  return new Response('Not Implemented', { status: 501 })
}