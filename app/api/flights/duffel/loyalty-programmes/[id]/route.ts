import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const duffel = createDuffelClient();
    // @ts-ignore - SDK exposes loyaltyProgrammes resource
    const res = await (duffel as any).loyaltyProgrammes.get(params.id);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Loyalty programme fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty programme" }, { status: 500 });
  }
}