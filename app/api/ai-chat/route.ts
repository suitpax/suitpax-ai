import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { Duffel } from "@duffel/api";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
});

const systemPrompt = `
You are Suitpax AI, a world-class autonomous travel agent. Your purpose is to assist users with their business travel needs by leveraging available tools.

Core Persona:
- Professional, efficient, and highly capable.
- Detect and respond in the user's language.
- Follow strict data privacy and avoid inventing facts.

Tool Usage Protocol:
1. Analyze the user's request and identify intent.
2. Check available tools. You have a tool called search_flights.
3. Extract parameters for flight search: origin, destination, departure_date, return_date (optional), passengers. If any are missing, ask the user for the missing info first.
4. Invoke the tool when parameters are complete. Use real-time flight data.
5. Synthesize and respond in clean Markdown (no emojis). Present the top 3 options using headings and a table.

Example Flight Card Format (no emojis):
\`\`\`markdown
### [Airline Name] — [Origin IATA] → [Destination IATA]

| Feature        | Details                                     |
| -------------- | ------------------------------------------- |
| Price          | $[Total Amount] [Currency]                  |
| Duration       | [Total Duration]                            |
| Stops          | [Number of stops]                           |
| Departure      | [Departure Time] at [Origin Airport]        |
| Arrival        | [Arrival Time] at [Destination Airport]     |
\`\`\`

If the user's request is not about flights, answer as a business travel assistant.
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
        passengers: { type: "array", items: { type: "object", properties: { type: { type: "string", enum: ["adult", "child", "infant"] } } }, description: "An array of passenger types." },
      },
      required: ["origin", "destination", "departure_date", "passengers"],
    },
  },
];

async function flightSearchTool(origin: string, destination: string, departure_date: string, return_date?: string, passengers?: any[]) {
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
    return offers.data.slice(0, 3); // Return top 3 offers
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
    // First call to Anthropic to see if a tool should be used
    const initialResponse = await anthropic.messages.create({
      model: "claude-3-opus-20240229", // Opus is best for tool use
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
      tools: tools,
      tool_choice: { type: "auto" },
    });

    const stopReason = initialResponse.stop_reason;
    const toolUseContent = initialResponse.content.find(c => c.type === 'tool_use');

    // Helper to optionally compute a concise reasoning summary in ES
    async function getReasoningSummary(context: { userMessage: string; finalText: string; toolData?: any }) {
      if (!includeReasoning) return null;
      const summary = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 400,
        system: "Eres un asistente que genera un breve resumen del razonamiento (3-5 viñetas) en español, sin revelar cadenas de pensamiento detalladas ni pasos internos. Sé claro, de alto nivel y útil.",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Solicitud del usuario: ${context.userMessage}` },
              { type: "text", text: `Respuesta final proposée: ${context.finalText}` },
              ...(context.toolData ? [{ type: "text", text: `Datos de herramientas (resumen): ${typeof context.toolData === 'string' ? context.toolData : JSON.stringify(context.toolData).slice(0, 4000)}` }] : []),
              { type: "text", text: "Redacta un resumen del razonamiento de alto nivel (máx 80-120 palabras o 3-5 bullets)." }
            ]
          }
        ]
      });
      const reasoningText = summary.content.find(c => c.type === 'text')?.text?.trim() || null;
      return reasoningText;
    }

    if (stopReason === 'tool_use' && toolUseContent && toolUseContent.type === 'tool_use') {
      const { name, input } = toolUseContent as any;
      if (name === 'search_flights') {
        const { origin, destination, departure_date, return_date, passengers } = input as any;
        const flightData = await flightSearchTool(origin, destination, departure_date, return_date, passengers);

        const finalResponse = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229", // Sonnet is fine for summarizing
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            { role: "user", content: message },
            {
              role: "assistant",
              content: [
                { type: "tool_use", id: (toolUseContent as any).id, name: (toolUseContent as any).name, input: (toolUseContent as any).input }
              ]
            },
            {
              role: "user",
              content: [
                { type: "tool_result", tool_use_id: (toolUseContent as any).id, content: JSON.stringify(flightData) }
              ]
            }
          ],
        });

        const finalText = finalResponse.content.find(c => c.type === 'text')?.text || "";
        const reasoning = await getReasoningSummary({ userMessage: message, finalText, toolData: flightData });
        return NextResponse.json({ response: finalText, reasoning: reasoning || undefined });
      }
    }

    // If no tool is used, return the standard text response
    const textResponse = initialResponse.content.find(c => c.type === 'text')?.text || "I'm sorry, I couldn't process that request.";
    const reasoning = await getReasoningSummary({ userMessage: message, finalText: textResponse });
    return NextResponse.json({ response: textResponse, reasoning: reasoning || undefined });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "I'm experiencing technical difficulties." }, { status: 500 });
  }
}
