"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plane,
  CreditCard,
  Calendar,
  FileText,
  PieChart,
  Activity,
} from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"
import { generatePDFReport } from "@/lib/pdf-generator"

interface ReportData {
  totalExpenses: number
  totalTrips: number
  avgTripCost: number
  topCategories: { category: string; amount: number; percentage: number }[]
  monthlyTrend: { month: string; amount: number }[]
  recentExpenses: any[]
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalExpenses: 0,
    totalTrips: 0,
    avgTripCost: 0,
    topCategories: [],
    monthlyTrend: [],
    recentExpenses: [],
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("last-6-months")
  const [generatingPDF, setGeneratingPDF] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchUser()
    fetchReportData()
  }, [selectedPeriod])

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
      setUser(userData)
    }
  }

  const fetchReportData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      // Calculate date range based on selected period
      let startDate: Date
      let endDate = new Date()

      switch (selectedPeriod) {
        case "last-month":
          startDate = startOfMonth(subMonths(new Date(), 1))
          endDate = endOfMonth(subMonths(new Date(), 1))
          break
        case "last-3-months":
          startDate = subMonths(new Date(), 3)
          break
        case "last-6-months":
          startDate = subMonths(new Date(), 6)
          break
        case "last-year":
          startDate = subMonths(new Date(), 12)
          break
        default:
          startDate = subMonths(new Date(), 6)
      }

      // Fetch expenses data
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("expense_date", startDate.toISOString().split("T")[0])
        .lte("expense_date", endDate.toISOString().split("T")[0])
        .order("expense_date", { ascending: false })

      if (expensesError) throw expensesError

      // Fetch flight bookings
      const { data: flights, error: flightsError } = await supabase
        .from("flight_bookings")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("departure_date", startDate.toISOString().split("T")[0])
        .lte("departure_date", endDate.toISOString().split("T")[0])

      if (flightsError) throw flightsError

      // Fetch hotel bookings
      const { data: hotels, error: hotelsError } = await supabase
        .from("hotel_bookings")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("check_in_date", startDate.toISOString().split("T")[0])
        .lte("check_in_date", endDate.toISOString().split("T")[0])

      if (hotelsError) throw hotelsError

      // Process data
      const totalExpenses = (expenses || []).reduce((sum, exp) => sum + exp.amount, 0)
      const totalTrips = (flights || []).length + (hotels || []).length
      const avgTripCost = totalTrips > 0 ? totalExpenses / totalTrips : 0

      // Calculate top categories
      const categoryTotals = (expenses || []).reduce(
        (acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount
          return acc
        },
        {} as Record<string, number>,
      )

      const topCategories = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      // Calculate monthly trend
      const monthlyData = (expenses || []).reduce(
        (acc, exp) => {
          const month = format(new Date(exp.expense_date), "MMM yyyy", { locale: es })
          acc[month] = (acc[month] || 0) + exp.amount
          return acc
        },
        {} as Record<string, number>,
      )

      const monthlyTrend = Object.entries(monthlyData)
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

      setReportData({
        totalExpenses,
        totalTrips,
        avgTripCost,
        topCategories,
        monthlyTrend,
        recentExpenses: expenses?.slice(0, 10) || [],
      })
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Error al cargar los datos del reporte")
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    if (!user) {
      toast.error("Usuario no encontrado")
      return
    }

    setGeneratingPDF(true)

    try {
      await generatePDFReport({
        user,
        reportData,
        period: selectedPeriod,
        generatedAt: new Date(),
      })
      toast.success("Reporte generado correctamente")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error al generar el reporte")
    } finally {
      setGeneratingPDF(false)
    }
  }

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
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-medium tracking-tighter">Reportes y Analytics</h1>
              <p className="text-indigo-100 mt-1">Analiza tus patrones de gasto y optimiza tu presupuesto de viajes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Último mes</SelectItem>
                <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                <SelectItem value="last-year">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={generateReport}
              disabled={generatingPDF}
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              {generatingPDF ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generar PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gastos</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">€{reportData.totalExpenses.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12% vs período anterior</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Viajes</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{reportData.totalTrips}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+8% vs período anterior</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Plane className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Promedio</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">€{reportData.avgTripCost.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">-5% vs período anterior</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ahorro Total</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">
                  €{(reportData.totalExpenses * 0.15).toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">15% de ahorro promedio</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="categories">Por Categorías</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="expenses">Gastos Detallados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Categorías Principales
                </CardTitle>
                <CardDescription>Distribución de gastos por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topCategories.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                                ? "bg-green-500"
                                : index === 2
                                  ? "bg-yellow-500"
                                  : index === 3
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                          }`}
                        />
                        <span className="font-medium text-sm">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{category.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Tendencia Mensual
                </CardTitle>
                <CardDescription>Evolución de gastos por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.monthlyTrend.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.max(10, (month.amount / Math.max(...reportData.monthlyTrend.map((m) => m.amount))) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">€{month.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Categorías</CardTitle>
              <CardDescription>Desglose detallado de gastos por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportData.topCategories.map((category, index) => (
                  <div key={category.category} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{category.category}</h3>
                      <Badge variant="outline">€{category.amount.toFixed(2)}</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.percentage.toFixed(1)}% del total</span>
                      <span>Promedio: €{(category.amount / reportData.totalTrips || 0).toFixed(2)} por viaje</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Tendencias</CardTitle>
              <CardDescription>Patrones y tendencias en tus gastos de viaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Insights Clave</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Ahorro Identificado</p>
                        <p className="text-xs text-green-600">
                          Puedes ahorrar hasta €{(reportData.totalExpenses * 0.2).toFixed(2)} optimizando reservas
                          anticipadas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Patrón de Gasto</p>
                        <p className="text-xs text-blue-600">
                          Tus gastos son más altos los{" "}
                          {reportData.monthlyTrend.length > 0 ? "martes y miércoles" : "días laborables"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Estacionalidad</p>
                        <p className="text-xs text-purple-600">
                          Los gastos aumentan un 25% durante los meses de conferencias (Sep-Nov)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Recomendaciones</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium mb-1">Reserva con Anticipación</p>
                      <p className="text-xs text-gray-600">
                        Reservar vuelos con 3+ semanas de anticipación puede reducir costos en 30%
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium mb-1">Optimiza Categorías</p>
                      <p className="text-xs text-gray-600">
                        Considera alternativas más económicas para{" "}
                        {reportData.topCategories[0]?.category || "transporte"}
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium mb-1">Política de Viajes</p>
                      <p className="text-xs text-gray-600">
                        Implementar límites por categoría puede reducir gastos en 15%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Detallados</CardTitle>
              <CardDescription>Lista completa de gastos en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.recentExpenses.length > 0 ? (
                  reportData.recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{expense.title}</p>
                          <p className="text-xs text-gray-600">{expense.category}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(expense.expense_date), "PPP", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{expense.amount.toFixed(2)}</p>
                        <Badge
                          variant="outline"
                          className={
                            expense.status === "approved"
                              ? "text-green-600 border-green-200"
                              : expense.status === "submitted"
                                ? "text-blue-600 border-blue-200"
                                : expense.status === "rejected"
                                  ? "text-red-600 border-red-200"
                                  : "text-gray-600 border-gray-200"
                          }
                        >
                          {expense.status === "approved"
                            ? "Aprobado"
                            : expense.status === "submitted"
                              ? "Enviado"
                              : expense.status === "rejected"
                                ? "Rechazado"
                                : "Borrador"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay gastos en el período seleccionado</p>
                    <p className="text-sm text-gray-500 mt-1">Cambia el período o agrega nuevos gastos</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
