"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CreditCard,
  CalendarIcon,
  Plus,
  Filter,
  Download,
  Upload,
  Receipt,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useDropzone } from "react-dropzone"

interface Expense {
  id: string
  title: string
  description: string
  amount: number
  category: string
  expense_date: string
  status: "draft" | "submitted" | "approved" | "rejected"
  receipt_url?: string
  created_at: string
  updated_at: string
}

interface ExpenseForm {
  title: string
  description: string
  amount: string
  category: string
  expense_date: Date | undefined
  receipt: File | null
}

const EXPENSE_CATEGORIES = [
  "Transporte",
  "Alojamiento",
  "Comidas",
  "Combustible",
  "Parking",
  "Conferencias",
  "Material de oficina",
  "Otros",
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    title: "",
    description: "",
    amount: "",
    category: "",
    expense_date: undefined,
    receipt: null,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchUser()
    fetchExpenses()
  }, [])

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
      setUser(userData)
    }
  }

  const fetchExpenses = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setExpenses(data || [])
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
      toast.error("Error al cargar los gastos")
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setExpenseForm((prev) => ({ ...prev, receipt: acceptedFiles[0] }))
        toast.success("Recibo cargado correctamente")
      }
    },
  })

  const submitExpense = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión")
      return
    }

    if (!expenseForm.title || !expenseForm.amount || !expenseForm.category || !expenseForm.expense_date) {
      toast.error("Por favor, completa todos los campos obligatorios")
      return
    }

    setSubmitting(true)

    try {
      let receipt_url = null

      // Upload receipt if provided
      if (expenseForm.receipt) {
        const fileExt = expenseForm.receipt.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(fileName, expenseForm.receipt)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("receipts").getPublicUrl(fileName)

        receipt_url = publicUrl
      }

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        title: expenseForm.title,
        description: expenseForm.description,
        amount: Number.parseFloat(expenseForm.amount),
        category: expenseForm.category,
        expense_date: expenseForm.expense_date.toISOString().split("T")[0],
        receipt_url,
        status: "submitted",
      })

      if (error) throw error

      toast.success("Gasto enviado correctamente")
      setIsDialogOpen(false)
      setExpenseForm({
        title: "",
        description: "",
        amount: "",
        category: "",
        expense_date: undefined,
        receipt: null,
      })
      fetchExpenses()
    } catch (error) {
      console.error("Error submitting expense:", error)
      toast.error("Error al enviar el gasto")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-600">
            Borrador
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Enviado
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Aprobado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            Rechazado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />
      case "submitted":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const approvedExpenses = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = expenses.filter((e) => e.status === "submitted").length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-medium tracking-tighter">Gestión de Gastos</h1>
              <p className="text-purple-100 mt-1">Administra y controla tus gastos de viaje</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
                <DialogDescription>
                  Completa la información del gasto y adjunta el recibo si es necesario.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Taxi al aeropuerto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalles adicionales del gasto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Importe *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => setExpenseForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fecha del gasto *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expenseForm.expense_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expenseForm.expense_date ? (
                          format(expenseForm.expense_date, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expenseForm.expense_date}
                        onSelect={(date) => setExpenseForm((prev) => ({ ...prev, expense_date: date }))}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Recibo (opcional)</Label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                      isDragActive ? "border-purple-400 bg-purple-50" : "border-gray-300 hover:border-gray-400",
                    )}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    {expenseForm.receipt ? (
                      <p className="text-sm text-green-600 font-medium">{expenseForm.receipt.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          {isDragActive ? "Suelta el archivo aquí" : "Arrastra un archivo o haz clic para seleccionar"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG o PDF (máx. 10MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={submitExpense} disabled={submitting}>
                    {submitting ? "Enviando..." : "Enviar Gasto"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gastos</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">€{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobados</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">€{approvedExpenses.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pendientes</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{pendingExpenses}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="submitted">Enviados</TabsTrigger>
            <TabsTrigger value="approved">Aprobados</TabsTrigger>
            <TabsTrigger value="rejected">Rechazados</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <Card key={expense.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                        {getStatusIcon(expense.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium tracking-tighter">{expense.title}</h3>
                          {getStatusBadge(expense.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{expense.category}</span>
                          <span>•</span>
                          <span>{format(new Date(expense.expense_date), "PPP", { locale: es })}</span>
                          {expense.receipt_url && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Receipt className="h-3 w-3" />
                                Con recibo
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium">€{expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{format(new Date(expense.created_at), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-700 mb-2">No hay gastos registrados</h3>
                <p className="text-sm text-gray-500 mb-4">Comienza agregando tu primer gasto de viaje</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Gasto
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted">
          <div className="space-y-4">
            {expenses
              .filter((e) => e.status === "submitted")
              .map((expense) => (
                <Card key={expense.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{expense.title}</h3>
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              Enviado
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{format(new Date(expense.expense_date), "PPP", { locale: es })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">€{expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Pendiente de aprobación</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-4">
            {expenses
              .filter((e) => e.status === "approved")
              .map((expense) => (
                <Card key={expense.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{expense.title}</h3>
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Aprobado
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{format(new Date(expense.expense_date), "PPP", { locale: es })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-green-600">€{expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Listo para reembolso</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-4">
            {expenses
              .filter((e) => e.status === "rejected")
              .map((expense) => (
                <Card key={expense.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-red-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{expense.title}</h3>
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              Rechazado
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{format(new Date(expense.expense_date), "PPP", { locale: es })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-red-600">€{expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Requiere revisión</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
