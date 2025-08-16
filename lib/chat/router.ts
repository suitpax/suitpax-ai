import { SUITPAX_AI_SYSTEM_PROMPT } from "@/lib/prompts/enhanced-system"
import { buildSystemPrompt, buildReasoningInstruction, buildToolContext } from "@/lib/prompts/system"
import { generateAgentResponseByPlan, toAnthropicMessages, type ConversationMessage, type UserPlan } from "@/lib/anthropic"
import { SUITPAX_CODE_SYSTEM_PROMPT } from "@/lib/prompts/code"

export type ChatIntent = "flight_search" | "code_generation" | "document_processing" | "expense_analysis" | "general"

export interface ChatRouterInput {
  message: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
  userId?: string
  includeReasoning?: boolean
  userPlan?: UserPlan
  baseUrl?: string
}

export interface ChatRouterOutput {
  text: string
  reasoning?: string
  toolUsed?: ChatIntent | undefined
  toolData?: any
  tokenUsage?: { inputTokens?: number; outputTokens?: number; total?: number }
  model: string
}

export function detectIntent(message: string): ChatIntent {
  const isFlight = /\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i.test(message) ||
    /\b(flight|flights|vuelo|vuelos|fly|flying|book|search)\b/i.test(message) ||
    /\b(madrid|barcelona|london|paris|new york|tokyo|dubai)\b.*\b(to|from)\b/i.test(message)

  const isCode = /\b(code|coding|program|programming|script|function|class|algorithm)\b/i.test(message) ||
    /\b(javascript|python|typescript|react|node|html|css|sql|java|go|rust|swift|kotlin|php|ruby|.net|spring)\b/i.test(message) ||
    /\b(create|build|generate|write).*\b(app|website|function|component|api)\b/i.test(message)

  const isDoc = /\b(pdf|document|report|analyze|extract|ocr|scan)\b/i.test(message) ||
    /\b(generate|create).*\b(report|document|pdf|invoice)\b/i.test(message)

  const isExpense = /\b(expense|expenses|cost|costs|spending|budget|financial)\b/i.test(message) ||
    /\b(analyze|review).*\b(expenses|costs|spending)\b/i.test(message)

  if (isFlight) return "flight_search"
  if (isCode) return "code_generation"
  if (isDoc) return "document_processing"
  if (isExpense) return "expense_analysis"
  return "general"
}

async function callTool(intent: ChatIntent, message: string, baseUrl: string, userId?: string) {
  const urlBase = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  try {
    if (intent === "flight_search") {
      const res = await fetch(`${urlBase}/api/ai-chat/tools/flight-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message }),
      })
      if (res.ok) return await res.json()
    } else if (intent === "code_generation") {
      const res = await fetch(`${urlBase}/api/ai-chat/tools/code-generator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message }),
      })
      if (res.ok) return await res.json()
    } else if (intent === "document_processing") {
      const res = await fetch(`${urlBase}/api/ai-chat/tools/document-processor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message }),
      })
      if (res.ok) return await res.json()
    } else if (intent === "expense_analysis") {
      const res = await fetch(`${urlBase}/api/ai-chat/tools/expense-analyzer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message, userId }),
      })
      if (res.ok) return await res.json()
    }
  } catch (e) {
    console.error("Tool call error:", e)
  }
  return null
}

function buildSystemForIntent(intent: ChatIntent): string {
  if (intent === "flight_search") return SUITPAX_AI_SYSTEM_PROMPT
  if (intent === "code_generation") return SUITPAX_CODE_SYSTEM_PROMPT
  return buildSystemPrompt({ domain: ["general", "travel", "coding", "business", "documents", "expenses"] })
}

export async function routeChat({ message, history = [], userId, includeReasoning = false, userPlan = "free", baseUrl }: ChatRouterInput): Promise<ChatRouterOutput> {
  const intent = detectIntent(message)

  const toolData = await callTool(intent, message, baseUrl || "", userId)
  const system = buildSystemForIntent(intent)

  let userMessage = message
  if (toolData?.success) {
    userMessage += buildToolContext(intent, toolData)
  }

  const messages: ConversationMessage[] = [...toAnthropicMessages(history), { role: "user", content: userMessage }]

  const result = await generateAgentResponseByPlan(messages, userPlan, 0.7, system)

  let reasoning: string | undefined
  if (includeReasoning) {
    const reasoningPrompt = toolData?.success
      ? `Explain the ${intent.replace("_", " ")} process and recommendations for this query: ${message}`
      : `Mensaje del usuario: ${message}\n\nRespuesta: ${result.text}\n\nExplica en 3–5 puntos el razonamiento de alto nivel.`

    const r = await generateAgentResponseByPlan([{ role: "user", content: reasoningPrompt }], "free", 0.2, buildReasoningInstruction("es"))
    reasoning = r.text?.trim()
  }

  const inputTokens = result.inputTokens || 0
  const outputTokens = result.outputTokens || Math.ceil(result.text.length / 4)

  return {
    text: result.text,
    reasoning,
    toolUsed: toolData?.success ? intent : undefined,
    toolData: toolData?.success ? toolData : undefined,
    tokenUsage: { inputTokens, outputTokens, total: inputTokens + outputTokens },
    model: result.model,
  }
}