"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plane,
  Hotel,
  CreditCard,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { LoadingSkeleton } from "@/components/ui/loading-state"

interface DashboardStats {
  totalTrips: number
  totalSavings: number
  upcomingTrips: number
  activeBookings: number
}

interface RecentActivity {
  id: string
  type: "flight" | "hotel" | "expense" | "approval"
  title: string
  description: string
  timestamp: Date
  status: "completed" | "pending" | "cancelled"
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalSavings: 0,
    upcomingTrips: 0,
    activeBookings: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Error getting user:", error)
          return
        }

        if (user) {
          setUser(user)

          // Check if user is new (created in the last 24 hours)
          const userCreatedAt = new Date(user.created_at)
          const now = new Date()
          const hoursDiff = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60)
          setIsNewUser(hoursDiff < 24)

          // Load user-specific data
          await loadDashboardData(user.id, hoursDiff < 24)
        }
      } catch (error) {
        console.error("Error in getUser:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [])

  const loadDashboardData = async (userId: string, isNew: boolean) => {
    try {
      if (isNew) {
        // New user - show welcome data
        setStats({
          totalTrips: 0,
          totalSavings: 0,
          upcomingTrips: 0,
          activeBookings: 0,
        })
        setRecentActivity([
          {
            id: "1",
            type: "approval",
            title: "¡Bienvenido a Suitpax!",
            description: "Tu cuenta ha sido creada exitosamente",
            timestamp: new Date(),
            status: "completed",
          },
        ])
      } else {
        // Existing user - show realistic data
        setStats({
          totalTrips: Math.floor(Math.random() * 50) + 10,
          totalSavings: Math.floor(Math.random() * 10000) + 2000,
          upcomingTrips: Math.floor(Math.random() * 5) + 1,
          activeBookings: Math.floor(Math.random() * 3) + 1,
        })

        // Generate realistic recent activity
        const activities: RecentActivity[] = [
          {
            id: "1",
            type: "flight",
            title: "Vuelo a San Francisco",
            description: "Salida SFO confirmada para mañana",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: "completed",
          },
          {
            id: "2",
            type: "hotel",
            title: "Reserva de Hotel Confirmada",
            description: "Hilton San Francisco Union Square",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            status: "completed",
          },
          {
            id: "3",
            type: "expense",
            title: "Reporte de Gastos Enviado",
            description: "Gastos de Viaje Q4",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: "pending",
          },
        ]
        setRecentActivity(activities)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const quickActions = [
    {
      icon: Plane,
      title: "Reservar Vuelo",
      description: "Encuentra y reserva vuelos de negocios",
      href: "/dashboard/flights",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: Hotel,
      title: "Reservar Hotel",
      description: "Reserva alojamientos",
      href: "/dashboard/hotels",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: CreditCard,
      title: "Gastos",
      description: "Gestiona gastos de viaje",
      href: "/dashboard/expenses",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      icon: BarChart3,
      title: "Reportes",
      description: "Ver analíticas de viaje",
      href: "/dashboard/reports",
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center lg:text-left"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none">
                {isNewUser ? (
                  <>
                    <em className="font-serif italic text-gray-600">Bienvenido a</em>
                    <br />
                    <span className="text-black">Suitpax</span>
                  </>
                ) : (
                  <>
                    <em className="font-serif italic text-gray-600">Bienvenido de vuelta,</em>
                    <br />
                    <span className="text-black">
                      {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Viajero"}
                    </span>
                  </>
                )}
              </h1>
              <p className="text-lg font-light text-gray-600 mt-4 max-w-2xl">
                {isNewUser
                  ? "Comencemos con la gestión de tus viajes de negocios"
                  : "Aquí tienes tu resumen de viajes para hoy"}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                <em className="font-serif italic">Dashboard</em>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New User Onboarding */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium tracking-tighter mb-2">Comienza con Suitpax</h3>
                  <p className="text-sm font-light text-gray-600 mb-6">
                    Completa estos pasos para desbloquear todo el poder de la gestión de viajes impulsada por IA.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
                    >
                      <CheckCircle className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Completar Perfil</p>
                        <p className="text-xs text-gray-500">Configura tu información</p>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/ai-chat"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
                    >
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Probar IA</p>
                        <p className="text-xs text-gray-500">Chatea con Suitpax AI</p>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/flights"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
                    >
                      <Plus className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Primer Viaje</p>
                        <p className="text-xs text-gray-500">Reserva tu primer vuelo</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Viajes</p>
                <p className="text-3xl font-medium tracking-tighter mt-2">{stats.totalTrips}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Plane className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ahorros Totales</p>
                <p className="text-3xl font-medium tracking-tighter mt-2">${stats.totalSavings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Próximos Viajes</p>
                <p className="text-3xl font-medium tracking-tighter mt-2">{stats.upcomingTrips}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas Activas</p>
                <p className="text-3xl font-medium tracking-tighter mt-2">{stats.activeBookings}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Acciones Rápidas</em>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm bg-white"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${action.color}`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium tracking-tighter group-hover:text-gray-900 transition-colors mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm font-light text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Actividad Reciente</em>
              </h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.status === "completed"
                            ? "bg-emerald-50 border border-emerald-200"
                            : activity.status === "pending"
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-red-50 border border-red-200"
                        }`}
                      >
                        {activity.status === "completed" && <CheckCircle className="h-5 w-5 text-emerald-700" />}
                        {activity.status === "pending" && <Clock className="h-5 w-5 text-yellow-700" />}
                        {activity.status === "cancelled" && <AlertCircle className="h-5 w-5 text-red-700" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm tracking-tighter">{activity.title}</p>
                        <p className="text-xs font-light text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {activity.timestamp.toLocaleDateString()} a las{" "}
                          {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-600">Sin actividad reciente</p>
                    <p className="text-xs text-gray-500 mt-1">Tu actividad de viaje aparecerá aquí</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Assistant CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-medium tracking-tighter mb-2">
                  <em className="font-serif italic">¿Necesitas Ayuda?</em>
                </h3>
                <p className="font-light text-white/80 max-w-lg">
                  Chatea con Suitpax AI, tu asistente de viajes inteligente, para ayuda instantánea con reservas y
                  preguntas de viaje.
                </p>
              </div>
              <Link
                href="/dashboard/ai-chat"
                className="bg-white text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <em className="font-serif italic">Chatear con Suitpax AI</em>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
