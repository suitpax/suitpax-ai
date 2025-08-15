"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Database, FolderOpen, Cloud, FileText, Settings, Check, Brain, Sparkles, User } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface UnifiedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "connections" | "models" | "agents"
  selectedModel?: string
  onSelectModel?: (model: string) => void
  selectedAgent?: string
  onSelectAgent?: (agent: string) => void
}

const connectionOptions = [
  {
    id: "bank",
    title: "Connect Bank Account",
    description: "Sync your business expenses automatically",
    icon: CreditCard,
    status: "available",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "context",
    title: "Add Context",
    description: "Upload documents for better AI responses",
    icon: FileText,
    status: "available",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "google-drive",
    title: "Google Drive",
    description: "Access your Drive files directly",
    icon: FolderOpen,
    status: "coming-soon",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  {
    id: "database",
    title: "Database Connection",
    description: "Connect to your company database",
    icon: Database,
    status: "coming-soon",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  {
    id: "cloud-storage",
    title: "Cloud Storage",
    description: "Dropbox, OneDrive, and more",
    icon: Cloud,
    status: "coming-soon",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  {
    id: "integrations",
    title: "More Integrations",
    description: "Slack, Teams, CRM systems",
    icon: Settings,
    status: "coming-soon",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
]

const aiModels = [
  {
    id: "suitpax-1.0",
    name: "Suitpax AI 1.0",
    description: "Our foundational model for travel and business assistance",
    capabilities: ["Travel Planning", "Expense Management", "Basic Coding", "Document Analysis"],
    status: "active",
    icon: Brain,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    prompt:
      "You are Suitpax AI 1.0, a helpful assistant specialized in business travel, expense management, and general productivity tasks. You provide accurate, concise responses and help users with travel planning, booking assistance, and business-related queries.",
  },
  {
    id: "suitpax-1.7",
    name: "Suitpax AI 1.7",
    description: "Advanced model with enhanced reasoning and multimodal capabilities",
    capabilities: [
      "Advanced Travel Intelligence",
      "Complex Financial Analysis",
      "Advanced Coding",
      "Image Recognition",
      "Voice Processing",
      "Predictive Analytics",
    ],
    status: "coming-soon",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    prompt:
      "You are Suitpax AI 1.7, an advanced AI assistant with sophisticated reasoning capabilities. You excel at complex travel optimization, predictive analytics for business expenses, advanced code generation, multimodal content analysis, and strategic business planning. You can process images, understand context deeply, and provide nuanced insights that go beyond basic assistance. Your responses are thoughtful, comprehensive, and demonstrate advanced understanding of business travel ecosystems, financial patterns, and user intent. You proactively suggest optimizations and identify potential issues before they arise.",
  },
]

const aiAgents = [
  {
    id: "agent-40",
    name: "Agent 40",
    description: "General purpose AI agent for all your business needs",
    specialties: ["General Assistance", "Problem Solving", "Research", "Analysis"],
    image: "/ai-agents/agent-40.png",
    status: "active",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  {
    id: "travel-agent",
    name: "Travel Agent",
    description: "Specialized in travel planning, bookings, and itinerary optimization",
    specialties: ["Flight Booking", "Hotel Search", "Itinerary Planning", "Travel Policies"],
    image: "/ai-agents/agent-travel.png",
    status: "active",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "finance-agent",
    name: "Finance Agent",
    description: "Expert in expense management, budgeting, and financial analysis",
    specialties: ["Expense Tracking", "Budget Analysis", "Financial Reports", "Cost Optimization"],
    image: "/ai-agents/agent-finance.png",
    status: "active",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "compliance-agent",
    name: "Compliance Agent",
    description: "Ensures all activities meet company policies and regulations",
    specialties: ["Policy Compliance", "Risk Assessment", "Audit Support", "Regulatory Guidance"],
    image: "/ai-agents/agent-40.png",
    status: "coming-soon",
    color: "bg-red-50 text-red-700 border-red-200",
  },
]

export function UnifiedDialog({
  open,
  onOpenChange,
  type,
  selectedModel,
  onSelectModel,
  selectedAgent,
  onSelectAgent,
}: UnifiedDialogProps) {
  const handleConnect = (optionId: string) => {
    if (optionId === "bank") {
      window.location.href = "/dashboard/suitpax-bank"
    } else if (optionId === "context") {
      const input = document.createElement("input")
      input.type = "file"
      input.multiple = true
      input.accept = ".pdf,.txt,.doc,.docx"
      input.click()
    }
    onOpenChange(false)
  }

  const handleSelectModel = (modelName: string, status: string) => {
    if (status === "active" && onSelectModel) {
      onSelectModel(modelName)
      onOpenChange(false)
    }
  }

  const handleSelectAgent = (agentName: string, status: string) => {
    if (status === "active" && onSelectAgent) {
      onSelectAgent(agentName)
      onOpenChange(false)
    }
  }

  const renderContent = () => {
    switch (type) {
      case "connections":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium tracking-tight">Connection Options</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {connectionOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-auto p-4 flex flex-col items-start gap-3 hover:shadow-md transition-all ${
                      option.status === "coming-soon" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={() => option.status === "available" && handleConnect(option.id)}
                    disabled={option.status === "coming-soon"}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      {option.status === "coming-soon" && (
                        <Badge variant="secondary" className="text-xs">
                          Soon
                        </Badge>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )

      case "models":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium tracking-tight flex items-center gap-2">
                <Image src="/suitpax-bl-logo.webp" alt="Suitpax" width={24} height={24} className="rounded-md" />
                AI Models
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              {aiModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-auto p-6 flex items-start gap-4 hover:shadow-md transition-all ${
                      selectedModel === model.name ? "ring-2 ring-gray-900 border-gray-900" : ""
                    } ${model.status === "coming-soon" ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={() => handleSelectModel(model.name, model.status)}
                    disabled={model.status === "coming-soon"}
                  >
                    <div className={`p-3 rounded-xl ${model.color} flex-shrink-0`}>
                      <model.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{model.name}</h3>
                        <div className="flex items-center gap-2">
                          {model.status === "coming-soon" && (
                            <Badge variant="secondary" className="text-xs">
                              Coming Soon
                            </Badge>
                          )}
                          {selectedModel === model.name && model.status === "active" && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Check className="h-4 w-4" />
                              <span className="text-xs font-medium">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{model.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {model.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )

      case "agents":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium tracking-tight flex items-center gap-2">
                <User className="h-5 w-5" />
                AI Agents
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {aiAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-auto p-4 flex flex-col items-center gap-4 hover:shadow-md transition-all ${
                      selectedAgent === agent.name ? "ring-2 ring-gray-900 border-gray-900" : ""
                    } ${agent.status === "coming-soon" ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={() => handleSelectAgent(agent.name, agent.status)}
                    disabled={agent.status === "coming-soon"}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                        <Image
                          src={agent.image || "/placeholder.svg"}
                          alt={agent.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {agent.status === "coming-soon" && (
                          <Badge variant="secondary" className="text-xs">
                            Soon
                          </Badge>
                        )}
                        {selectedAgent === agent.name && agent.status === "active" && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center w-full">
                      <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{agent.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {agent.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={type === "models" ? "max-w-3xl" : type === "agents" ? "max-w-4xl" : "max-w-2xl"}>
        {renderContent()}
        <Separator className="my-6" />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {type === "connections" && "More integrations coming soon. Need something specific? "}
            {type === "models" && "Each model is optimized for different use cases. "}
            {type === "agents" && "Each agent is trained for specific tasks and domains. "}
            <Button variant="link" className="p-0 h-auto text-sm">
              {type === "connections" && "Let us know"}
              {type === "models" && "Learn more about our AI models"}
              {type === "agents" && "Learn more about our AI agents"}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
