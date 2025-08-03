"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Users, Globe, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Shield,
    title: "Automated Compliance",
    description: "AI-powered policy enforcement that ensures every booking complies with your travel guidelines automatically."
  },
  {
    icon: Zap,
    title: "Smart Approvals",
    description: "Intelligent approval workflows that route requests to the right people based on your business rules."
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Centralized control over team travel with role-based permissions and spending limits."
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "Multi-currency support with region-specific policies for international business travel."
  }
]

const benefits = [
  "Reduce policy violations by 85%",
  "Automate 90% of approval processes",
  "Save 15+ hours per week on travel admin",
  "Ensure 100% expense compliance",
  "Real-time budget monitoring",
  "Custom approval hierarchies"
]

const steps = [
  {
    number: "01",
    title: "Define Your Policies",
    description: "Set up travel guidelines, spending limits, and approval workflows tailored to your business needs."
  },
  {
    number: "02",
    title: "AI Takes Control",
    description: "Our AI agents automatically enforce policies, route approvals, and flag exceptions in real-time."
  },
  {
    number: "03",
    title: "Monitor & Optimize",
    description: "Get insights into travel patterns, compliance rates, and opportunities for cost savings."
  }
]

export function AutomatedTravelPolicies() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Travel Policies
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black mb-6">
              Transform your corporate travel with 
              <span className="bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent"> AI-powered policies</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ensure compliance, optimize spending, and enhance traveler experience with intelligent policies that work automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="https://app.suitpax.com/sign-up"
                className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="mailto:hello@suitpax.com"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Schedule Demo
              </Link>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {benefits.slice(0, 6).map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-4">
              Intelligent policy management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform automatically enforces your travel policies, ensuring compliance and optimizing costs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Set up automated travel policies in minutes and let AI handle the rest.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-start gap-6 mb-12 last:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-lg font-medium">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">
              Ready to automate your travel policies?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join hundreds of companies that have streamlined their travel management with Suitpax.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.suitpax.com/sign-up"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="mailto:hello@suitpax.com"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-gray-600 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}