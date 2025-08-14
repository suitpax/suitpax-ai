"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  UserPlus,
  TrendingUp,
  Briefcase,
  Network,
  Send,
  Plus,
  Search,
  Eye,
  MessageSquare,
  HandHeart,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SoftHero from "@/components/ui/soft-hero"

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Travel Manager",
    email: "sarah.chen@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Operations",
    joinDate: "2024-01-15",
    permissions: ["Book Flights", "Approve Expenses", "Manage Team"],
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Finance Director",
    email: "m.rodriguez@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Finance",
    joinDate: "2023-11-20",
    permissions: ["Approve Budgets", "View Reports", "Manage Policies"],
    status: "active",
    lastActive: "1 day ago",
  },
]

const investorOpportunities = [
  {
    id: 1,
    company: "TechFlow Solutions",
    industry: "SaaS",
    stage: "Series A",
    seeking: "$2.5M",
    valuation: "$15M",
    description: "AI-powered workflow automation for enterprise clients",
    location: "San Francisco, CA",
    founded: "2022",
    employees: "25-50",
    revenue: "$500K ARR",
    growth: "+180% YoY",
    logo: "/placeholder.svg?height=60&width=60",
    tags: ["AI", "Enterprise", "SaaS"],
    contact: "investors@techflow.com",
  },
  {
    id: 2,
    company: "GreenEnergy Dynamics",
    industry: "CleanTech",
    stage: "Seed",
    seeking: "$1.2M",
    valuation: "$8M",
    description: "Smart grid optimization using machine learning",
    location: "Austin, TX",
    founded: "2023",
    employees: "10-25",
    revenue: "Pre-revenue",
    growth: "Pilot customers",
    logo: "/placeholder.svg?height=60&width=60",
    tags: ["CleanTech", "ML", "Energy"],
    contact: "funding@greenenergy.com",
  },
  {
    id: 3,
    company: "HealthTech Innovations",
    industry: "HealthTech",
    stage: "Series B",
    seeking: "$8M",
    valuation: "$45M",
    description: "Telemedicine platform with AI diagnostics",
    location: "Boston, MA",
    founded: "2021",
    employees: "100-200",
    revenue: "$2.1M ARR",
    growth: "+250% YoY",
    logo: "/placeholder.svg?height=60&width=60",
    tags: ["HealthTech", "AI", "Telemedicine"],
    contact: "investors@healthtech.com",
  },
]

const networkConnections = [
  {
    id: 1,
    name: "David Park",
    title: "Managing Partner",
    company: "Venture Capital Partners",
    location: "New York, NY",
    avatar: "/placeholder.svg?height=40&width=40",
    expertise: ["SaaS", "Fintech", "AI"],
    portfolio: "50+ investments",
    status: "connected",
  },
  {
    id: 2,
    name: "Lisa Thompson",
    title: "Angel Investor",
    company: "Independent",
    location: "Silicon Valley, CA",
    avatar: "/placeholder.svg?height=40&width=40",
    expertise: ["CleanTech", "Hardware", "IoT"],
    portfolio: "25+ investments",
    status: "pending",
  },
  {
    id: 3,
    name: "Robert Kim",
    title: "Investment Director",
    company: "Growth Equity Fund",
    location: "London, UK",
    avatar: "/placeholder.svg?height=40&width=40",
    expertise: ["HealthTech", "EdTech", "Enterprise"],
    portfolio: "30+ investments",
    status: "suggested",
  },
]

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState("team")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")

  const filteredOpportunities = investorOpportunities.filter((opp) => {
    const matchesSearch =
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.industry.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || opp.industry.toLowerCase() === selectedIndustry.toLowerCase()
    return matchesSearch && matchesIndustry
  })

  return (
    <div className="min-h-screen p-0">
      <SoftHero
        eyebrow="Teams"
        title={<span>Create real-time collaboration without complexity</span>}
        description="Manage members, investors, and network with a calm, focused UI."
        primaryCta={{ label: "Invite member" }}
        secondaryCta={{ label: "Learn more" }}
        className="pb-2"
      />
      <div className="px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2 text-gray-900">
              Business Network
            </h1>
            <p className="text-gray-600 font-light">
              <em className="font-serif italic">Connect with teams, investors, and business opportunities worldwide</em>
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Send an invitation to join your business travel team</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="colleague@company.com" className="rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Team Member</SelectItem>
                        <SelectItem value="manager">Travel Manager</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Join our team to streamline business travel..."
                      className="rounded-xl"
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
                  <p className="text-3xl font-semibold text-gray-900">{teamMembers.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Network Connections</p>
                  <p className="text-3xl font-semibold text-gray-900">{networkConnections.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Network className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Investment Opportunities</p>
                  <p className="text-3xl font-semibold text-gray-900">{investorOpportunities.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Deals</p>
                  <p className="text-3xl font-semibold text-gray-900">2</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <HandHeart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        </div>
      </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-6">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="team" className="rounded-lg">
              Team Members
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="rounded-lg">
              Investment Opportunities
            </TabsTrigger>
            <TabsTrigger value="network" className="rounded-lg">
              Network
            </TabsTrigger>
            <TabsTrigger value="deals" className="rounded-lg">
              Active Deals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">
                            {member.role} • {member.department}
                          </p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 mb-2">{member.status}</Badge>
                        <p className="text-xs text-gray-500">Last active: {member.lastActive}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs rounded-lg">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search companies, industries, or stages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-gray-300"
                  />
                </div>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-48 rounded-xl">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="cleantech">CleanTech</SelectItem>
                    <SelectItem value="healthtech">HealthTech</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Investment Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {filteredOpportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={opportunity.logo || "/placeholder.svg"} alt={opportunity.company} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {opportunity.company
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{opportunity.company}</h3>
                          <p className="text-sm text-gray-600">
                            {opportunity.industry} • {opportunity.location}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 rounded-lg">{opportunity.stage}</Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{opportunity.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Seeking</p>
                        <p className="text-lg font-semibold text-gray-900">{opportunity.seeking}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Valuation</p>
                        <p className="text-lg font-semibold text-gray-900">{opportunity.valuation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="text-sm font-medium text-gray-700">{opportunity.revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Growth</p>
                        <p className="text-sm font-medium text-green-600">{opportunity.growth}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs rounded-lg">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {networkConnections.map((connection) => (
                <Card
                  key={connection.id}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {connection.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
                          <p className="text-sm text-gray-600">{connection.title}</p>
                          <p className="text-sm text-gray-600">
                            {connection.company} • {connection.location}
                          </p>
                          <p className="text-xs text-gray-500">{connection.portfolio}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`mb-2 ${
                            connection.status === "connected"
                              ? "bg-green-100 text-green-800"
                              : connection.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {connection.status}
                        </Badge>
                        <div className="flex gap-2">
                          {connection.status === "suggested" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                              Connect
                            </Button>
                          )}
                          {connection.status === "connected" && (
                            <Button size="sm" variant="outline" className="rounded-lg bg-transparent">
                              Message
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {connection.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs rounded-lg">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-12"
            >
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Active Investment Deals</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Track your ongoing investment negotiations and due diligence processes
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Start New Deal
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
