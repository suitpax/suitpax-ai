import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  currency: "eur",
  plans: {
    free: {
      name: "Free",
      price: 0,
      priceId: null,
      features: ["5 AI searches per month", "Basic expense tracking", "Email support"],
      limits: {
        aiTokens: 5000,
        teamMembers: 1,
        travelSearches: 5,
      },
    },
    premium: {
      name: "Premium",
      price: 29,
      priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
      features: [
        "Unlimited AI searches",
        "Advanced expense management",
        "Bank integration",
        "Priority support",
        "Up to 10 team members",
      ],
      limits: {
        aiTokens: 50000,
        teamMembers: 10,
        travelSearches: -1, // unlimited
      },
    },
    enterprise: {
      name: "Enterprise",
      price: 99,
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
      features: [
        "Everything in Premium",
        "Custom travel policies",
        "Advanced analytics",
        "24/7 phone support",
        "Unlimited team members",
        "Custom integrations",
      ],
      limits: {
        aiTokens: 200000,
        teamMembers: -1, // unlimited
        travelSearches: -1, // unlimited
      },
    },
  },
} as const

export type PlanType = keyof typeof STRIPE_CONFIG.plans

export function getPlanConfig(planType: PlanType) {
  return STRIPE_CONFIG.plans[planType]
}

export async function createCustomer(email: string, name?: string, metadata?: Record<string, string>) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  })
}

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata,
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: {
      enabled: true,
    },
  })
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method", "customer"],
  })
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: "create_prorations",
  })
}
