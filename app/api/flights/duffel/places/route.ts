import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function GET(req: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const url = new URL(req.url);
    const query = (url.searchParams.get("query") || url.searchParams.get("q") || "").trim();
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 15;
    const typesParam = (url.searchParams.get("types") || "").trim();
    const types = typesParam ? typesParam.split(",").map((t) => t.trim().toLowerCase()) : undefined; // e.g. airport,city

    if (!query || query.length < 2) {
      return NextResponse.json({ success: false, error: "Query must be at least 2 characters" }, { status: 400 });
    }

    // Try official place suggestions if available in SDK
    let suggestions: any[] | null = null;
    try {
      const anyClient: any = duffel as any;
      const hasSuggestions = !!(anyClient?.places?.suggestions?.list || anyClient?.placeSuggestions?.list);
      if (hasSuggestions) {
        const listFn = anyClient?.places?.suggestions?.list || anyClient?.placeSuggestions?.list;
        const params: any = { query, limit: Math.max(limit, 20) };
        if (types && Array.isArray(types) && types.length > 0) params.types = types; // respects API if supported
        const res = await listFn(params);
        const data = res?.data || res || [];
        if (Array.isArray(data) && data.length > 0) {
          suggestions = data.map((p: any) => ({
            id: p.id,
            type: p.type,
            iata_code: p.iata_code,
            name: p.name,
            city_name: p.city?.name || p.city_name || "",
            country_name: p.city?.country_name || p.country_name || "",
            latitude: p.latitude,
            longitude: p.longitude,
          }));
        }
      }
    } catch (e) {
      suggestions = null;
    }

    // REST fallback if SDK does not expose place suggestions
    if (!suggestions && process.env.DUFFEL_API_KEY) {
      try {
        const resp = await fetch(`https://api.duffel.com/air/places/suggestions?query=${encodeURIComponent(query)}&limit=${Math.max(limit, 20)}`, {
          headers: {
            Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
            "Duffel-Version": "v2",
          },
          cache: 'no-store'
        })
        if (resp.ok) {
          const json: any = await resp.json()
          const data = json?.data || []
          if (Array.isArray(data) && data.length > 0) {
            suggestions = data.map((p: any) => ({
              id: p.id,
              type: p.type,
              iata_code: p.iata_code,
              name: p.name,
              city_name: p.city?.name || p.city_name || "",
              country_name: p.city?.country_name || p.country_name || "",
              latitude: p.latitude,
              longitude: p.longitude,
            }))
          }
        }
      } catch {}
    }

    if (suggestions) {
      // Basic scoring + prefer airports for 3-letter queries
      const q = query.toLowerCase();
      const isLikelyIata = q.length === 3 && /^[a-z]{3}$/i.test(q);
      const scored = suggestions.map((item) => {
        let score = 0;
        if (item.iata_code && item.iata_code.toLowerCase() === q) score += 120;
        if (item.name && item.name.toLowerCase() === q) score += 90;
        if (item.name && item.name.toLowerCase().includes(q)) score += 45;
        if (item.city_name && item.city_name.toLowerCase().includes(q)) score += 25;
        if (isLikelyIata && item.type === "airport") score += 20;
        if (types && types.length > 0 && !types.includes(item.type)) score -= 1000;
        return { ...item, score };
      }).sort((a, b) => b.score - a.score);

      return NextResponse.json({ success: true, places: scored.slice(0, limit) });
    }

    // If no suggestions, return empty
    return NextResponse.json({ success: true, places: [] })
  } catch (error: any) {
    console.error("Places suggestions error:", error)
    return NextResponse.json({ error: "Failed to fetch place suggestions" }, { status: 500 })
  }
}
