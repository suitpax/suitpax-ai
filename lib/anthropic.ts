import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

const anthropic = new Anthropic({ apiKey });

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// Configuración según tu pricing y criterio de modelos
const PLAN_CONFIGS = {
  free: {
    model: "claude-3-7-sonnet-20250219",
    maxTokens: 1024,
    monthlyTokens: 5_000,
  },
  basic: {
    model: "claude-3-7-sonnet-20250219",
    maxTokens: 2048,
    monthlyTokens: 15_000,
  },
  pro: {
    model: "claude-3-7-sonnet-20250219",
    maxTokens: 4096,
    monthlyTokens: 25_000,
  },
  enterprise: {
    model: "claude-3-7-sonnet-20250219",
    maxTokens: 8192,
    monthlyTokens: undefined,
  }
};

export type UserPlan = keyof typeof PLAN_CONFIGS;

export async function generateAgentResponseByPlan(
  messages: ConversationMessage[],
  userPlan: UserPlan = "free",
  temperature: number = 0.7,
  systemPrompt?: string
): Promise<{ text: string; inputTokens?: number; outputTokens?: number; model: string }> {
  const config = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS["free"];
  try {
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });
    const text = (response as any).content?.find?.((c: any) => c.type === "text")?.text || "";
    const usage = (response as any).usage || {};
    return { text, inputTokens: usage.input_tokens, outputTokens: usage.output_tokens, model: config.model };
  } catch (error) {
    console.error("Error generating agent response:", error);
    throw error;
  }
}

export async function streamAgentResponse(
  messages: ConversationMessage[],
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
    system?: string
    onDelta?: (chunk: string) => void
  },
) {
  const model = options?.model || PLAN_CONFIGS.free.model
  const max_tokens = options?.maxTokens || PLAN_CONFIGS.free.maxTokens
  const temperature = options?.temperature ?? 0.7

  const res = await anthropic.messages.create({
    model,
    max_tokens,
    temperature,
    system: options?.system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })

  const text = (res as any).content?.find?.((c: any) => c.type === "text")?.text || ""
  if (options?.onDelta) options.onDelta(text)
  return { text, usage: (res as any).usage, model }
}

export function toAnthropicMessages(history: Array<{ role: string; content: string }>): ConversationMessage[] {
  return history.map((m) => ({ role: m.role as any, content: m.content }))
}
