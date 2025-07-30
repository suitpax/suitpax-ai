"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  Mail,
  Building,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Globe,
  Shield,
  Zap,
} from "lucide-react"

interface FormData {
  name: string
  email: string
  company: string
  message: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
    })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      })

      // Reset success state after 5 seconds
      setTimeout(() => {
        setFormState((prev) => ({ ...prev, isSuccess: false }))
      }, 5000)
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: "Failed to send message. Please try again.",
      })
    }
  }

  const isFormValid = formData.name && formData.email && formData.company && formData.message

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center rounded-2xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Get in Touch
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Ready to transform your business travel?
          </h2>

          <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of companies already using Suitpax to streamline their travel operations. Let's discuss how
            we can help your business.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h3>
                  <p className="text-gray-600 font-light">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {formState.isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      Message sent successfully! We'll be in touch soon.
                    </span>
                  </motion.div>
                )}

                {formState.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">{formState.error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-colors bg-white/90 backdrop-blur-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-colors bg-white/90 backdrop-blur-sm"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className="pl-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-colors bg-white/90 backdrop-blur-sm"
                        placeholder="Your Company Inc."
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="pl-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none bg-white/90 backdrop-blur-sm"
                        placeholder="Tell us about your business travel needs and how we can help..."
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isFormValid || formState.isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {formState.isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Info */}
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                      <p className="text-gray-600 font-light">hello@suitpax.com</p>
                      <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                      <p className="text-gray-600 font-light">Available 24/7</p>
                      <p className="text-sm text-gray-500 mt-1">Instant support when you need it</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Global Support</h4>
                      <p className="text-gray-600 font-light">Worldwide coverage</p>
                      <p className="text-sm text-gray-500 mt-1">Support in multiple time zones</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Quick Setup",
                  description: "Get started in minutes with our streamlined onboarding process",
                  color: "yellow",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level security with SOC 2 compliance and data encryption",
                  color: "blue",
                },
                {
                  icon: Globe,
                  title: "Global Coverage",
                  description: "Access to flights, hotels, and services in 190+ countries worldwide",
                  color: "green",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      feature.color === "yellow"
                        ? "bg-yellow-100"
                        : feature.color === "blue"
                          ? "bg-blue-100"
                          : "bg-green-100"
                    }`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        feature.color === "yellow"
                          ? "text-yellow-600"
                          : feature.color === "blue"
                            ? "text-blue-600"
                            : "text-green-600"
                      }`}
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 font-light text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
