export interface PredictiveIntent {
  id: string
  labels: string[]
  keywords: string[]
  destination: {
    city: string
    country?: string
    iataCity?: string
    airports?: string[]
  }
  weight?: number
}

// Phrase → destination knowledge to help the AI and deterministic matcher
export const PREDICTIVE_INTENTS: PredictiveIntent[] = [
  {
    id: "romance-rome",
    labels: ["romance", "romántico", "amor"],
    keywords: [
      "ciudad del amor",
      "city of love",
      "romance",
      "romántico",
      "luna de miel",
      "san valentín",
    ],
    destination: { city: "Rome", country: "Italy", iataCity: "ROM", airports: ["FCO", "CIA"] },
    weight: 0.9,
  },
  {
    id: "romance-paris",
    labels: ["romance", "romántico", "amor"],
    keywords: ["parís", "paris"],
    destination: { city: "Paris", country: "France", iataCity: "PAR", airports: ["CDG", "ORY"] },
    weight: 0.7,
  },
  {
    id: "nyc-never-sleeps",
    labels: ["nightlife", "urban"],
    keywords: [
      "la ciudad que nunca duerme",
      "the city that never sleeps",
      "nunca duerme",
      "broadway",
      "times square",
      "manhattan",
      "nyc",
      "nueva york",
      "new york",
    ],
    destination: { city: "New York", country: "USA", iataCity: "NYC", airports: ["JFK", "EWR", "LGA"] },
    weight: 0.95,
  },
  {
    id: "biz-london",
    labels: ["business", "corporate"],
    keywords: [
      "viaje de negocios",
      "business trip",
      "reuniones",
      "conference",
      "city",
      "london",
      "londres",
      "canary wharf",
    ],
    destination: { city: "London", country: "UK", iataCity: "LON", airports: ["LHR", "LGW", "LCY", "STN", "LTN"] },
    weight: 0.85,
  },
  {
    id: "beach-barcelona",
    labels: ["beach", "city-break"],
    keywords: ["playa", "beach", "gaudí", "barcelona", "barna", "bcn"],
    destination: { city: "Barcelona", country: "Spain", iataCity: "BCN", airports: ["BCN"] },
  },
  {
    id: "fashion-milan",
    labels: ["fashion", "shopping"],
    keywords: ["fashion", "moda", "shopping", "milán", "milan"],
    destination: { city: "Milan", country: "Italy", iataCity: "MIL", airports: ["MXP", "LIN", "BGY"] },
  },
]

