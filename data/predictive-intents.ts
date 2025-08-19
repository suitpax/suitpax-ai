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
  {
    id: "romance-venice",
    labels: ["romance", "romántico", "canales"],
    keywords: ["venecia", "góndolas", "gondolas", "canales"],
    destination: { city: "Venice", country: "Italy", iataCity: "VCE", airports: ["VCE"] },
    weight: 0.75,
  },
  {
    id: "honeymoon-maldives",
    labels: ["honeymoon", "romance", "beach"],
    keywords: ["maldivas", "maldives", "overwater", "bungalows"],
    destination: { city: "Male", country: "Maldives", iataCity: "MLE", airports: ["MLE"] },
    weight: 0.92,
  },
  {
    id: "honeymoon-santorini",
    labels: ["honeymoon", "romance", "island"],
    keywords: ["santorini", "oía", "oia", "cúpulas azules", "blue domes"],
    destination: { city: "Santorini", country: "Greece", iataCity: "JTR", airports: ["JTR"] },
    weight: 0.85,
  },
  {
    id: "honeymoon-bali",
    labels: ["honeymoon", "romance", "island", "beach"],
    keywords: ["bali", "ubud", "nusa", "canggu"],
    destination: { city: "Bali", country: "Indonesia", iataCity: "DPS", airports: ["DPS"] },
    weight: 0.84,
  },
  {
    id: "nightlife-vegas",
    labels: ["nightlife", "entertainment"],
    keywords: ["las vegas", "vegas", "sin city", "casino", "strip"],
    destination: { city: "Las Vegas", country: "USA", iataCity: "LAS", airports: ["LAS"] },
    weight: 0.9,
  },
  {
    id: "big-apple-nyc",
    labels: ["urban", "nightlife"],
    keywords: ["big apple", "broadway", "times square", "manhattan", "central park"],
    destination: { city: "New York", country: "USA", iataCity: "NYC", airports: ["JFK", "EWR", "LGA"] },
    weight: 0.9,
  },
  {
    id: "finance-singapore",
    labels: ["business", "finance", "hub"],
    keywords: ["singapur", "singapore", "marina bay", "merlion"],
    destination: { city: "Singapore", country: "Singapore", iataCity: "SIN", airports: ["SIN"] },
    weight: 0.8,
  },
  {
    id: "finance-dubai",
    labels: ["business", "finance", "hub"],
    keywords: ["dubai", "burj", "emiratos", "emirates"],
    destination: { city: "Dubai", country: "UAE", iataCity: "DXB", airports: ["DXB"] },
    weight: 0.82,
  },
  {
    id: "finance-frankfurt",
    labels: ["business", "finance"],
    keywords: ["frankfurt", "bce", "ecb"],
    destination: { city: "Frankfurt", country: "Germany", iataCity: "FRA", airports: ["FRA"] },
  },
  {
    id: "tech-sanfrancisco",
    labels: ["tech", "startup", "innovation"],
    keywords: ["silicon valley", "san francisco", "sf", "bay area", "palo alto", "menlo park"],
    destination: { city: "San Francisco", country: "USA", iataCity: "SFO", airports: ["SFO", "SJC", "OAK"] },
  },
  {
    id: "culture-paris",
    labels: ["art", "culture", "museums"],
    keywords: ["ciudad de la luz", "louvre", "orsay", "montmartre", "parís", "paris"],
    destination: { city: "Paris", country: "France", iataCity: "PAR", airports: ["CDG", "ORY"] },
  },
  {
    id: "gaudi-barcelona",
    labels: ["culture", "beach", "city-break"],
    keywords: ["gaudí", "sagrada familia", "barcelona", "barna", "bcn"],
    destination: { city: "Barcelona", country: "Spain", iataCity: "BCN", airports: ["BCN"] },
    weight: 0.88,
  },
  {
    id: "canals-amsterdam",
    labels: ["city-break", "canales"],
    keywords: ["amsterdam", "canales", "bicicletas", "rijksmuseum", "van gogh"],
    destination: { city: "Amsterdam", country: "Netherlands", iataCity: "AMS", airports: ["AMS"] },
  },
  {
    id: "alps-ski-gva",
    labels: ["ski", "mountain"],
    keywords: ["alpes", "alps", "ski", "esquí", "zermatt", "chamonix"],
    destination: { city: "Geneva", country: "Switzerland", iataCity: "GVA", airports: ["GVA"] },
  },
  {
    id: "med-islands-ibiza",
    labels: ["beach", "nightlife"],
    keywords: ["ibiza", "formentera", "eivissa"],
    destination: { city: "Ibiza", country: "Spain", iataCity: "IBZ", airports: ["IBZ"] },
  },
  {
    id: "greek-islands-mykonos",
    labels: ["beach", "island", "nightlife"],
    keywords: ["mykonos", "cyclades"],
    destination: { city: "Mykonos", country: "Greece", iataCity: "JMK", airports: ["JMK"] },
  },
  {
    id: "kpop-seoul",
    labels: ["culture", "pop"],
    keywords: ["seúl", "seoul", "k-pop", "kpop", "gangnam"],
    destination: { city: "Seoul", country: "South Korea", iataCity: "SEL", airports: ["ICN", "GMP"] },
  },
  {
    id: "anime-tokyo",
    labels: ["culture", "pop"],
    keywords: ["tokio", "tokyo", "akihabara", "anime", "shibuya"],
    destination: { city: "Tokyo", country: "Japan", iataCity: "TYO", airports: ["HND", "NRT"] },
  },
  {
    id: "pyramids-cairo",
    labels: ["history", "culture"],
    keywords: ["pirámides", "pyramids", "giza", "cairo", "egipto", "egypt"],
    destination: { city: "Cairo", country: "Egypt", iataCity: "CAI", airports: ["CAI"] },
  },
  {
    id: "safari-nairobi",
    labels: ["safari", "wildlife"],
    keywords: ["safari", "maasai mara", "kenya", "kenia", "nairobi"],
    destination: { city: "Nairobi", country: "Kenya", iataCity: "NBO", airports: ["NBO", "WIL"] },
  },
  {
    id: "oktoberfest-munich",
    labels: ["festival", "beer"],
    keywords: ["oktoberfest", "munich", "munich", "cerveza"],
    destination: { city: "Munich", country: "Germany", iataCity: "MUC", airports: ["MUC"] },
  },
  {
    id: "opera-vienna",
    labels: ["music", "culture"],
    keywords: ["viena", "vienna", "ópera", "opera", "musikverein"],
    destination: { city: "Vienna", country: "Austria", iataCity: "VIE", airports: ["VIE"] },
  },
]

