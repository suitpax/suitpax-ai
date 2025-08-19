import { PREDICTIVE_INTENTS } from "@/data/predictive-intents"

function normalize(text: string): string {
  try {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  } catch {
    return text.toLowerCase()
  }
}

export interface ResolvedDestination {
  city: string
  iataCity?: string
  airport?: string
  confidence: number
  intentId?: string
}

export function resolveTravelIntent(query: string): ResolvedDestination[] {
  const q = normalize(query)
  const matches = PREDICTIVE_INTENTS
    .map((intent) => {
      const anyKeyword = intent.keywords.some((kw) => q.includes(normalize(kw)))
      if (!anyKeyword) return null
      const airport = intent.destination.airports?.[0]
      return {
        city: intent.destination.city,
        iataCity: intent.destination.iataCity,
        airport,
        confidence: intent.weight ?? 0.7,
        intentId: intent.id,
      } as ResolvedDestination
    })
    .filter(Boolean) as ResolvedDestination[]

  // If user mentions an IATA code inside text, boost that city deterministically
  const iataMatch = /\b([A-Za-z]{3})\b/.exec(query)
  if (iataMatch) {
    const code = iataMatch[1].toUpperCase()
    const direct: ResolvedDestination = { city: code, iataCity: code, airport: code, confidence: 0.99, intentId: 'explicit-iata' }
    matches.unshift(direct)
  }

  // Deduplicate by city keeping highest confidence
  const byCity = new Map<string, ResolvedDestination>()
  for (const m of matches) {
    const key = m.iataCity || m.city
    const prev = byCity.get(key)
    if (!prev || m.confidence > prev.confidence) byCity.set(key, m)
  }

  const list = Array.from(byCity.values()).sort((a, b) => b.confidence - a.confidence)
  return list.slice(0, 3)
}

export function pickBestDestination(query: string): ResolvedDestination | null {
  const list = resolveTravelIntent(query)
  return list[0] || null
}

