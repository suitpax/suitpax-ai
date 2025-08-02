"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, AlertCircle, User, Mail, Building, MessageSquare, Loader2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  company: string
  message: string
  subject: string
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error"
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
    subject: "",
  })

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !formData.subject.trim()) {
      setStatus({
        type: "error",
        message: "Please complete all required fields.",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      })
      return
    }

    setStatus({ type: "loading", message: "Sending your message..." })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setStatus({
          type: "success",
          message: result.message,
        })

        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
          subject: "",
        })
      } else {
        setStatus({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setStatus({
        type: "error",
        message:
          "Sorry, there was an error sending your message. Please try again or email us directly at hello@suitpax.com",
      })
    }
  }

  return (
    <section className="pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <em className="font-serif italic">Contact Us</em>
          </div>
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter leading-none mb-6">
            <em className="font-serif italic">Let's Transform Your</em>
            <br />
            <span className="text-gray-700">Business Travel</span>
          </h2>
          <p className="text-sm font-light tracking-tighter text-gray-600 max-w-2xl mx-auto">
            Ready to revolutionize your company's travel management? Get in touch with our team to discover how Suitpax
            can help you save time and money.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-medium tracking-tighter mb-4">
                <em className="font-serif italic">Why Choose Suitpax?</em>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium text-sm">AI-Powered Intelligence:</strong> Smart recommendations that learn
                    from your travel patterns
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium text-sm">Guaranteed Savings:</strong> Reduce travel costs by up to 30% with
                    optimized booking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium text-sm">24/7 Support:</strong> Round-the-clock assistance for all your
                    travel needs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium text-sm">Enterprise Security:</strong> SOC 2 certified with enterprise-grade
                    data protection
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-medium tracking-tighter mb-3">
                <em className="font-serif italic">Get Started Today</em>
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <strong>Email:</strong> hello@suitpax.com
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <strong>Response time:</strong> Within 24 hours
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6"
            >
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Subject</em> *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Product Demo">Product Demo</option>
                  <option value="Enterprise Pricing">Enterprise Pricing</option>
                  <option value="Partnership">Partnership Opportunity</option>
                  <option value="Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Full Name</em> *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Business Email</em> *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Company</em>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Message</em> *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80 resize-none"
                    placeholder="Tell us about your company and how we can help you..."
                    required
                  />
                </div>
              </div>

              {/* Form status */}
              {status.type !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 p-3 rounded-xl ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : status.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {status.type === "success" && <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  {status.type === "error" && <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  {status.type === "loading" && <Loader2 className="h-4 w-4 mt-0.5 flex-shrink-0 animate-spin" />}
                  <span className="text-sm font-medium">{status.message}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {status.type === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <em className="font-serif italic">Sending...</em>
                  </>
                ) : (
                  <>
                    <em className="font-serif italic">Send Message</em>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              <p className="text-xs font-light text-gray-500 text-center">
                By submitting this form, you agree to be contacted about our services.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}