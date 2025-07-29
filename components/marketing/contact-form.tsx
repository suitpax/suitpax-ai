"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Check, Mail, User, MessageSquare, Building, Phone, Globe } from "lucide-react"
import toast from "react-hot-toast"

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
  inquiryType: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    inquiryType: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "demo", label: "Request Demo" },
    { value: "enterprise", label: "Enterprise Sales" },
    { value: "support", label: "Technical Support" },
    { value: "partnership", label: "Partnership" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading("Sending message...")

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast.success("Message sent successfully!", { id: toastId })
      setIsSubmitted(true)
      setFormData({ name: "", email: "", company: "", phone: "", message: "", inquiryType: "general" })
    } catch (err) {
      toast.error("Failed to send message. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-600 h-8 w-8" />
          </div>
          <h3 className="text-2xl font-medium tracking-tighter mb-4 text-black">Message Sent Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. Our team will get back to you within 24 hours.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="text-sm font-medium text-black mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Our team will review your inquiry</li>
                <li>• You'll receive a response within 24 hours</li>
                <li>• We'll schedule a call if needed</li>
              </ul>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full bg-transparent hover:bg-gray-50 rounded-xl py-6"
            >
              Send Another Message
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8">
        <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
          <Globe className="mr-1.5 h-3 w-3" />
          Contact Sales
        </div>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter mb-4 text-black">Get in Touch</h2>
        <p className="text-gray-600">
          Ready to transform your business travel? Let's discuss how Suitpax can help your organization.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-black">
              <User className="text-gray-500 h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="bg-white/70 border-gray-300 focus:border-black rounded-xl py-6"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-black">
              <Mail className="text-gray-500 h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="bg-white/70 border-gray-300 focus:border-black rounded-xl py-6"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-black">
              <Building className="text-gray-500 h-4 w-4" />
              Company
            </Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-white/70 border-gray-300 focus:border-black rounded-xl py-6"
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-black">
              <Phone className="text-gray-500 h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-white/70 border-gray-300 focus:border-black rounded-xl py-6"
              placeholder="Your phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inquiryType" className="text-sm font-medium text-black">
            Inquiry Type
          </Label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full bg-white/70 border border-gray-300 focus:border-black rounded-xl py-6 px-4 text-sm"
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-black">
            <MessageSquare className="text-gray-500 h-4 w-4" />
            Your Message *
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            rows={6}
            className="bg-white/70 border-gray-300 focus:border-black rounded-xl resize-none"
            placeholder="Tell us about your business travel needs, team size, current challenges, or any specific requirements..."
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-6 font-medium tracking-tighter transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending Message...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      </form>

      {/* Contact Information */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-sm font-medium text-black mb-4">Other ways to reach us</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="h-4 w-4 text-gray-600" />
            <div>
              <p className="font-medium text-black">Email</p>
              <p className="text-gray-600">hello@suitpax.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="h-4 w-4 text-gray-600" />
            <div>
              <p className="font-medium text-black">Phone</p>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
