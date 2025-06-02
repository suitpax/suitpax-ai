"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Building,
  MessageSquare,
  Calendar,
  Clock,
  Globe,
  Users,
  Briefcase,
  PhoneCall,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FormData {
  name: string
  email: string
  company: string
  message: string
  subject: string
  phone?: string
  companySize?: string
  timezone?: string
  preferredContact?: string
  industry?: string
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
    phone: "",
    companySize: "",
    timezone: "",
    preferredContact: "email",
    industry: "",
  })

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: "error",
        message: "Please complete all required fields.",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      })
      return
    }

    setStatus({ type: "loading", message: "Processing your message..." })

    // Simulate sending (no backend)
    setTimeout(() => {
      setStatus({
        type: "success",
        message:
          "Thank you for your interest! We'll be in touch shortly. For immediate assistance, please contact us directly at hello@suitpax.com",
      })

      // Clear form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
        subject: "",
        phone: "",
        companySize: "",
        timezone: "",
        preferredContact: "email",
        industry: "",
      })

      // Optional: Send to analytics or save in localStorage
      if (typeof window !== "undefined") {
        const contactData = {
          ...formData,
          timestamp: new Date().toISOString(),
        }
        console.log("Contact form submission:", contactData)

        // Save to localStorage for reference
        const existingContacts = JSON.parse(localStorage.getItem("suitpax_contacts") || "[]")
        existingContacts.push(contactData)
        localStorage.setItem("suitpax_contacts", JSON.stringify(existingContacts))
      }
    }, 2000)
  }

  const testimonials = [
    {
      quote:
        "Suitpax transformed our corporate travel management. We've reduced costs by 27% while improving employee satisfaction.",
      author: "Sarah Johnson",
      position: "Travel Manager, Fortune 500 Company",
      logo: "/logos/abstract-tech-logo.png",
    },
    {
      quote: "The AI-powered recommendations have saved us thousands on flight bookings and hotel stays.",
      author: "Michael Chen",
      position: "CFO, Tech Startup",
      logo: "/logos/mcp-logo-1.png",
    },
  ]

  return (
    <section className="pt-12 pb-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
              <em className="font-serif italic">Contact Us</em>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
              <em className="font-serif italic">Let's Transform Your</em>
              <br />
              <span className="text-gray-700">Business Travel</span>
            </h2>
            <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
              Discover how Suitpax can revolutionize your company's travel management with AI-powered solutions tailored
              to your needs.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-medium tracking-tighter mb-4">
                <em className="font-serif italic">Why Choose Suitpax?</em>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Guaranteed savings:</strong> Reduce travel costs by up to 30%
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Advanced AI:</strong> Intelligent agents that learn from your
                    preferences
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">24/7 Support:</strong> Comprehensive assistance anytime, anywhere
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Full integration:</strong> Compatible with your existing systems
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Enterprise-ready:</strong> SOC 2 Type I certified and GDPR compliant
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Global coverage:</strong> Support for 190+ countries and 100+
                    currencies
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-medium tracking-tighter mb-3">
                <em className="font-serif italic">Direct Contact</em>
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <strong>Email:</strong> hello@suitpax.com
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  <strong>Phone:</strong> +1 (800) 123-4567
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <strong>Hours:</strong> Mon-Fri 9:00-18:00 EST
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <strong>Global offices:</strong> San Francisco, London, Singapore
                </p>
              </div>
            </div>

            {/* Schedule a demo section */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-medium tracking-tighter mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <em className="font-serif italic">Schedule a Demo</em>
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                See Suitpax in action with a personalized demo tailored to your business needs.
              </p>
              <Link
                href="https://cal.com/team/founders/partnership"
                target="_blank"
                className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors duration-200"
              >
                Book a 30-minute demo
              </Link>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h4 className="font-medium tracking-tighter">
                <em className="font-serif italic">What Our Clients Say</em>
              </h4>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.logo || "/placeholder.svg"}
                        alt="Company logo"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 italic mb-2">"{testimonial.quote}"</p>
                      <p className="text-xs font-medium text-gray-700">{testimonial.author}</p>
                      <p className="text-xs text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>💡 Note:</strong> This is a demonstration form. For real contact, please email us directly at{" "}
                <a href="mailto:hello@suitpax.com" className="underline font-medium">
                  hello@suitpax.com
                </a>
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6"
            >
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Subject</em>
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
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership Opportunity">Partnership Opportunity</option>
                  <option value="Press & Media">Press & Media</option>
                  <option value="Investor Relations">Investor Relations</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Full Name</em>
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
                  <em className="font-serif italic">Business Email</em>
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

              {/* Advanced Options Toggle */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  {showAdvanced ? "Hide" : "Show"} advanced options
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-2">
                      <em className="font-serif italic">Phone Number</em>{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label htmlFor="companySize" className="block text-xs font-medium text-gray-700 mb-2">
                      <em className="font-serif italic">Company Size</em>{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="companySize"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1001+">1001+ employees</option>
                      </select>
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-xs font-medium text-gray-700 mb-2">
                      <em className="font-serif italic">Industry</em> <span className="text-gray-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                      >
                        <option value="">Select industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance & Banking</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Education">Education</option>
                        <option value="Government">Government</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      <em className="font-serif italic">Preferred Contact Method</em>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === "email"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gray-900 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === "phone"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gray-900 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Phone</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="video"
                          checked={formData.preferredContact === "video"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gray-900 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Video Call</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Message</em>
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
                  {status.type === "loading" && (
                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{status.message}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {status.type === "loading" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <em className="font-serif italic">Send Message</em>
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to be contacted about our services. Your data will be processed in
                accordance with our{" "}
                <Link href="#" className="underline hover:text-gray-700">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
