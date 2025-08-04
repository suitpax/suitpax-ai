import { NextRequest, NextResponse } from "next/server";
import { fetchAircraftById } from "../service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const aircraft = await fetchAircraftById(params.id);
    return NextResponse.json(aircraft);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
