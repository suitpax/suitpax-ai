"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ChevronRight,
  Coffee,
  Utensils,
  Wifi,
  Monitor,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  CheckCircle,
} from "lucide-react"

const AirportLoungeExperience = () => {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Discover & Book",
      description: "Find and book VIP lounges at over 650+ airports worldwide directly through the Suitpax app.",
      icon: <MapPin className="h-6 w-6 text-emerald-950" />,
      image: "/images/airport-lounge-relaxation.jpg",
    },
    {
      id: 2,
      title: "Digital Access",
      description: "Access your lounge pass digitally through the Suitpax app - no printing required.",
      icon: <Smartphone className="h-6 w-6 text-emerald-950" />,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-05-1-1536x1024-NFCyaLzwQ4FwITYJw7s3ifqNd3Ycby.webp",
    },
    {
      id: 3,
      title: "Enjoy Premium Experience",
      description: "Relax in comfort with premium amenities, food, drinks, and workspace access.",
      icon: <Coffee className="h-6 w-6 text-emerald-950" />,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-03-1-1536x1024-c9MGAR9KsV2cmdfu75S7pLhLRMotJ3.webp",
    },
    {
      id: 4,
      title: "Expense Management",
      description: "Seamlessly track and manage lounge expenses with automatic receipt capture and categorization.",
      icon: <CreditCard className="h-6 w-6 text-emerald-950" />,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alaska-Lounge-Seattle-34-4KN35BWgEKSrPxHYu5yVfVz7yXpDUg.webp",
    },
  ]

  const features = [
    {
      icon: <Wifi className="h-5 w-5 text-emerald-950" />,
      title: "High-Speed WiFi",
      description: "Stay connected with reliable high-speed internet access",
    },
    {
      icon: <Utensils className="h-5 w-5 text-emerald-950" />,
      title: "Premium Dining",
      description: "Enjoy complimentary gourmet meals and premium beverages",
    },
    {
      icon: <Monitor className="h-5 w-5 text-emerald-950" />,
      title: "Workspace Access",
      description: "Dedicated areas for productive work with charging stations",
    },
    {
      icon: <Clock className="h-5 w-5 text-emerald-950" />,
      title: "Pre-flight Relaxation",
      description: "Comfortable seating and quiet zones for relaxation",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Premium Airport Lounge Access</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your travel experience with exclusive access to premium airport lounges worldwide through Suitpax.
          </p>
        </div>

        {/* Journey Steps */}
        <div className="mb-20">
          <div className="flex flex-wrap mb-8 justify-center">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center px-4 py-2 m-2 rounded-full border transition-all ${
                  activeStep === step.id
                    ? "border-emerald-950 bg-emerald-950 text-white"
                    : "border-gray-200 hover:border-emerald-950 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{step.icon}</span>
                <span className={`font-medium ${activeStep === step.id ? "text-white" : "text-gray-800"}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50">
                {steps.find((s) => s.id === activeStep)?.icon}
              </div>
              <h3 className="text-2xl font-medium mb-4">{steps.find((s) => s.id === activeStep)?.title}</h3>
              <p className="text-gray-600 mb-6">{steps.find((s) => s.id === activeStep)?.description}</p>

              <div className="space-y-3">
                {activeStep === 1 && (
                  <>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Filter lounges by amenities, ratings, and availability</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">View real-time availability and book instantly</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Access exclusive Suitpax member rates and promotions</p>
                    </div>
                  </>
                )}

                {activeStep === 2 && (
                  <>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">QR code access directly from your Suitpax app</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">
                        Offline access capability for areas with limited connectivity
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Share access with team members through the app</p>
                    </div>
                  </>
                )}

                {activeStep === 3 && (
                  <>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Complimentary food and premium beverages</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Shower facilities and relaxation areas</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Business centers with meeting rooms and workspaces</p>
                    </div>
                  </>
                )}

                {activeStep === 4 && (
                  <>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Automatic receipt capture and expense categorization</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Integration with company expense policies</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-950 mt-0.5 mr-2" />
                      <p className="text-sm text-gray-600">Detailed reporting for finance teams and travel managers</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              key={`image-${activeStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src={steps.find((s) => s.id === activeStep)?.image || ""}
                alt={steps.find((s) => s.id === activeStep)?.title || ""}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Global Coverage */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-medium mb-3">Global Lounge Network</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Access to over 650+ premium airport lounges across 148 countries worldwide, including major hubs and
            regional airports.
          </p>

          <div className="inline-flex items-center bg-emerald-950 text-white px-5 py-3 rounded-full font-medium hover:bg-emerald-900 transition-colors">
            <span>Explore Lounge Network</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AirportLoungeExperience
