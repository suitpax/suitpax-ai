"use client"
import { motion } from "framer-motion"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Billing</h1>
          <p className="text-gray-600 font-light">
            <em className="font-serif italic">
              Subscription management coming soon. We will connect Stripe Checkout and Customer Portal here.
            </em>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8"
        >
          <h2 className="text-xl font-medium tracking-tighter mb-4">Your Plan</h2>
          <div className="space-y-4 text-gray-600 font-light">
            <p>Plans and upgrades will be available shortly. Meanwhile, all core features remain accessible.</p>
            <p>Once enabled, this page will offer one-click Stripe Checkout and a link to Stripe Customer Portal.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
