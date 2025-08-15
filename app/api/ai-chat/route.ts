export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { Duffel } from "@duffel/api";
import { SUITPAX_AI_SYSTEM_PROMPT } from "@/lib/prompts/enhanced-system";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
});

const systemPrompt = `
${SUITPAX_AI_SYSTEM_PROMPT}

## Formatting & Travel Output Rules
- Detect the user's language and respond accordingly (default to concise Spanish if unclear).
- Use clean Markdown. No emojis.
- When the user asks for flights, present a short textual summary and a compact comparison (bullets or a small table). Then ALWAYS append a structured block containing the normalized offers using this exact wrapper so the UI can render rich cards:

:::flight_offers_json
{"offers": [{"id":"...","price":"...","airline":"...","airline_iata":"...","logo":"...","depart":"ISO","arrive":"ISO","origin":"IATA","destination":"IATA","stops":0}]}
:::

- Only include up to 5 best options in the JSON. Prices, airline, IATA codes, times, and stops must be accurate from real-time data.
`.trim();

const tools: Anthropic.Tool[] = [
  {
    name: "search_flights",
    description: "Searches for real-time flight offers based on user criteria.",
    input_schema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "The IATA code of the origin city, e.g., 'JFK'." },
        destination: { type: "string", description: "The IATA code of the destination city, e.g., 'LHR'." },
        departure_date: { type: "string", description: "The departure date in YYYY-MM-DD format." },
        return_date: { type: "string", description: "The return date in YYYY-MM-DD format (optional for one-way)." },
        passengers: { 
          type: "array", 
          items: { 
            type: "object", 
            properties: { type: { type: "string", enum: ["adult", "child", "infant"] } } 
          }, 
          description: "An array of passenger types." 
        },
      },
      required: ["origin", "destination", "departure_date", "passengers"],
    },
  },
];

function buildAirlineLogoUrl(iata?: string | null): string | null {
  if (!iata) return null;
  return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${iata}.svg`;
}

function normalizeFlightOffers(raw: any[]): Array<{
  id: string;
  price: string;
  airline?: string;
  airline_iata?: string;
  logo?: string | null;
  depart?: string;
  arrive?: string;
  origin?: string;
  destination?: string;
  stops?: number;
}> {
  try {
    return raw.slice(0, 5).map((o: any) => {
      const firstSlice = o?.slices?.[0];
      const lastSlice = o?.slices?.[o?.slices?.length - 1];
      const firstSeg = firstSlice?.segments?.[0];
      const lastSeg = lastSlice?.segments?.[lastSlice?.segments?.length - 1];

      const carrier = firstSeg?.marketing_carrier || firstSeg?.operating_carrier || {};
      const airlineName = carrier?.name || undefined;
      const airlineIata = carrier?.iata_code || carrier?.iata || undefined;

      const originIata = firstSeg?.origin?.iata_code || firstSlice?.origin?.iata_code || firstSeg?.origin?.iata || undefined;
      const destinationIata = lastSeg?.destination?.iata_code || lastSlice?.destination?.iata_code || lastSeg?.destination?.iata || undefined;

      const segmentsCount = (firstSlice?.segments?.length || 1);
      const stops = Math.max(0, segmentsCount - 1);

      return {
        id: o?.id,
        price: `${o?.total_amount || o?.total_amount?.toString() || ""} ${o?.total_currency || ""}`.trim(),
        airline: airlineName,
        airline_iata: airlineIata,
        logo: buildAirlineLogoUrl(airlineIata || null),
        depart: firstSeg?.departing_at || firstSlice?.departing_at,
        arrive: lastSeg?.arriving_at || lastSlice?.arriving_at,
        origin: originIata,
        destination: destinationIata,
        stops,
      };
    });
  } catch {
    return [];
  }
}

async function flightSearchTool(
  origin: string,
  destination: string,
  departure_date: string,
  return_date?: string,
  passengers?: any[]
) {
  try {
    const slices = [{ origin, destination, departure_date }];
    if (return_date) {
      slices.push({ origin: destination, destination: origin, departure_date: return_date });
    }

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: passengers || [{ type: "adult" }],
      cabin_class: "economy",
    });

    const offers = await duffel.offers.list({ offer_request_id: offerRequest.id });
    return offers.data.slice(0, 5);
  } catch (error) {
    console.error("Duffel API Error:", error);
    return { error: "Failed to retrieve flight information from our provider." };
  }
}

export async function POST(request: NextRequest) {
  const { message, history = [], includeReasoning = false } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const conversationHistory = history.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const initialResponse = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
      tools: tools,
      tool_choice: { type: "auto" },
    });

    const stopReason = (initialResponse as any).stop_reason;
    const toolUseContent = (initialResponse as any).content.find((c: any) => c.type === "tool_use");

    let reasoningText: string | undefined;

    if (stopReason === "tool_use" && toolUseContent && toolUseContent.type === "tool_use") {
      const { name, input } = toolUseContent;
      if (name === "search_flights") {
        const { origin, destination, departure_date, return_date, passengers } = input as any;
        const flightData = await flightSearchTool(origin, destination, departure_date, return_date, passengers);

        const finalResponse = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            { role: "user", content: message },
            { role: "assistant", content: [ { type: "tool_use", id: toolUseContent.id, name: toolUseContent.name, input: toolUseContent.input } ] },
            { role: "user", content: [ { type: "tool_result", tool_use_id: toolUseContent.id, content: JSON.stringify(flightData) } ] }
          ],
        });

        const text = (finalResponse as any).content?.find((c: any) => c.type === "text")?.text || "";
        const normalized = Array.isArray(flightData) ? normalizeFlightOffers(flightData) : [];
        const offersBlock = `:::flight_offers_json\n${JSON.stringify({ offers: normalized }, null, 2)}\n:::`;

        if (includeReasoning) {
          try {
            const r = await anthropic.messages.create({
              model: "claude-3-haiku-20240307",
              max_tokens: 512,
              system: "You are Suitpax AI. Provide a brief high-level rationale (3–5 bullets) in Spanish without chain-of-thought.",
              messages: [ { role: "user", content: `Explica en 3–5 viñetas el razonamiento de alto nivel para esta solicitud: ${message}` } ],
            });
            reasoningText = (r as any).content?.find((c: any) => c.type === "text")?.text || undefined;
          } catch {}
        }

        return NextResponse.json({ response: `${text}\n\n${offersBlock}`, reasoning: reasoningText });
      }
    }

    const textResponse = (initialResponse as any).content?.find((c: any) => c.type === "text")?.text || 
      "I'm sorry, I couldn't process that request.";

    if (includeReasoning) {
      try {
        const r = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 512,
          system: "You are Suitpax AI. Provide a brief high-level rationale (3–5 bullets) in Spanish without chain-of-thought.",
          messages: [ { role: "user", content: `Explica en 3–5 viñetas el razonamiento de alto nivel para esta solicitud: ${message}` } ],
        });
        reasoningText = (r as any).content?.find((c: any) => c.type === "text")?.text || undefined;
      } catch {}
    }

    return NextResponse.json({ response: textResponse, reasoning: reasoningText });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "I'm experiencing technical difficulties." }, { status: 500 });
  }
}
