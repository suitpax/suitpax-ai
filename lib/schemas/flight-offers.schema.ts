export const FlightOfferSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    price: { type: "string" },
    currency: { type: "string" },
    airline: { type: "string" },
    airline_iata: { type: "string" },
    airline_logo: { type: ["string", "null"] },
    origin: { type: "string" },
    destination: { type: "string" },
    origin_city: { type: ["string", "null"] },
    destination_city: { type: ["string", "null"] },
    destination_image: { type: ["string", "null"] },
    depart: { type: "string" },
    arrive: { type: "string" },
    duration_minutes: { type: ["number", "null"] },
    stops: { type: "number" },
    fare_class: { type: ["string", "null"] },
    refundable: { type: ["boolean", "null"] },
    loyalty: {
      type: "object",
      properties: {
        program: { type: ["string", "null"] },
        miles: { type: ["number", "null"] },
        status_bonus: { type: ["number", "null"] },
      },
      required: [],
      additionalProperties: true,
    },
    badges: {
      type: "array",
      items: {
        type: "object",
        properties: {
          kind: { type: "string" },
          label: { type: "string" },
        },
        required: ["kind", "label"],
        additionalProperties: true,
      },
    },
    booking_url: { type: "string" },
  },
  required: [
    "id",
    "price",
    "currency",
    "airline",
    "airline_iata",
    "origin",
    "destination",
    "depart",
    "arrive",
    "stops",
    "booking_url",
  ],
  additionalProperties: true,
} as const

export const FlightOffersBlockSchema = {
  type: "object",
  properties: {
    offers: {
      type: "array",
      items: FlightOfferSchema,
      minItems: 1,
      maxItems: 5,
    },
  },
  required: ["offers"],
  additionalProperties: false,
} as const