import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

export async function POST(req: NextRequest) {
  const duffel = new Duffel({
    token: process.env.DUFFEL_API_KEY_STAYS || process.env.DUFFEL_API_KEY || ""
  });
  try {
    const searchParams = await req.json();
    const response = await duffel.stays.search(searchParams);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Error searching stays", details: error.message },
      { status: 500 }
    );
  }
}
