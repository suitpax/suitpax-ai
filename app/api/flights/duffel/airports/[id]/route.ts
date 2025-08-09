import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const duffel = createDuffelClient();
    const res = await duffel.airports.get(params.id);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Airport fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch airport" }, { status: 500 });
  }
}