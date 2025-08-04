import { NextRequest, NextResponse } from "next/server";
import { fetchAircraft } from "./service";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
  const after = searchParams.get("after") || undefined;
  const before = searchParams.get("before") || undefined;

  try {
    const response = await fetchAircraft(limit, after, before);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
