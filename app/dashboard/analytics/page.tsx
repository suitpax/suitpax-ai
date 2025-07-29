"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Plane,
  Hotel,
  CreditCard,
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart,
  Users,
  MapPin,
} from "lucide-react"

interface AnalyticsData {
  totalSpent: number
  budgetUsed: number
  savingsAchieved: number
  tripEfficiency: number
  topDestinations: { city: string; trips: number; amount: number }[]
  spendingByCategory: { category: string; amount: number; percentage: number }[]
  monthlyTrend: { month: string; spent: number; budget: number }[]
  teamPerformance: { member: string; trips: number; spent: number; savings: number }[]
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSpent: 0,
    budgetUsed: 0,
    savingsAchieved: 0,
    tripEfficiency: 0,
    topDestinations: [],
    spendingByCategory: [],
    monthlyTrend: [],
    teamPerformance: [],
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("last-6-months")
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchUser()
    fetchAnalyticsData()
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

  const fetchAnalyticsData = async () => {
    try {
      // Simulate analytics data - in a real app, this would come from your database
      const mockData: AnalyticsData = {
        totalSpent: 45750,
        budgetUsed: 68.5,
        savingsAchieved: 12350,
        tripEfficiency: 87.2,
        topDestinations: [
          { city: "Madrid", trips: 12, amount: 8500 },
          { city: "Barcelona", trips: 8, amount: 6200 },
          { city: "Londres", trips: 6, amount: 9800 },
          { city: "París", trips: 5, amount: 7300 },
          { city: "Berlín", trips: 4, amount: 5200 },
        ],
        spendingByCategory: [
          { category: "Vuelos", amount: 18500, percentage: 40.4 },
          { category: "Hoteles", amount: 15200, percentage: 33.2 },
          { category: "Comidas", amount: 6800, percentage: 14.9 },
          { category: "Transporte", amount: 3450, percentage: 7.5 },
          { category: "Otros", amount: 1800, percentage: 3.9 },
        ],
        monthlyTrend: [
          { month: "Ago 2024", spent: 6200, budget: 8000 },
          { month: "Sep 2024", spent: 7800, budget: 8500 },
          { month: "Oct 2024", spent: 8200, budget: 9000 },
          { month: "Nov 2024", spent: 7600, budget: 8500 },
          { month: "Dec 2024", spent: 9100, budget: 10000 },
          { month: "Ene 2025", spent: 6850, budget: 8000 },
        ],
        teamPerformance: [
          { member: "Ana García", trips: 8, spent: 12500, savings: 2800 },
          { member: "Carlos Rodríguez", trips: 6, spent: 9800, savings: 2100 },
          { member: "María López", trips: 5, spent: 8200, savings: 1900 },
          { member: "Juan Martín", trips: 4, spent: 6500, savings: 1500 },
        ],
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage < 50) return { color: "text-green-600", bg: "bg-green-50", label: "Excelente" }
    if (percentage < 75) return { color: "text-yellow-600", bg: "bg-yellow-50", label: "Moderado" }
    if (percentage < 90) return { color: "text-orange-600", bg: "bg-orange-50", label: "Alto" }
    return { color: "text-red-600", bg: "bg-red-50", label: "Crítico" }
  }

  const budgetStatus = getBudgetStatus(analyticsData.budgetUsed)

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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-medium tracking-tighter">Analytics Avanzados</h1>
              <p className="text-purple-100 mt-1">Insights profundos sobre tus patrones de viaje y gastos</p>
            </div>
          </div>
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
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gastado</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">
                  €{analyticsData.totalSpent.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+8% vs período anterior</span>
                </div>
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Uso de Presupuesto</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{analyticsData.budgetUsed}%</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${budgetStatus.bg.replace("bg-", "bg-")}`}></div>
                  <span className={`text-xs ${budgetStatus.color}`}>{budgetStatus.label}</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ahorro Logrado</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">
                  €{analyticsData.savingsAchieved.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">21% de ahorro total</span>
                </div>
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eficiencia de Viajes</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{analyticsData.tripEfficiency}%</p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">Excelente rendimiento</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="destinations">Destinos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Spending by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Gastos
                </CardTitle>
                <CardDescription>Gastos por categoría en el período seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.spendingByCategory.map((category, index) => (
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
                        <p className="font-medium">€{category.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{category.percentage}%</p>
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
                  <LineChart className="h-5 w-5" />
                  Tendencia vs Presupuesto
                </CardTitle>
                <CardDescription>Comparación mensual de gastos reales vs presupuesto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.monthlyTrend.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-gray-600">
                          €{month.spent.toLocaleString()} / €{month.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="relative h-2 rounded-full">
                          <div className="bg-gray-300 h-2 rounded-full absolute" style={{ width: "100%" }} />
                          <div
                            className={`h-2 rounded-full absolute ${
                              month.spent > month.budget ? "bg-red-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(100, (month.spent / month.budget) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{((month.spent / month.budget) * 100).toFixed(1)}% del presupuesto</span>
                        <span className={month.spent > month.budget ? "text-red-600" : "text-green-600"}>
                          {month.spent > month.budget ? "Excedido" : "Dentro del presupuesto"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="destinations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Análisis de Destinos
              </CardTitle>
              <CardDescription>Destinos más visitados y su impacto en el presupuesto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.topDestinations.map((destination, index) => (
                  <div key={destination.city} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{destination.city}</h3>
                          <p className="text-sm text-gray-600">{destination.trips} viajes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{destination.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          €{Math.round(destination.amount / destination.trips).toLocaleString()} promedio
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(destination.amount / Math.max(...analyticsData.topDestinations.map((d) => d.amount))) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>
                        Frecuencia:{" "}
                        {(
                          (destination.trips / analyticsData.topDestinations.reduce((sum, d) => sum + d.trips, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                      <span>ROI estimado: {Math.round(Math.random() * 20 + 80)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado por Categorías</CardTitle>
              <CardDescription>Desglose profundo de gastos y oportunidades de optimización</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.spendingByCategory.map((category, index) => (
                  <div key={category.category} className="border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                          {category.category === "Vuelos" && <Plane className="h-5 w-5 text-blue-600" />}
                          {category.category === "Hoteles" && <Hotel className="h-5 w-5 text-green-600" />}
                          {category.category === "Comidas" && <CreditCard className="h-5 w-5 text-orange-600" />}
                          {category.category === "Transporte" && <Calendar className="h-5 w-5 text-purple-600" />}
                          {category.category === "Otros" && <Activity className="h-5 w-5 text-gray-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{category.category}</h3>
                          <p className="text-sm text-gray-600">{category.percentage}% del total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-medium">€{category.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">-5% vs anterior</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 mb-1">Promedio mensual</p>
                        <p className="font-medium">€{Math.round(category.amount / 6).toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 mb-1">Ahorro potencial</p>
                        <p className="font-medium text-green-600">
                          €{Math.round(category.amount * 0.15).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 mb-1">Eficiencia</p>
                        <p className="font-medium">{Math.round(85 + Math.random() * 10)}%</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Recomendación</p>
                      <p className="text-xs text-blue-700">
                        {category.category === "Vuelos" &&
                          "Reserva con 3+ semanas de anticipación para ahorrar hasta 30%"}
                        {category.category === "Hoteles" &&
                          "Considera hoteles corporativos para obtener tarifas preferenciales"}
                        {category.category === "Comidas" &&
                          "Establece límites diarios para controlar gastos de alimentación"}
                        {category.category === "Transporte" && "Utiliza transporte público cuando sea posible"}
                        {category.category === "Otros" && "Revisa gastos misceláneos para identificar patrones"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patrones Estacionales</CardTitle>
                <CardDescription>Identificación de tendencias por época del año</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Q4 2024 (Oct-Dec)</h4>
                      <Badge className="bg-red-100 text-red-800">Temporada Alta</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Incremento del 35% en gastos debido a conferencias y eventos de fin de año
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Q1 2025 (Ene-Mar)</h4>
                      <Badge className="bg-green-100 text-green-800">Temporada Baja</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Reducción del 20% en gastos, ideal para viajes de planificación
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Q2-Q3 2025 (Abr-Sep)</h4>
                      <Badge className="bg-blue-100 text-blue-800">Temporada Media</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Gastos estables, mejor época para negociaciones con proveedores
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predicciones y Recomendaciones</CardTitle>
                <CardDescription>Insights basados en IA para optimizar futuros gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Oportunidad de Ahorro</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Cambiar las reservas de último minuto por planificación anticipada puede ahorrar €8,500
                          anuales
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Optimización de Rutas</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Consolidar viajes a Madrid y Barcelona en la misma semana reduciría costos en 25%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-800">Meta de Eficiencia</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Con las optimizaciones sugeridas, puedes alcanzar 92% de eficiencia en Q2 2025
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-800">Planificación Estratégica</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Programa reuniones importantes en Q1 para aprovechar tarifas más bajas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Rendimiento del Equipo
              </CardTitle>
              <CardDescription>Análisis comparativo del desempeño de cada miembro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.teamPerformance.map((member, index) => (
                  <div key={member.member} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{member.member}</h3>
                          <p className="text-sm text-gray-600">{member.trips} viajes realizados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{member.spent.toLocaleString()}</p>
                        <p className="text-xs text-green-600">€{member.savings.toLocaleString()} ahorrado</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Promedio/Viaje</p>
                        <p className="font-medium">€{Math.round(member.spent / member.trips).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Eficiencia</p>
                        <p className="font-medium">{Math.round(85 + Math.random() * 10)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Ahorro %</p>
                        <p className="font-medium text-green-600">
                          {Math.round((member.savings / member.spent) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(member.spent / Math.max(...analyticsData.teamPerformance.map((m) => m.spent))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
