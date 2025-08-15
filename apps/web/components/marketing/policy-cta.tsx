"use client"
import Link from "next/link"
import { ArrowRight, Shield, CheckCircle } from "lucide-react"

export const PolicyCTA = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gray-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-gray-200/30 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Shield className="h-6 w-6 text-emerald-950" />
                <span className="text-lg font-medium text-emerald-950">Suitpax Policy Engine</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-black text-center mb-6">
                Ready to transform your travel policy management?
              </h2>

              <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
                Join the companies that have revolutionized their travel programs with Suitpax's intelligent policies.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link
                  href="https://accounts.suitpax.com/waitlist"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition-colors"
                >
                  Get started now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="https://cal.com/team/founders/partnership"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-black font-medium hover:bg-gray-50 transition-colors"
                >
                  Schedule a demo
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-950 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">30-day implementation guarantee</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-950 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Dedicated onboarding support</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-950 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">No long-term contracts required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PolicyCTA
