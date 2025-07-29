"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RiSendPlaneFill, RiCheckboxCircleFill, RiMailFill, RiUserFill, RiQuestionFill } from "react-icons/ri"

interface FormData {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

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

      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        className="max-w-md mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RiCheckboxCircleFill className="text-emerald-600" size={32} />
        </div>
        <h3 className="text-xl font-medium tracking-tighter mb-2">Message Sent!</h3>
        <p className="text-gray-600 text-sm mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="bg-transparent hover:bg-gray-50">
          Send Another Message
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="max-w-md mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium tracking-tighter mb-2">Get in Touch</h2>
        <p className="text-gray-600 text-sm">Have questions? We'd love to hear from you.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2">
            <RiUserFill className="text-gray-500" size={16} />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="bg-white/70 border-gray-200 focus:border-gray-400 rounded-xl"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2">
            <RiMailFill className="text-gray-500" size={16} />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="bg-white/70 border-gray-200 focus:border-gray-400 rounded-xl"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium mb-2">
            <RiQuestionFill className="text-gray-500" size={16} />
            Your Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            rows={4}
            className="bg-white/70 border-gray-200 focus:border-gray-400 rounded-xl resize-none"
            placeholder="Tell us about your inquiry..."
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-3 font-medium tracking-tighter transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RiSendPlaneFill size={16} />
              Send Message
            </div>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">We typically respond within 24 hours during business days.</p>
      </div>
    </motion.div>
  )
}
