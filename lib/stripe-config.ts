const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null

export const createPaymentIntent = async (amount: number, currency = "usd") => {
  if (!stripe) {
    throw new Error("Stripe not configured. Add STRIPE_SECRET_KEY to environment variables.")
  }

  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export const isStripeConfigured = () => !!process.env.STRIPE_SECRET_KEY

export { stripe }
