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
    model: "claude-3-7-sonnet-latest",     // modelo más reciente para Free
    maxTokens: 500,
    monthlyTokens: 5_000,
  },
  pro: {
    model: "claude-sonnet-4-20250514",     // modelo avazando para Pro
    maxTokens: 1_200,
    monthlyTokens: 25_000,
  },
  enterprise: {
    model: "claude-opus-4-20250514",       // el modelo top para Enterprise
    maxTokens: 2_048,
    monthlyTokens: undefined,
  }
};

export type UserPlan = keyof typeof PLAN_CONFIGS;

export async function generateAgentResponseByPlan(
  messages: ConversationMessage[],
  userPlan: UserPlan = "free",
  temperature: number = 0.7
): Promise<string> {
  const config = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS["free"];
  try {
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });
    return response.content;
  } catch (error) {
    console.error("Error generating agent response:", error);
    throw error;
  }
}
