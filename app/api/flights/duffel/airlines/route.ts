import { NextRequest, NextResponse } from 'next/server'
import { createDuffelClient } from '@/lib/duffel'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    const duffel = createDuffelClient();
    const airlines = await duffel.airlines.list({ limit })
    
    const transformedData = airlines.data.map((airline: any) => ({
      id: airline.id,
      iata_code: airline.iata_code,
      icao_code: airline.icao_code,
      name: airline.name,
      logo_lockup_url: airline.logo_lockup_url,
      logo_symbol_url: airline.logo_symbol_url,
    }))

    return NextResponse.json({
      success: true,
      data: transformedData,
      meta: airlines.meta
    })

  } catch (error) {
    console.error('Airlines fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch airlines' },
      { status: 500 }
    )
  }
}
