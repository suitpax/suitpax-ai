import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function GET(req: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 50;
    const after = url.searchParams.get("after") || undefined;
    const before = url.searchParams.get("before") || undefined;
    const airline_iata_code = url.searchParams.get("airline_iata_code") || undefined;

    const params: any = { limit };
    if (after) params.after = after;
    if (before) params.before = before;
    if (airline_iata_code) params.airline_iata_code = airline_iata_code;

    // @ts-ignore - SDK exposes loyaltyProgrammes resource
    const response = await (duffel as any).loyaltyProgrammes.list(params);

    return NextResponse.json({ success: true, data: response.data, meta: response.meta });
  } catch (error: any) {
    console.error("Loyalty programmes fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty programmes" }, { status: 500 });
  }
}