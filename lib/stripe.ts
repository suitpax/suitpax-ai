import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

export const STRIPE_PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: ["Up to 5 flights per month", "Basic expense tracking", "Email support", "Standard AI assistance"],
    limits: {
      flights: 5,
      expenses: 50,
      teamMembers: 1,
      aiQueries: 10,
    },
  },
  premium: {
    name: "Premium",
    price: 29,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Unlimited flights",
      "Advanced expense management",
      "Priority support",
      "Advanced AI with memory",
      "Team collaboration",
      "Custom travel policies",
      "Analytics dashboard",
    ],
    limits: {
      flights: -1, // unlimited
      expenses: -1,
      teamMembers: 10,
      aiQueries: 100,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Everything in Premium",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security",
      "Custom AI training",
      "White-label options",
    ],
    limits: {
      flights: -1,
      expenses: -1,
      teamMembers: -1,
      aiQueries: -1,
    },
  },
} as const

export type StripePlan = keyof typeof STRIPE_PLANS

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  return session
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}
