"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Clock, TrendingUp, MapPin } from "lucide-react"

interface PredictiveSearchProps {
  userPlan: "free" | "basic" | "pro" | "custom"
}

export function PredictiveSearchShowcase({ userPlan }: PredictiveSearchProps) {
  const [isActive, setIsActive] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])

  const mockPredictions = [
    {
      destination: "London",
      confidence: 94,
      reason: "Weekly pattern detected",
      preloadTime: "0.3s",
      savings: "$127",
    },
    {
      destination: "Barcelona",
      confidence: 87,
      reason: "Client meeting scheduled",
      preloadTime: "0.5s",
      savings: "$89",
    },
    {
      destination: "Amsterdam",
      confidence: 76,
      reason: "Conference season",
      preloadTime: "0.8s",
      savings: "$156",
    },
  ]

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setPredictions(mockPredictions)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  const getFeaturesByPlan = () => {
    switch (userPlan) {
      case "free":
        return {
          predictions: 1,
          accuracy: "Basic",
          preload: false,
          description: "See how predictive search works",
        }
      case "basic":
        return {
          predictions: 3,
          accuracy: "Standard",
          preload: true,
          description: "Limited predictive search with basic patterns",
        }
      case "pro":
        return {
          predictions: 10,
          accuracy: "Advanced",
          preload: true,
          description: "Full predictive search with AI learning",
        }
      case "custom":
        return {
          predictions: "Unlimited",
          accuracy: "Enterprise",
          preload: true,
          description: "Custom predictive models for your organization",
        }
    }
  }

  const features = getFeaturesByPlan()

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight">Predictive Search AI</h3>
            <p className="text-gray-400 text-sm">{features.description}</p>
          </div>
          <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30">{features.accuracy}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{features.predictions}</div>
            <div className="text-xs text-gray-400">Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">95%</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">&lt;1s</div>
            <div className="text-xs text-gray-400">Response</div>
          </div>
        </div>

        <Button
          onClick={() => setIsActive(!isActive)}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white mb-4"
          disabled={userPlan === "free" && isActive}
        >
          <Zap className="h-4 w-4 mr-2" />
          {isActive ? "Stop Demo" : "Start Predictive Demo"}
        </Button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {predictions.slice(0, userPlan === "free" ? 1 : predictions.length).map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-medium">{prediction.destination}</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {prediction.confidence}% confident
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{prediction.reason}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <Clock className="h-3 w-3" />
                        {prediction.preloadTime}
                      </div>
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        {prediction.savings}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {userPlan === "free" && (
                <div className="text-center py-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Upgrade to see more predictions</p>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
