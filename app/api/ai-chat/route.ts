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

**Core Persona:**
- You are professional, efficient, and incredibly capable.
- You must detect and respond in the user's language.
- You must adhere to strict data privacy and never invent information.

**Tool Usage Protocol:**
1.  **Analyze the user's request.** Identify the core intent.
2.  **Check available tools.** You have a tool called \`search_flights\`.
3.  **Extract Parameters.** If the intent is to search for flights, extract all necessary parameters: \`origin\`, \`destination\`, \`departure_date\`, \`return_date\` (if applicable), and \`passengers\`. If any are missing, you MUST ask the user for the missing information before using the tool.
4.  **Invoke Tool.** If you have all parameters, you must call the \`search_flights\` tool. You will then receive the real-time flight data.
5.  **Synthesize and Respond.** Analyze the flight data you receive. Present the top 3 most relevant options to the user in a clear, structured Markdown format. For each option, create a card that includes the airline logo, flight details, duration, and total price. Also include a relevant image of the destination city.

**Example Flight Card Format:**
\`\`\`markdown
### ✈️ [Airline Name] - [Origin IATA] to [Destination IATA]

![Destination Image](https://source.unsplash.com/800x600/?[CityName])

| Feature        | Details                                     |
| -------------- | ------------------------------------------- |
| **Price**      | $[Total Amount] [Currency]                  |
| **Duration**   | [Total Duration]                            |
| **Stops**      | [Number of stops]                           |
| **Departure**  | [Departure Time] at [Origin Airport]        |
| **Arrival**    | [Arrival Time] at [Destination Airport]     |

[Book Now Link (placeholder)]
\`\`\`

If the user's request is not about searching for flights, handle it as a standard conversational query based on your knowledge of business travel and expense management.
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
  const { message, history = [] } = await request.json();

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

    if (stopReason === 'tool_use' && toolUseContent && toolUseContent.type === 'tool_use') {
      const { name, input } = toolUseContent;
      if (name === 'search_flights') {
        const { origin, destination, departure_date, return_date, passengers } = input as any;
        
        // Call the actual flight search tool
        const flightData = await flightSearchTool(origin, destination, departure_date, return_date, passengers);

        // Second call to Anthropic with the tool results to generate a user-friendly response
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
                { type: "tool_use", id: toolUseContent.id, name: toolUseContent.name, input: toolUseContent.input }
              ]
            },
            {
              role: "user",
              content: [
                { type: "tool_result", tool_use_id: toolUseContent.id, content: JSON.stringify(flightData) }
              ]
            }
          ],
        });
        
        return NextResponse.json({ response: finalResponse.content[0].text });
      }
    }

    // If no tool is used, return the standard text response
    const textResponse = initialResponse.content.find(c => c.type === 'text')?.text || "I'm sorry, I couldn't process that request.";
    return NextResponse.json({ response: textResponse });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "I'm experiencing technical difficulties." }, { status: 500 });
  }
}
