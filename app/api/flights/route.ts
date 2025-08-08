import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const params = await req.json();

  try {
    // Usar fetch interno para llamar al endpoint de Duffel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const duffelResponse = await fetch(`${baseUrl}/api/flights/duffel/flight-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const duffelData = await duffelResponse.json();
    
    return NextResponse.json({
      success: true,
      offers: duffelData.offers || [],
      providers: ['duffel'],
      total_offers: duffelData.offers?.length || 0
    });

  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to search flights",
      offers: []
    }, { status: 500 });
  }
}