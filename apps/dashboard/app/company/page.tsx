"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

export default function CompanyPage() {
  const [isConfigured, setIsConfigured] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    size: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
  })

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSaving(false)
    setShowSuccess(true)
    setIsConfigured(true)

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none">Company</h1>
            <p className="text-gray-600 font-light mt-1">Manage your company profile and settings</p>
          </div>
          {isConfigured && (
            <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Profile Complete</span>
            </div>
          )}
        </div>
      </motion.div>

      {!isConfigured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-2">
                Company Profile Setup Required
              </h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Complete your company profile to unlock advanced features and team management capabilities. Once
                configured, changes require contacting Suitpax support.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Team management</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Advanced reporting</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Policy enforcement</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Company profile saved successfully!</p>
              <p className="text-xs text-green-700">Your settings have been updated and are now active.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">
                    Company Information
                  </CardTitle>
                  <p className="text-xs text-gray-500 font-light">Basic company details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-xs font-medium text-gray-600">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  className="rounded-xl border-gray-200 bg-white/80"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-xs font-medium text-gray-600">
                    Industry
                  </Label>
                  <Select
                    value={companyData.industry}
                    onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 bg-white/80">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size" className="text-xs font-medium text-gray-600">
                    Company Size
                  </Label>
                  <Select
                    value={companyData.size}
                    onValueChange={(value) => setCompanyData({ ...companyData, size: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 bg-white/80">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">
                    Contact Information
                  </CardTitle>
                  <p className="text-xs text-gray-500 font-light">Communication details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-medium text-gray-600">
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter company address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  className="rounded-xl border-gray-200 bg-white/80 resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-gray-600">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    className="rounded-xl border-gray-200 bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-gray-600">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    className="rounded-xl border-gray-200 bg-white/80"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-xs font-medium text-gray-600">
                  Website
                </Label>
                <Input
                  id="website"
                  placeholder="https://company.com"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  className="rounded-xl border-gray-200 bg-white/80"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">
                  Company Description
                </CardTitle>
                <p className="text-xs text-gray-500 font-light">Tell us about your business</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe your company's mission, values, and business focus..."
              value={companyData.description}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              rows={4}
              className="rounded-xl border-gray-200 bg-white/80 resize-none"
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-8 py-2.5 font-medium tracking-tighter"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Company Profile
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
