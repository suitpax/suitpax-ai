"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, MessageSquare, FileText, Calendar, Plane, Brain, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

const features = [
  {
    icon: MessageSquare,
    title: "Intelligent Conversations",
    description: "Chat naturally about your business travel needs. I understand context and remember your preferences.",
  },
  {
    icon: Plane,
    title: "Travel Planning",
    description: "Plan complete business trips, find flights, book hotels, and manage itineraries with AI assistance.",
  },
  {
    icon: FileText,
    title: "Document Processing",
    description: "Upload and analyze travel documents, expense reports, and company policies instantly.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Coordinate meetings across time zones and optimize your travel schedule automatically.",
  },
  {
    icon: Brain,
    title: "Memory & Learning",
    description: "I remember your travel preferences, frequent destinations, and company policies to serve you better.",
  },
]

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-gray-50 border-gray-200 shadow-2xl">
              <CardContent className="p-0">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full hover:bg-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-8"
                    >
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-2">Welcome to Suitpax AI</h2>
                      <p className="text-gray-600 font-light">
                        Your intelligent business travel assistant is ready to help you work smarter.
                      </p>
                    </motion.div>

                    <div className="space-y-4 mb-8">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <feature.icon className="h-5 w-5 text-gray-700" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-xl p-6 border border-gray-200 mb-6"
                    >
                      <h3 className="font-medium text-gray-900 mb-3">Getting Started</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Ask me anything about business travel, flights, hotels, or expenses</p>
                        <p>• Upload documents for instant analysis and insights</p>
                        <p>• I'll remember your preferences and improve over time</p>
                        <p>• Use voice features for hands-free interaction</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex justify-center"
                    >
                      <Button
                        onClick={onClose}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium tracking-tight"
                      >
                        Start Chatting
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
