export type LanguageCode = "en-US" | "es-ES" | "fr-FR" | "de-DE"

export type AgentId = "male_pro" | "female_pro"

export interface AgentProfile {
  id: AgentId
  displayName: string
  voiceId: string
  language: LanguageCode
  systemPrompt: string
  shortBio: string
}

export type IntentType =
  | "greeting"
  | "smalltalk"
  | "search_flights"
  | "book_flight"
  | "cancel"
  | "repeat"
  | "unknown"

export interface IntentResult {
  type: IntentType
  confidence: number
  data?: Record<string, unknown>
}

export interface FlightIntentData {
  origin?: string
  destination?: string
  date?: string
  passengers?: number
  directOnly?: boolean
}