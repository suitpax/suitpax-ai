import type { IntentResult, FlightIntentData } from "./types"

const IATA_RE = /\b([A-Z]{3})\b/g
const CITY_RE = /\b([A-Za-z][A-Za-z\s]+)\b/g
const DATE_ISO_RE = /(\d{4}-\d{2}-\d{2})/
const DIRECT_RE = /\b(direct|nonstop|sin\s+escalas)\b/i
const PASSENGERS_RE = /\b(\d+)\s+(passengers?|people|personas)\b/i

export function detectIntent(text: string): IntentResult {
  const lower = text.toLowerCase()
  if (/\b(hi|hello|hola|hey)\b/.test(lower)) {
    return { type: "greeting", confidence: 0.7 }
  }
  if (/\b(flight|flights|vuelo|vuelos|book|search|buscar)\b/.test(lower)) {
    const data = parseFlightParams(text)
    return { type: "search_flights", confidence: 0.85, data }
  }
  if (/\b(cancel|parar|stop)\b/.test(lower)) return { type: "cancel", confidence: 0.6 }
  if (/\b(repeat|repite|again)\b/.test(lower)) return { type: "repeat", confidence: 0.6 }
  return { type: "unknown", confidence: 0.4 }
}

export function parseFlightParams(text: string): FlightIntentData {
  const params: FlightIntentData = {}

  const iatas = [...(text.match(IATA_RE) || [])]
  if (iatas.length >= 2) {
    params.origin = iatas[0]
    params.destination = iatas[1]
  }

  const date = text.match(DATE_ISO_RE)?.[1]
  if (date) params.date = date

  const direct = DIRECT_RE.test(text)
  if (direct) params.directOnly = true

  const paxMatch = text.match(PASSENGERS_RE)
  if (paxMatch) params.passengers = Number(paxMatch[1]) || 1

  // If IATA not present, try a naive city capture as fallback (best-effort)
  if (!params.origin || !params.destination) {
    const words = [...(text.match(CITY_RE) || [])]
      .map((w) => w.trim())
      .filter((w) => w.length > 2)
    if (words.length >= 2) {
      params.origin ||= words[0]
      params.destination ||= words[1]
    }
  }

  return params
}