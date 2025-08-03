import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: false,
        error: "Query must be at least 2 characters"
      })
    }

    const airports = await duffel.airports.list({
      limit: 10,
      name: query
    })

    return NextResponse.json({
      success: true,
      airports: airports.data
    })

  } catch (error) {
    console.error("Airports API Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch airports" 
      },
      { status: 500 }
    )
  }
}