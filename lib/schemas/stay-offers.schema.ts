export const StayOfferSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    brand: { type: ["string", "null"] },
    city: { type: ["string", "null"] },
    address: { type: ["string", "null"] },
    image: { type: ["string", "null"] },
    rating: { type: ["number", "null"] },
    price: { type: "string" },
    currency: { type: "string" },
    refundable: { type: ["boolean", "null"] },
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
  required: ["id", "name", "price", "currency", "booking_url"],
  additionalProperties: true,
} as const

export const StayOffersBlockSchema = {
  type: "object",
  properties: {
    stays: {
      type: "array",
      items: StayOfferSchema,
      minItems: 1,
      maxItems: 40,
    },
  },
  required: ["stays"],
  additionalProperties: false,
} as const