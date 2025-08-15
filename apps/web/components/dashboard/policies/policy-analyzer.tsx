"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, FileText, Zap, Target, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface PolicyInsight {
  id: string
  type: "cost_saving" | "compliance_risk" | "efficiency_gain" | "recommendation"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionable: boolean
}

export const PolicyAnalyzer = () => {
  const [insights, setInsights] = useState<PolicyInsight[]>([
    {
      id: "1",
      type: "cost_saving",
      title: "Optimize Flight Booking Window",
      description: "Booking flights 21-35 days in advance could save 15% on average costs",
      impact: "high",
      actionable: true,
    },
    {
      id: "2",
      type: "compliance_risk",
      title: "Expense Approval Delays",
      description: "23% of expenses exceed approval timeframes, risking compliance",
      impact: "medium",
      actionable: true,
    },
  ])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "cost_saving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "compliance_risk":
        return <FileText className="h-4 w-4 text-red-600" />
      case "efficiency_gain":
        return <Zap className="h-4 w-4 text-blue-600" />
      default:
        return <Target className="h-4 w-4 text-purple-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium tracking-tighter text-black">Policy Intelligence</h3>
            <p className="text-sm text-gray-600">AI-powered insights and recommendations</p>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                </div>
                <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>{insight.impact} impact</Badge>
              </div>

              <p className="text-xs text-gray-600 mb-3">{insight.description}</p>

              {insight.actionable && (
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Apply Recommendation
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
          <Brain className="h-4 w-4 mr-2" />
          Generate More Insights
        </Button>
      </div>
    </Card>
  )
}
