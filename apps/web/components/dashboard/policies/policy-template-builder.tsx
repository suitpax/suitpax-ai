"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Copy, Download, Upload } from "lucide-react"

interface PolicyRule {
  id: string
  type: "budget" | "approval" | "restriction" | "preference"
  condition: string
  action: string
  value: string | number
  enabled: boolean
}

interface PolicyTemplate {
  id: string
  name: string
  description: string
  category: "travel" | "expense" | "accommodation" | "transport"
  rules: PolicyRule[]
  applicableRoles: string[]
  priority: number
}

export function PolicyTemplateBuilder() {
  const [template, setTemplate] = useState<PolicyTemplate>({
    id: "",
    name: "",
    description: "",
    category: "travel",
    rules: [],
    applicableRoles: [],
    priority: 1,
  })

  const [newRule, setNewRule] = useState<Partial<PolicyRule>>({
    type: "budget",
    condition: "",
    action: "",
    value: "",
    enabled: true,
  })

  const addRule = () => {
    if (newRule.condition && newRule.action) {
      const rule: PolicyRule = {
        id: Date.now().toString(),
        type: newRule.type || "budget",
        condition: newRule.condition,
        action: newRule.action,
        value: newRule.value || "",
        enabled: newRule.enabled || true,
      }

      setTemplate((prev) => ({
        ...prev,
        rules: [...prev.rules, rule],
      }))

      setNewRule({
        type: "budget",
        condition: "",
        action: "",
        value: "",
        enabled: true,
      })
    }
  }

  const removeRule = (ruleId: string) => {
    setTemplate((prev) => ({
      ...prev,
      rules: prev.rules.filter((rule) => rule.id !== ruleId),
    }))
  }

  const toggleRule = (ruleId: string) => {
    setTemplate((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    }))
  }

  const predefinedTemplates = [
    {
      name: "Startup Travel Policy",
      description: "Flexible policy for small teams with budget constraints",
      rules: [
        { type: "budget", condition: "Flight cost", action: "Must be under", value: "$800" },
        { type: "approval", condition: "Trip duration > 3 days", action: "Requires manager approval", value: "" },
        { type: "preference", condition: "Accommodation", action: "Prefer", value: "3-star hotels or Airbnb" },
      ],
    },
    {
      name: "Enterprise Travel Policy",
      description: "Comprehensive policy for large organizations",
      rules: [
        { type: "budget", condition: "Daily meal allowance", action: "Maximum", value: "$75" },
        { type: "approval", condition: "International travel", action: "Requires VP approval", value: "" },
        { type: "restriction", condition: "Booking window", action: "Must book", value: "14 days in advance" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Policy Template Builder
          </CardTitle>
          <CardDescription>Create custom travel policies with intelligent rules and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Policy Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g., Executive Travel Policy"
                    value={template.name}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Select
                    value={template.category}
                    onValueChange={(value: any) => setTemplate((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Describe the purpose and scope of this policy..."
                  value={template.description}
                  onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Priority Slider */}
              <div className="space-y-2">
                <Label>Priority Level: {template.priority}</Label>
                <Slider
                  value={[template.priority]}
                  onValueChange={([value]) => setTemplate((prev) => ({ ...prev, priority: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Low Priority</span>
                  <span>High Priority</span>
                </div>
              </div>

              {/* Rule Builder */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Policy Rules</h3>

                {/* Add New Rule */}
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select
                        value={newRule.type}
                        onValueChange={(value: any) => setNewRule((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget Limit</SelectItem>
                          <SelectItem value="approval">Approval Required</SelectItem>
                          <SelectItem value="restriction">Restriction</SelectItem>
                          <SelectItem value="preference">Preference</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Condition (e.g., Flight cost)"
                        value={newRule.condition}
                        onChange={(e) => setNewRule((prev) => ({ ...prev, condition: e.target.value }))}
                      />

                      <Input
                        placeholder="Action (e.g., Must be under)"
                        value={newRule.action}
                        onChange={(e) => setNewRule((prev) => ({ ...prev, action: e.target.value }))}
                      />

                      <div className="flex gap-2">
                        <Input
                          placeholder="Value"
                          value={newRule.value}
                          onChange={(e) => setNewRule((prev) => ({ ...prev, value: e.target.value }))}
                        />
                        <Button onClick={addRule} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Existing Rules */}
                <div className="space-y-2">
                  {template.rules.map((rule) => (
                    <Card key={rule.id} className={`${!rule.enabled ? "opacity-50" : ""}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                            <Badge
                              variant={
                                rule.type === "budget"
                                  ? "default"
                                  : rule.type === "approval"
                                    ? "secondary"
                                    : rule.type === "restriction"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {rule.type}
                            </Badge>
                            <span className="text-sm">
                              <strong>{rule.condition}</strong> {rule.action} {rule.value}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedTemplates.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Sample Rules:</p>
                        {template.rules.slice(0, 2).map((rule, ruleIndex) => (
                          <div key={ruleIndex} className="text-xs text-gray-600">
                            • {rule.condition} {rule.action} {rule.value}
                          </div>
                        ))}
                        {template.rules.length > 2 && (
                          <div className="text-xs text-gray-500">+{template.rules.length - 2} more rules</div>
                        )}
                      </div>
                      <Button className="w-full mt-4 bg-transparent" variant="outline">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{template.name || "Untitled Policy"}</CardTitle>
                  <CardDescription>{template.description || "No description provided"}</CardDescription>
                  <div className="flex gap-2">
                    <Badge>{template.category}</Badge>
                    <Badge variant="outline">Priority: {template.priority}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Policy Rules ({template.rules.length})</h4>
                    {template.rules.length === 0 ? (
                      <p className="text-gray-500 text-sm">No rules defined yet</p>
                    ) : (
                      template.rules.map((rule, index) => (
                        <div key={rule.id} className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-gray-400">{index + 1}.</span>
                          <Badge size="sm" variant={rule.enabled ? "default" : "secondary"}>
                            {rule.type}
                          </Badge>
                          <span>
                            {rule.condition} {rule.action} {rule.value}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
