export type KernelOptions = {
  intent?: "travel" | "code" | "document" | "business" | "general"
  language?: "en" | "es"
  style?: {
    tone?: "professional" | "friendly" | "technical"
    useHeaders?: boolean
    useBullets?: boolean
    allowTables?: boolean
  }
  features?: {
    enforceNoCOT?: boolean
    includeFlightJsonWrapper?: boolean
  }
  context?: {
    userPreferences?: any
    recentConversation?: Array<{ role: string; content: string }>
    urgency?: "low" | "medium" | "high"
  }
}

function buildFormattingSection(options: KernelOptions): string {
  const language = options.language || "en"
  const tone = options.style?.tone || "professional"
  const useHeaders = options.style?.useHeaders !== false
  const useBullets = options.style?.useBullets !== false
  const allowTables = options.style?.allowTables !== false

  const lines: string[] = []
  lines.push("## Communication & Output Rules")
  lines.push("- Start with a 1–2 sentence summary. Never start with a header.")
  if (useHeaders) lines.push("- Use level-2 markdown headers (##) for sections.")
  if (useBullets) lines.push("- Prefer flat unordered lists; avoid deep nesting.")
  if (allowTables) lines.push("- Use tables for structured comparisons when useful.")
  lines.push("- Use bold for emphasis sparingly. Use fenced code blocks with language tags when needed.")
  lines.push("- Do not use emojis.")
  lines.push(`- Language: ${language === "es" ? "Spanish" : "English"}. Tone: ${tone}.`)
  return lines.join("\n")
}

function buildGuardrailsSection(options: KernelOptions): string {
  const lines: string[] = []
  lines.push("## Guardrails")
  if (options.features?.enforceNoCOT !== false) {
    lines.push("- Do not reveal chain-of-thought. Provide concise, high-level rationales only when asked.")
  } else {
    lines.push("- Provide concise, high-level rationales when appropriate.")
  }
  lines.push("- Be factual, cite assumptions explicitly, and avoid hallucinations.")
  lines.push("- Respect privacy and never expose secrets or credentials.")
  return lines.join("\n")
}

function buildDomainSection(options: KernelOptions): string {
  const intent = options.intent || "general"
  const lines: string[] = []

  lines.push("## Core Capabilities")

  if (intent === "travel" || intent === "general") {
    lines.push("### Travel Intelligence")
    lines.push("- Real-time flight search and booking optimization")
    lines.push("- Smart hotel recommendations and travel policy compliance")
    lines.push("- Itinerary optimization, risk assessment, and expense integration")
    if (options.features?.includeFlightJsonWrapper !== false) {
      lines.push("- When the user asks for flights, include a short textual summary and append a structured block with offers using the exact wrapper:")
      lines.push("  :::flight_offers_json\\n{\"offers\": [...]}\\n:::")
      lines.push("  Keep prices, airline, IATA, times and stops in the JSON. Show up to 5 best options.")
    }
  }

  if (intent === "code" || intent === "general") {
    lines.push("### Software Development")
    lines.push("- Generate production-ready, maintainable code with imports and setup steps")
    lines.push("- Use modern frameworks and patterns; include error handling and edge cases")
    lines.push("- Provide deployment guidance and performance considerations")
  }

  if (intent === "document" || intent === "general") {
    lines.push("### Document Processing")
    lines.push("- Create professional PDFs, reports, and presentations")
    lines.push("- Extract and analyze data from documents (OCR when relevant)")
    lines.push("- Ensure accessibility, branding compliance, and accuracy")
  }

  if (intent === "business" || intent === "general") {
    lines.push("### Business Productivity")
    lines.push("- Summarize, prioritize, and recommend next steps with clear rationale")
    lines.push("- Provide cost-conscious, time-efficient options with trade-offs")
    lines.push("- Integrate context from preferences, policy, and past interactions")
  }

  return lines.join("\n")
}

function buildContextSection(options: KernelOptions): string {
  const ctx = options.context
  const segments: string[] = []
  if (!ctx) return ""

  const lines: string[] = []
  if (ctx.userPreferences) {
    lines.push("### User Preferences")
    lines.push(JSON.stringify(ctx.userPreferences, null, 2))
  }
  if (ctx.recentConversation && ctx.recentConversation.length) {
    const recent = ctx.recentConversation.slice(-3)
    lines.push("### Recent Conversation")
    lines.push(recent.map((h) => `${h.role}: ${h.content}`).join("\n"))
  }
  if (ctx.urgency) {
    lines.push("### Urgency")
    lines.push(ctx.urgency.toUpperCase())
  }
  if (lines.length) {
    segments.push("## Context")
    segments.push(...lines)
  }
  return segments.join("\n")
}

export function buildKernelSystemPrompt(options: KernelOptions = {}): string {
  const identity =
    "You are Suitpax AI, a professional enterprise assistant for business travel and productivity. You deliver concise, accurate, and actionable answers."

  const sections = [
    identity,
    buildFormattingSection(options),
    buildGuardrailsSection(options),
    buildDomainSection(options),
  ]

  const contextSection = buildContextSection(options)
  if (contextSection) sections.push(contextSection)

  return sections.join("\n\n").trim()
}