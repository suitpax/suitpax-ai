"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Bot, Zap, Globe, Clock, Shield, ArrowRight, Sparkles } from "lucide-react"

export function MCPFlightsAIAgents() {
  const agents = [
    {
      name: "Flight Search Agent",
      description: "Intelligent flight discovery across all airlines",
      icon: "🔍",
      capabilities: ["Real-time pricing", "Route optimization", "Fare predictions"],
    },
    {
      name: "Booking Agent",
      description: "Seamless reservation management",
      icon: "✈️",
      capabilities: ["Instant booking", "Seat selection", "Special requests"],
    },
    {
      name: "Policy Agent",
      description: "Corporate compliance automation",
      icon: "📋",
      capabilities: ["Policy checking", "Approval routing", "Exception handling"],
    },
    {
      name: "Support Agent",
      description: "24/7 travel assistance",
      icon: "🎧",
      capabilities: ["Flight changes", "Cancellations", "Emergency support"],
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Search and book flights in seconds, not minutes",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access to airlines and routes worldwide",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "AI agents work around the clock for you",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security for all transactions",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Bot className="h-3 w-3 mr-1" />
            MCP Flight Agents
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-Powered Flight Management</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI agents that handle every aspect of business flight booking and management
          </p>
        </motion.div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{agent.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
                  <div className="space-y-2">
                    {agent.capabilities.map((capability, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-500">
                        <Sparkles className="h-3 w-3 mr-2 text-emerald-500" />
                        {capability}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-blue-600 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business Travel?</h3>
              <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                Join the future of business travel with AI agents that work 24/7 to optimize your flights, ensure policy
                compliance, and provide exceptional support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Plane className="mr-2 h-4 w-4" />
                  See Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
