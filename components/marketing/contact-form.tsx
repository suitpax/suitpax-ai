"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  PiPaperPlaneTiltBold,
  PiPhoneBold,
  PiEnvelopeBold,
  PiMapPinBold,
  PiClockBold,
  PiCheckCircleBold,
  PiWarningBold,
} from "react-icons/pi"

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  inquiryType: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const inquiryTypes = [
    "Sales Inquiry",
    "Product Demo",
    "Technical Support",
    "Partnership",
    "Enterprise Solutions",
    "General Question",
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.company.trim()) newErrors.company = "Company is required"
    if (!formData.inquiryType) newErrors.inquiryType = "Please select an inquiry type"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          inquiryType: "",
          message: "",
        })
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({ submit: "Failed to send message. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center rounded-xl bg-green-100 px-3 py-1 text-xs font-medium text-green-800 mb-6">
                  <PiCheckCircleBold className="w-3 h-3 mr-1.5" />
                  Message Sent Successfully
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
                  Thank you for
                  <br />
                  <span className="text-gray-600">reaching out</span>
                </h2>

                <p className="text-lg font-light text-gray-700 mb-8">
                  We've received your message and will get back to you within 24 hours. Our team is excited to help you
                  transform your business travel experience.
                </p>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>

              {/* Contact Info */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-medium tracking-tighter mb-6 text-black">Get in Touch</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <PiEnvelopeBold className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-1">Email</h4>
                      <p className="text-gray-600">hello@suitpax.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <PiPhoneBold className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-1">Phone</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <PiClockBold className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-1">Response Time</h4>
                      <p className="text-gray-600">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
            <Image
              src="/logo/suitpax-symbol.webp"
              alt="Suitpax"
              width={12}
              height={12}
              className="mr-1.5 w-3 h-3 brightness-0 invert"
            />
            Contact Sales
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
            Ready to transform
            <br />
            <span className="text-gray-600">your business travel?</span>
          </h2>
          <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
            Get in touch with our team to learn how Suitpax can streamline your corporate travel management and save
            your company time and money.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? "border-red-300" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <PiWarningBold className="w-3 h-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? "border-red-300" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent`}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <PiWarningBold className="w-3 h-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-black mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.company ? "border-red-300" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent`}
                      placeholder="Acme Corp"
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <PiWarningBold className="w-3 h-3 mr-1" />
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-black mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.inquiryType ? "border-red-300" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent`}
                  >
                    <option value="">Select an option</option>
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.inquiryType && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <PiWarningBold className="w-3 h-3 mr-1" />
                      {errors.inquiryType}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message ? "border-red-300" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none`}
                    placeholder="Tell us about your business travel needs and how we can help..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <PiWarningBold className="w-3 h-3 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 flex items-center">
                      <PiWarningBold className="w-4 h-4 mr-2" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
                  Get in Touch
                </div>

                <h3 className="text-2xl font-medium tracking-tighter mb-6 text-black">
                  Let's discuss your travel needs
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <PiEnvelopeBold className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-1">Email Us</h4>
                      <p className="text-gray-600 mb-1">hello@suitpax.com</p>
                      <p className="text-xs text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <PiPhoneBold className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-1">Call Us</h4>
                      <p className="text-gray-600 mb-1">+1 (555) 123-4567</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <PiMapPinBold className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-1">Visit Us</h4>
                      <p className="text-gray-600 mb-1">123 Business Ave</p>
                      <p className="text-xs text-gray-500">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-lg font-medium tracking-tighter mb-4 text-black">Why Choose Suitpax?</h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <PiCheckCircleBold className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Save up to 30% on travel costs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PiCheckCircleBold className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">24/7 AI-powered support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PiCheckCircleBold className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Automated expense management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PiCheckCircleBold className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Enterprise-grade security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
