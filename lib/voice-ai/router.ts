import { detectIntent } from "./nlu"
import type { IntentResult } from "./types"

export interface RouterResult {
  handled: boolean
  response?: string
  redirectUrl?: string
  meta?: Record<string, unknown>
}

export async function routeVoiceQuery(raw: string): Promise<RouterResult> {
  const intent: IntentResult = detectIntent(raw)

  if (intent.type === "search_flights") {
    // Compose query params for dashboard flights
    const q = new URLSearchParams()
    const data = (intent.data || {}) as any
    if (data.origin) q.set("origin", String(data.origin))
    if (data.destination) q.set("destination", String(data.destination))
    if (data.date) q.set("date", String(data.date))
    if (data.passengers) q.set("passengers", String(data.passengers))
    if (data.directOnly) q.set("directOnly", "1")
    q.set("autosearch", "1")
    return {
      handled: true,
      response: "I will search flights now.",
      redirectUrl: `/dashboard/flights?${q.toString()}`,
      meta: { intent },
    }
  }

  if (intent.type === "greeting") {
    return { handled: true, response: "Hi, how can I help with your trip?" }
  }

  if (intent.type === "cancel") {
    return { handled: true, response: "Okay, I stopped listening." }
  }

  return { handled: false, response: "Could you clarify your request?" }
}