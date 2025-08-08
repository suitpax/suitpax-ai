import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Función para generar el prompt de razonamiento
function createReasoningPrompt(message: string, context: string): string {
  return `
Please analyze the user's request and provide your reasoning process before your final response.

User message: "${message}"
Context: ${context}

First, show your thinking process in <Thinking> tags, analyzing:
1. What is the core intent of the user's request?
2. What key information is provided, and what is missing?
3. What is the best approach to provide a helpful, professional response as Suitpax AI?
4. How should the response be structured for maximum clarity (e.g., lists, tables)?

Then provide your main response.
`.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [], includeReasoning = false } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Sistema prompt base (tu prompt original)
    const baseSystemPrompt = `
You are Suitpax AI, a highly skilled and professional AI assistant specialized in business travel. You represent Suitpax, the leading business travel and expense management startup. Your responses must be clear, precise, and professional.

**Core Rules:**
- **Language:** Detect and respond in the user's language.
- **Tone:** Professional, clear, and brief. No emojis or asterisks. Use uppercase for emphasis only.
- **Scope:** Stick to topics of business travel, flights, hotels, expenses, and software engineering support for Suitpax. Politely decline unrelated requests.
- **Data:** Never invent travel or pricing data. Ask for clarification if essential information is missing.
- **Formatting:** Use Markdown for structure. Use vertical lists for options. Use tables for comparisons.

**Reasoning:**
If requested (includeReasoning=true), first present your step-by-step reasoning inside <Thinking> tags before providing the main answer.
`.trim();

    // Obtener usuario de Supabase
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Construir historial de conversación para contexto
    const conversationHistory = history
      .slice(-6)
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

    // Decidir el prompt basado en si se solicita razonamiento
    const finalUserMessage = includeReasoning ? createReasoningPrompt(message, context) : message;

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1500,
      temperature: 0.5,
      system: baseSystemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user", content: finalUserMessage },
      ],
    });

    let aiResponse = "";
    let reasoning = "";

    if (response.content[0]?.type === "text") {
      const fullResponse = response.content[0].text.trim();
      if (includeReasoning && fullResponse.includes('<Thinking>')) {
        const thinkingMatch = fullResponse.match(/<Thinking>([\s\S]*?)<\/Thinking>/);
        if (thinkingMatch) {
          reasoning = thinkingMatch[1].trim();
          aiResponse = fullResponse.replace(/<Thinking>[\s\S]*?<\/Thinking>/, '').trim();
        } else {
          aiResponse = fullResponse;
        }
      } else {
        aiResponse = fullResponse;
      }
    } else {
      aiResponse = "I apologize, but I couldn't process your request properly. Please try again.";
    }

    // Registrar interacción si el usuario está autenticado - CON NUEVAS COLUMNAS
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: message,
          response: aiResponse,
          context_type: context,
          tokens_used: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
          model_used: "claude-3-sonnet-20240229",
          reasoning_included: includeReasoning,
          reasoning_content: reasoning || null,
        });
      } catch (logError) {
        console.error("Failed to log chat interaction:", logError);
      }
    }

    return NextResponse.json({
      response: aiResponse,
      reasoning: reasoning || undefined,
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "I'm experiencing technical difficulties. Please try again in a moment." },
      { status: 500 }
    );
  }
}
