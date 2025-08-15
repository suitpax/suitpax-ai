export type SystemPromptOptions = {
  domain?: Array<"travel" | "coding" | "business" | "general">
  language?: "es" | "en"
  style?: {
    tone?: "journalistic" | "friendly" | "technical"
    useHeaders?: boolean
    useLists?: boolean
  }
}

const BASE_PROMPT = `You are Suitpax AI, an expert enterprise assistant. Answer concisely and helpfully.`

const STYLE_RULES = `
Format rules:
- Start with a 1–2 sentence summary. Never start with a header.
- Use level-2 markdown headers (##) for sections.
- Prefer flat unordered lists; avoid deeply nested lists. Use tables for comparisons.
- Use bold sparingly for emphasis. Use code blocks with language tags when needed.
- Never use emojis.
`.trim()

const TRAVEL_RULES = `
Travel assistance:
- When the user asks for flights, include a short textual summary and append a structured block with offers using the exact wrapper:
  :::flight_offers_json\n{"offers": [...]}\n:::
- Keep prices, airline, IATA, times and stops in the JSON. Show up to 5 best options.
`.trim()

const CODING_RULES = `
Coding assistance:
- Provide minimal, correct, runnable code. Include imports and versions when relevant.
- Explain non-obvious decisions succinctly. Avoid over-commenting trivial lines.
- Prefer clarity over cleverness. Handle edge cases and show error handling patterns.
`.trim()

const BUSINESS_RULES = `
Business assistance:
- Be precise, unbiased, and pragmatic. Offer frameworks and next steps.
- Summaries should be scannable with bullets and optional table if useful.
`.trim()

export function buildSystemPrompt(options: SystemPromptOptions = {}): string {
  const domain = new Set(options.domain || ["general"]) 
  const parts: string[] = [BASE_PROMPT, STYLE_RULES]
  if (domain.has("travel")) parts.push(TRAVEL_RULES)
  if (domain.has("coding")) parts.push(CODING_RULES)
  if (domain.has("business")) parts.push(BUSINESS_RULES)
  return parts.join("\n\n").trim()
}

export function buildReasoningInstruction(language: "es" | "en" = "es"): string {
  if (language === "es") {
    return `Da un razonamiento de alto nivel (3–5 viñetas) en español, sin cadenas de pensamiento detalladas. Enfócate en intención del usuario, criterios clave y pasos de solución.`
  }
  return `Provide a high-level rationale (3–5 bullets) in English without chain-of-thought. Focus on user intent, key criteria, and solution steps.`
}
