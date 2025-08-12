"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  DollarSign,
  Plane,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Download,
  Upload,
  Eye,
  BarChart3,
} from "lucide-react"

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

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-2">Travel Policies</h1>
              <p className="text-lg text-gray-600 font-light">
                Manage and enforce company travel policies with intelligent automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Import
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

      {/* Stats Cards */}
      <div className="px-6 py-6">
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
                  <BarChart3 className="h-5 w-5 text-blue-600" />
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
                      <Edit3 className="h-4 w-4" />
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
          <label className="text-sm font-medium text-gray-700">Policy Name</label>
          <Input
            placeholder="Enter policy name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
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
        <label className="text-sm font-medium text-gray-700">Description</label>
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
