import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function GET(req: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 15;

    if (!query || query.length < 2) {
      return NextResponse.json({ success: false, error: "Query 'q' must be at least 2 characters" }, { status: 400 });
    }

    // Fetch airports and cities in parallel matching the query
    const [airportsRes, citiesRes] = await Promise.all([
      duffel.airports.list({ limit: Math.max(limit, 20), name: query }),
      duffel.cities.list({ limit: Math.max(limit, 20), name: query })
    ]);

    // Normalize and merge results
    const airportItems = (airportsRes.data || []).map((a: any) => ({
      id: a.id,
      type: "airport",
      iata_code: a.iata_code,
      name: a.name,
      city_name: a.city?.name,
      country_name: a.country?.name,
      latitude: a.latitude,
      longitude: a.longitude
    }));

    const cityItems = (citiesRes.data || []).map((c: any) => ({
      id: c.id,
      type: "city",
      iata_code: c.iata_code,
      name: c.name,
      country_name: c.country?.name
    }));

    // De-duplicate by id and take top 'limit'
    const merged = [...airportItems, ...cityItems].filter((item, idx, self) => idx === self.findIndex(i => i.id === item.id));

    // Basic scoring: prioritize exact IATA and name contains
    const q = query.toLowerCase();
    const scored = merged.map(item => {
      let score = 0;
      if (item.iata_code && item.iata_code.toLowerCase() === q) score += 100;
      if (item.name && item.name.toLowerCase() === q) score += 80;
      if (item.name && item.name.toLowerCase().includes(q)) score += 40;
      if (item.city_name && item.city_name.toLowerCase().includes(q)) score += 20;
      return { ...item, score };
    }).sort((a, b) => b.score - a.score);

    return NextResponse.json({ success: true, places: scored.slice(0, limit) });
  } catch (error: any) {
    console.error("Places suggestions error:", error)
    return NextResponse.json({ error: "Failed to fetch place suggestions" }, { status: 500 })
  }
}
