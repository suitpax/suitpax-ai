"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, Users, DollarSign, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface PolicyRecommendation {
  id: string
  name: string
  type: "basic" | "standard" | "premium" | "enterprise"
  confidence: number
  savings: number
  compliance: number
  features: string[]
  reasoning: string
  metrics: {
    costReduction: number
    timeEfficiency: number
    riskMitigation: number
    employeeSatisfaction: number
  }
}

export default function PolicyRecommendationEngine() {
  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRecommendation | null>(null)

  const mockRecommendations: PolicyRecommendation[] = [
    {
      id: "1",
      name: "Smart Business Travel Policy",
      type: "premium",
      confidence: 94,
      savings: 25000,
      compliance: 98,
      features: [
        "AI-powered booking optimization",
        "Dynamic expense limits",
        "Real-time policy compliance",
        "Automated approval workflows",
        "Carbon footprint tracking",
      ],
      reasoning:
        "Based on your company size (250+ employees) and high travel frequency, this policy offers optimal cost control while maintaining flexibility for business needs.",
      metrics: {
        costReduction: 23,
        timeEfficiency: 45,
        riskMitigation: 87,
        employeeSatisfaction: 92,
      },
    },
    {
      id: "2",
      name: "Enterprise Global Policy",
      type: "enterprise",
      confidence: 89,
      savings: 45000,
      compliance: 99,
      features: [
        "Multi-region compliance",
        "Advanced analytics dashboard",
        "Custom approval hierarchies",
        "Integration with ERP systems",
        "24/7 travel support",
      ],
      reasoning:
        "Your global operations and complex organizational structure would benefit from enterprise-level policy management with advanced customization options.",
      metrics: {
        costReduction: 31,
        timeEfficiency: 38,
        riskMitigation: 95,
        employeeSatisfaction: 88,
      },
    },
    {
      id: "3",
      name: "Sustainable Travel Policy",
      type: "standard",
      confidence: 76,
      savings: 18000,
      compliance: 95,
      features: [
        "Carbon offset integration",
        "Sustainable vendor preferences",
        "Green travel incentives",
        "Environmental reporting",
        "Alternative transport options",
      ],
      reasoning:
        "Your company's sustainability goals align well with eco-friendly travel policies that can reduce environmental impact while maintaining cost efficiency.",
      metrics: {
        costReduction: 15,
        timeEfficiency: 28,
        riskMitigation: 72,
        employeeSatisfaction: 85,
      },
    },
  ]

  useEffect(() => {
    // Simulate AI analysis
    setIsAnalyzing(true)
    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setSelectedPolicy(mockRecommendations[0])
      setIsAnalyzing(false)
    }, 3000)
  }, [])

  const getPolicyColor = (type: string) => {
    switch (type) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI Policy Recommendation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing your company data...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Policy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPolicy?.id === policy.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPolicy(policy)}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge className={getPolicyColor(policy.type)}>{policy.type.toUpperCase()}</Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">{policy.confidence}%</div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{policy.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Annual Savings:</span>
                    <span className="font-medium text-green-600">${policy.savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compliance:</span>
                    <span className="font-medium">{policy.compliance}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPolicy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedPolicy.name}</span>
              <Badge className={getPolicyColor(selectedPolicy.type)}>{selectedPolicy.type.toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AI Reasoning</h4>
                  <p className="text-sm text-blue-800">{selectedPolicy.reasoning}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">${selectedPolicy.savings.toLocaleString()}</div>
                    <div className="text-xs text-green-700">Annual Savings</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{selectedPolicy.confidence}%</div>
                    <div className="text-xs text-blue-700">Confidence</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">{selectedPolicy.compliance}%</div>
                    <div className="text-xs text-purple-700">Compliance</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-orange-600">45%</div>
                    <div className="text-xs text-orange-700">Time Saved</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Cost Reduction</span>
                      <span className="text-sm text-gray-500">{selectedPolicy.metrics.costReduction}%</span>
                    </div>
                    <Progress value={selectedPolicy.metrics.costReduction} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Time Efficiency</span>
                      <span className="text-sm text-gray-500">{selectedPolicy.metrics.timeEfficiency}%</span>
                    </div>
                    <Progress value={selectedPolicy.metrics.timeEfficiency} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Risk Mitigation</span>
                      <span className="text-sm text-gray-500">{selectedPolicy.metrics.riskMitigation}%</span>
                    </div>
                    <Progress value={selectedPolicy.metrics.riskMitigation} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Employee Satisfaction</span>
                      <span className="text-sm text-gray-500">{selectedPolicy.metrics.employeeSatisfaction}%</span>
                    </div>
                    <Progress value={selectedPolicy.metrics.employeeSatisfaction} className="h-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPolicy.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1">Implement This Policy</Button>
              <Button variant="outline">Customize Further</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
