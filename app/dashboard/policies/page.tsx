"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from "react-dropzone"
import {
  Plus,
  Search,
  Download,
  Upload,
  Scan,
  FileText,
  Plane,
  DollarSign,
  CheckCircle,
  Shield,
  Brain,
  Zap,
  Eye,
  AlertTriangle,
  TrendingUp,
  Users,
  Globe,
  Trash2,
  Target,
} from "lucide-react"
// // import { AdvancedOCRService } from "@/lib/ocr/advanced-ocr-service"

interface Policy {
  id: string
  name: string
  category: "travel" | "expense" | "approval" | "compliance"
  status: "active" | "draft" | "archived"
  description: string
  rules: PolicyRule[]
  applicableRoles: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  violations: number
  compliance: number
}

interface PolicyRule {
  id: string
  type: "budget_limit" | "approval_required" | "booking_class" | "advance_booking" | "preferred_vendor"
  condition: string
  value: string | number
  action: "allow" | "require_approval" | "block"
}

interface DocumentAnalysis {
  id: string
  fileName: string
  extractedText: string
  detectedPolicyType: "travel" | "expense" | "approval" | "compliance"
  confidence: number
  suggestedRules: PolicyRule[]
  companySize?: "startup" | "sme" | "enterprise"
  industry?: string
  uploadedAt: string
}

const mockPolicies: Policy[] = [
  {
    id: "1",
    name: "Executive Travel Policy",
    category: "travel",
    status: "active",
    description:
      "Comprehensive travel policy for executive-level employees including flight class, accommodation standards, and expense limits.",
    rules: [
      { id: "1", type: "booking_class", condition: "flight_class", value: "business", action: "allow" },
      { id: "2", type: "budget_limit", condition: "daily_accommodation", value: 500, action: "require_approval" },
    ],
    applicableRoles: ["Executive", "VP", "Director"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    createdBy: "Sarah Johnson",
    violations: 2,
    compliance: 98,
  },
  {
    id: "2",
    name: "Standard Employee Travel",
    category: "travel",
    status: "active",
    description:
      "Standard travel policy for regular employees with economy class flights and moderate accommodation limits.",
    rules: [
      { id: "3", type: "booking_class", condition: "flight_class", value: "economy", action: "allow" },
      { id: "4", type: "budget_limit", condition: "daily_accommodation", value: 200, action: "require_approval" },
    ],
    applicableRoles: ["Employee", "Manager"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    createdBy: "Mike Chen",
    violations: 5,
    compliance: 94,
  },
  {
    id: "3",
    name: "Expense Approval Workflow",
    category: "approval",
    status: "active",
    description: "Automated approval workflow for expenses based on amount and category.",
    rules: [{ id: "5", type: "approval_required", condition: "amount_over", value: 1000, action: "require_approval" }],
    applicableRoles: ["All"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-22",
    createdBy: "Lisa Wang",
    violations: 1,
    compliance: 99,
  },
]

const DocumentUploadZone = ({ onDocumentAnalyzed }: { onDocumentAnalyzed: (analysis: DocumentAnalysis) => void }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<DocumentAnalysis[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [ocrReady, setOcrReady] = useState(false)
  let ocrService: any = null
  useEffect(() => {
    // OCR now handled server-side in /api/ocr/process
    setOcrReady(true)
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsAnalyzing(true)
      setProcessingProgress(0)

      const form = new FormData()
      for (const [index, file] of acceptedFiles.entries()) {
        form.set("file", file)
        const res = await fetch("/api/ocr/process", { method: "POST", body: form })
        const analysis = await res.json()

        try {
          setProcessingProgress(((index + 0.5) / acceptedFiles.length) * 100)

          const analysis = await ocrService.processDocument(file)

          const documentAnalysis: DocumentAnalysis = {
            id: Math.random().toString(36).substr(2, 9),
            fileName: file.name,
            extractedText: analysis.text,
            detectedPolicyType: analysis.extractedData.policies?.length ? "travel" : "compliance",
            confidence: analysis.confidence,
            suggestedRules: [
              {
                id: "auto-1",
                type: "budget_limit",
                condition: "daily_accommodation",
                value: analysis.extractedData.budget || 300,
                action: "require_approval",
              },
              {
                id: "auto-2",
                type: "booking_class",
                condition: "flight_class",
                value: "economy",
                action: "allow",
              },
            ],
            companySize: analysis.extractedData.employeeCount
              ? analysis.extractedData.employeeCount > 500
                ? "enterprise"
                : analysis.extractedData.employeeCount > 50
                  ? "sme"
                  : "startup"
              : "sme",
            industry: analysis.extractedData.industry || "Technology",
            uploadedAt: new Date().toISOString(),
          }

          setAnalysisResults((prev) => [...prev, documentAnalysis])
          onDocumentAnalyzed(documentAnalysis)
          setProcessingProgress(((index + 1) / acceptedFiles.length) * 100)
        } catch (error) {
          console.error("Document processing failed:", error)
          // Fallback to mock data if OCR fails
          const mockAnalysis: DocumentAnalysis = {
            id: Math.random().toString(36).substr(2, 9),
            fileName: file.name,
            extractedText: "Document processing failed, using fallback analysis...",
            detectedPolicyType: "travel",
            confidence: 0.75,
            suggestedRules: [
              {
                id: "auto-1",
                type: "budget_limit",
                condition: "daily_accommodation",
                value: 300,
                action: "require_approval",
              },
            ],
            companySize: "sme",
            industry: "Technology",
            uploadedAt: new Date().toISOString(),
          }
          setAnalysisResults((prev) => [...prev, mockAnalysis])
          onDocumentAnalyzed(mockAnalysis)
        }
      }

      setIsAnalyzing(false)
      setProcessingProgress(0)
    },
    [onDocumentAnalyzed],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
  })

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium tracking-tighter text-black">AI Document Intelligence</h3>
            <p className="text-sm text-gray-600">Advanced OCR with multi-language support</p>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 scale-105"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.2 }}>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          </motion.div>
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2 font-medium">Drag & drop documents here, or click to select</p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX, XLS, XLSX, CSV, and images (PNG, JPG, GIF, BMP)
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Badge variant="outline" className="text-xs">
                  <Scan className="h-3 w-3 mr-1" />
                  OCR Powered
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Multi-Language
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Analysis
                </Badge>
              </div>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700 font-medium">Processing with advanced OCR...</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${processingProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Extracting text, analyzing structure, and generating policy recommendations...
            </p>
          </motion.div>
        )}

        {analysisResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-black">Analysis Results</h4>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                {analysisResults.length} processed
              </Badge>
            </div>
            {analysisResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <h5 className="font-medium text-sm">{result.fileName}</h5>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                      <span>Company: {result.companySize}</span>
                      <span>Industry: {result.industry}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">{result.detectedPolicyType}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <p className="text-xs font-medium text-gray-700">AI-Generated Policy Recommendations:</p>
                  </div>
                  {result.suggestedRules.map((rule) => (
                    <div key={rule.id} className="text-xs bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {rule.condition.replace(/_/g, " ").toUpperCase()}: {rule.value}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {rule.action.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {result.extractedText && (
                  <details className="mt-3">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                      View extracted text
                    </summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 max-h-32 overflow-y-auto">
                      {result.extractedText.substring(0, 500)}
                      {result.extractedText.length > 500 && "..."}
                    </div>
                  </details>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Card>
  )
}

const AIPolicyGenerator = () => {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPolicy, setGeneratedPolicy] = useState<Policy | null>(null)

  const generatePolicy = async () => {
    setIsGenerating(true)

    // Simulate AI policy generation
    setTimeout(() => {
      const mockPolicy: Policy = {
        id: Math.random().toString(36).substr(2, 9),
        name: "AI Generated Travel Policy",
        category: "travel",
        status: "draft",
        description: "Automatically generated policy based on your requirements",
        rules: [
          {
            id: "ai-1",
            type: "budget_limit",
            condition: "daily_accommodation",
            value: 250,
            action: "require_approval",
          },
          { id: "ai-2", type: "booking_class", condition: "flight_class", value: "economy", action: "allow" },
        ],
        applicableRoles: ["Employee", "Manager"],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        createdBy: "AI Assistant",
        violations: 0,
        compliance: 100,
      }

      setGeneratedPolicy(mockPolicy)
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium tracking-tighter text-black">AI Policy Generator</h3>
            <p className="text-sm text-gray-600">Describe your needs and get a custom policy</p>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Describe your company's travel policy needs... (e.g., 'Create a policy for a 500-person tech company with moderate budget constraints')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none"
          />

          <Button
            onClick={generatePolicy}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating Policy...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Generate Policy with AI
              </div>
            )}
          </Button>
        </div>

        {generatedPolicy && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Policy Generated Successfully</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{generatedPolicy.name}</h4>
              <p className="text-xs text-gray-600">{generatedPolicy.description}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Add to Policies
                </Button>
                <Button size="sm" variant="outline">
                  Edit Policy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function CreatePolicyForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    applicableRoles: [] as string[],
    rules: [] as PolicyRule[],
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Policy Name</Label>
          <Input
            placeholder="Enter policy name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Description</Label>
        <Textarea
          placeholder="Describe this policy..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-black hover:bg-gray-800 text-white">Create Policy</Button>
      </div>
    </div>
  )
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [documentAnalyses, setDocumentAnalyses] = useState<DocumentAnalysis[]>([])

  const handleDocumentAnalyzed = (analysis: DocumentAnalysis) => {
    setDocumentAnalyses((prev) => [...prev, analysis])
  }

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || policy.category === filterCategory
    const matchesStatus = filterStatus === "all" || policy.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "travel":
        return <Plane className="h-4 w-4" />
      case "expense":
        return <DollarSign className="h-4 w-4" />
      case "approval":
        return <CheckCircle className="h-4 w-4" />
      case "compliance":
        return <Shield className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalPolicies = policies.length
  const activePolicies = policies.filter((p) => p.status === "active").length
  const totalViolations = policies.reduce((sum, p) => sum + p.violations, 0)
  const avgCompliance = Math.round(policies.reduce((sum, p) => sum + p.compliance, 0) / policies.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-2">Travel Policies</h1>
              <p className="text-lg text-gray-600 font-light">
                AI-powered policy management with intelligent document analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Create Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Policy</DialogTitle>
                  </DialogHeader>
                  <CreatePolicyForm onClose={() => setIsCreateDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* AI-powered tools section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DocumentUploadZone onDocumentAnalyzed={handleDocumentAnalyzed} />
          <AIPolicyGenerator />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/80 backdrop-blur-sm p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Policies</p>
                  <p className="text-2xl font-medium tracking-tighter text-black">{totalPolicies}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Active Policies</p>
                  <p className="text-2xl font-medium tracking-tighter text-black">{activePolicies}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 backdrop-blur-sm p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Violations</p>
                  <p className="text-2xl font-medium tracking-tighter text-black">{totalViolations}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/80 backdrop-blur-sm p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Avg Compliance</p>
                  <p className="text-2xl font-medium tracking-tighter text-black">{avgCompliance}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPolicies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      {getCategoryIcon(policy.category)}
                    </div>
                    <div>
                      <h3 className="font-medium tracking-tighter text-black text-lg">{policy.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(policy.status)}`}>{policy.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 font-light mb-4 line-clamp-2">{policy.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Applicable Roles</span>
                    <span className="font-medium text-gray-700">{policy.applicableRoles.length} roles</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Compliance Rate</span>
                    <span className="font-medium text-emerald-600">{policy.compliance}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Violations</span>
                    <span className={`font-medium ${policy.violations > 0 ? "text-red-600" : "text-gray-700"}`}>
                      {policy.violations}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Updated {policy.updatedAt}</span>
                      <span>by {policy.createdBy}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm p-12 border border-gray-200 shadow-sm text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium tracking-tighter text-black mb-2">No policies found</h3>
            <p className="text-gray-600 font-light mb-6">
              No policies match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-black hover:bg-gray-800 text-white">
              Create Your First Policy
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
