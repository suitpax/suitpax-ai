"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit3, Save, X } from "lucide-react"

interface Rule {
  id: string
  name: string
  condition: "contains" | "starts_with" | "ends_with" | "equals"
  value: string
  category: string
  enabled: boolean
}

const CATEGORIES = [
  "Transportation",
  "Accommodation",
  "Meals",
  "Entertainment",
  "Office Supplies",
  "Software",
  "Marketing",
  "Other",
]

export function AutoCategorizationSettings() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      name: "Hotel Bookings",
      condition: "contains",
      value: "hotel",
      category: "Accommodation",
      enabled: true,
    },
    {
      id: "2",
      name: "Flight Bookings",
      condition: "contains",
      value: "flight",
      category: "Transportation",
      enabled: true,
    },
    {
      id: "3",
      name: "Restaurant Meals",
      condition: "contains",
      value: "restaurant",
      category: "Meals",
      enabled: true,
    },
  ])

  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "contains" as const,
    value: "",
    category: "",
  })
  const [isAddingRule, setIsAddingRule] = useState(false)

  const handleToggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const handleEditRule = (id: string) => {
    setEditingRule(id)
  }

  const handleSaveRule = (id: string, updatedRule: Partial<Rule>) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, ...updatedRule } : rule)))
    setEditingRule(null)
  }

  const handleAddRule = () => {
    if (newRule.name && newRule.value && newRule.category) {
      const rule: Rule = {
        id: Date.now().toString(),
        ...newRule,
        enabled: true,
      }
      setRules([...rules, rule])
      setNewRule({ name: "", condition: "contains", value: "", category: "" })
      setIsAddingRule(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium tracking-tighter text-black">Auto-Categorization Rules</h3>
            <p className="text-sm text-gray-600 mt-1">Set up rules to automatically categorize your transactions</p>
          </div>
          <Button
            onClick={() => setIsAddingRule(true)}
            className="bg-black text-white hover:bg-gray-800 rounded-xl"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>

        {/* Add New Rule Form */}
        {isAddingRule && (
          <Card className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rule Name</label>
                  <Input
                    placeholder="e.g., Hotel Bookings"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <Select
                    value={newRule.category}
                    onValueChange={(value) => setNewRule({ ...newRule, category: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Condition</label>
                  <Select
                    value={newRule.condition}
                    onValueChange={(value: any) => setNewRule({ ...newRule, condition: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="starts_with">Starts with</SelectItem>
                      <SelectItem value="ends_with">Ends with</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Value</label>
                  <Input
                    placeholder="e.g., hotel"
                    value={newRule.value}
                    onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    className="rounded-xl border-gray-200"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={handleAddRule} className="bg-black text-white hover:bg-gray-800 rounded-xl" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Rule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingRule(false)
                    setNewRule({ name: "", condition: "contains", value: "", category: "" })
                  }}
                  className="rounded-xl"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-4 border border-gray-200 rounded-xl">
              {editingRule === rule.id ? (
                <EditRuleForm
                  rule={rule}
                  onSave={(updatedRule) => handleSaveRule(rule.id, updatedRule)}
                  onCancel={() => setEditingRule(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                    <div>
                      <h4 className="font-medium text-black">{rule.name}</h4>
                      <p className="text-sm text-gray-600">
                        If description <span className="font-medium">{rule.condition.replace("_", " ")}</span> "
                        <span className="font-medium">{rule.value}</span>" → categorize as{" "}
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                          {rule.category}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule.id)} className="rounded-xl">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No categorization rules set up yet.</p>
            <p className="text-sm text-gray-400 mt-1">Add your first rule to get started.</p>
          </div>
        )}
      </div>
    </Card>
  )
}

function EditRuleForm({
  rule,
  onSave,
  onCancel,
}: {
  rule: Rule
  onSave: (rule: Partial<Rule>) => void
  onCancel: () => void
}) {
  const [editedRule, setEditedRule] = useState({
    name: rule.name,
    condition: rule.condition,
    value: rule.value,
    category: rule.category,
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Rule Name</label>
          <Input
            value={editedRule.name}
            onChange={(e) => setEditedRule({ ...editedRule, name: e.target.value })}
            className="rounded-xl border-gray-200"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
          <Select
            value={editedRule.category}
            onValueChange={(value) => setEditedRule({ ...editedRule, category: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Condition</label>
          <Select
            value={editedRule.condition}
            onValueChange={(value: any) => setEditedRule({ ...editedRule, condition: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="starts_with">Starts with</SelectItem>
              <SelectItem value="ends_with">Ends with</SelectItem>
              <SelectItem value="equals">Equals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Value</label>
          <Input
            value={editedRule.value}
            onChange={(e) => setEditedRule({ ...editedRule, value: e.target.value })}
            className="rounded-xl border-gray-200"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          onClick={() => onSave(editedRule)}
          className="bg-black text-white hover:bg-gray-800 rounded-xl"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="rounded-xl bg-transparent" size="sm">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
