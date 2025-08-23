import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;
export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export const PLAN_CONFIGS = {
  free: {
    model: "claude-sonnet-4-20250514",
    maxTokensPerCall: 1000,     // Límite por respuesta
    monthlyTokens: 7500,        // Límite mensual
  },
  starter: {
    model: "claude-sonnet-4-20250514",
    maxTokensPerCall: 2000,
    monthlyTokens: 20000,
  },
  pro: {
    model: "claude-sonnet-4-20250514",
    maxTokensPerCall: 4000,
    monthlyTokens: 35000,
  },
  scale: {
    model: "claude-sonnet-4-20250514",
    maxTokensPerCall: 8000,
    monthlyTokens: 80000,
  },
  enterprise: {
    model: "claude-sonnet-4-20250514",
    maxTokensPerCall: 8000,
    monthlyTokens: null as number | null,        // Sin límite
  },
} as const;

export type UserPlan = keyof typeof PLAN_CONFIGS;

export async function generateAgentResponseByPlan(
  messages: ConversationMessage[],
  userPlan: UserPlan = "free",
  temperature: number = 0.7,
  systemPrompt?: string
): Promise<{ text: string; inputTokens?: number; outputTokens?: number; model: string }> {
  const config = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS['free'];
  const anthropic = getAnthropicClient();

  const response = await anthropic.messages.create({
    model: config.model,
    max_tokens: config.maxTokensPerCall,
    temperature,
    system: systemPrompt,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  });

  const responseBlock = (response as any).content?.[0];
  const text = responseBlock && responseBlock.type === "text" && typeof responseBlock.text === "string"
    ? responseBlock.text.trim()
    : "";

  const usage = (response as any).usage || {};

  return {
    text,
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    model: config.model,
  };
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

  const anthropic = getAnthropicClient();
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
