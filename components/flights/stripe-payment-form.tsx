"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, Lock, Shield } from "lucide-react"
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

interface StripePaymentFormProps {
  clientSecret: string
  amount: number
  currency: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

interface PaymentFormProps extends Omit<StripePaymentFormProps, 'clientSecret'> {}

function PaymentForm({ amount, currency, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/flights/book/success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        throw new Error(error.message || 'Payment failed')
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success("Payment successful!")
        onSuccess(paymentIntent.id)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      onError(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Amount</span>
          <span className="text-lg font-medium text-gray-900">
            {formatPrice(amount, currency)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Secure payment powered by Stripe</span>
          </div>
          
          <PaymentElement 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card']
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl py-6 text-lg font-medium tracking-tight"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-5 w-5" />
          )}
          {loading ? 'Processing...' : `Pay ${formatPrice(amount, currency)}`}
        </Button>

        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>SSL Encrypted</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center space-x-1">
            <Lock className="h-3 w-3" />
            <span>PCI Compliant</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <span>Powered by Stripe</span>
        </div>
      </form>
    </div>
  )
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#111827',
        colorBackground: '#ffffff',
        colorText: '#374151',
        colorDanger: '#ef4444',
        borderRadius: '12px',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm {...props} />
    </Elements>
  )
}