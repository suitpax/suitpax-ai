"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import {
  Plane,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface UserData {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  plan_type: string
  ai_tokens_used: number
  ai_tokens_limit: number
  travel_searches_used: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

interface UserProfile {
  user_id: string
  full_name: string | null
  company: string | null
  job_title: string | null
  phone: string | null
  travel_preferences: any
  created_at: string
  updated_at: string
}

const ONBOARDING_STEPS = [
  { id: 1, title: "Configurar perfil", completed: false },
  { id: 2, title: "Añadir información de empresa", completed: false },
  { id: 3, title: "Configurar preferencias de viaje", completed: false },
  { id: 4, title: "Conectar métodos de pago", completed: false },
]

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [onboardingSteps, setOnboardingSteps] = useState(ONBOARDING_STEPS)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchData()
  }, [])

  async function checkAuthAndFetchData() {
    try {
      setLoading(true)

      // Verificar autenticación
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        toast.error("Error de autenticación")
        router.push("/auth/login")
        return
      }

      if (!session) {
        console.log("No hay sesión activa")
        router.push("/auth/login")
        return
      }

      setAuthChecked(true)

      // Buscar usuario existente
      let { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (userError && userError.code === "PGRST116") {
        // Usuario nuevo - crear registro
        console.log("Creando nuevo usuario...")
        setIsNewUser(true)

        const newUserData = {
          id: session.user.id,
          email: session.user.email!,
          full_name: extractFullName(session.user),
          company_name: null,
          plan_type: "free",
          ai_tokens_used: 0,
          ai_tokens_limit: 5000,
          travel_searches_used: 0,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: createdUser, error: createError } = await supabase
          .from("users")
          .insert([newUserData])
          .select()
          .single()

        if (createError) {
          console.error("Error creando usuario:", createError)
          toast.error("Error al crear el perfil de usuario")
          return
        }

        userData = createdUser
        toast.success("¡Bienvenido a Suitpax! 🎉")
      } else if (userError) {
        console.error("Error obteniendo usuario:", userError)
        toast.error("Error al cargar datos del usuario")
        return
      }

      if (userData) {
        setUser(userData)

        // Obtener perfil adicional si existe
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profileData) {
          setUserProfile(profileData)
          updateOnboardingProgress(userData, profileData)
        } else {
          updateOnboardingProgress(userData, null)
        }
      }
    } catch (error) {
      console.error("Error en checkAuthAndFetchData:", error)
      toast.error("Error al cargar el dashboard")
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  function extractFullName(user: any): string | null {
    return user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || null
  }

  function updateOnboardingProgress(userData: UserData, profileData: UserProfile | null) {
    const steps = [...ONBOARDING_STEPS]

    // Paso 1: Perfil básico
    if (userData.full_name) {
      steps[0].completed = true
    }

    // Paso 2: Información de empresa
    if (userData.company_name || profileData?.company) {
      steps[1].completed = true
    }

    // Paso 3: Preferencias de viaje
    if (profileData?.travel_preferences) {
      steps[2].completed = true
    }

    // Paso 4: Métodos de pago (simulado)
    if (userData.plan_type !== "free") {
      steps[3].completed = true
    }

    setOnboardingSteps(steps)
  }

  const getUserDisplayName = (): string => {
    if (user?.full_name) {
      return user.full_name.split(" ")[0]
    }
    if (userProfile?.full_name) {
      return userProfile.full_name.split(" ")[0]
    }
    return "Usuario"
  }

  const getCompanyName = (): string => {
    return user?.company_name || userProfile?.company || "Tu Empresa"
  }

  const getCompletedSteps = (): number => {
    return onboardingSteps.filter((step) => step.completed).length
  }

  const getProgressPercentage = (): number => {
    return (getCompletedSteps() / onboardingSteps.length) * 100
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-gray-600 font-light">Cargando tu dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Verificando autenticación y datos</p>
        </div>
      </div>
    )
  }

  // Auth error state
  if (!authChecked || !user) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-medium tracking-tighter mb-4">Acceso Restringido</h3>
        <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
          No tienes permisos para acceder a esta área. Por favor, inicia sesión para continuar.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header personalizado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-black leading-none mb-2">
            {isNewUser ? (
              <>
                <em className="font-serif italic">¡Bienvenido a Suitpax!</em>
              </>
            ) : (
              <>
                <em className="font-serif italic">Hola,</em> {getUserDisplayName()}
              </>
            )}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <Building2 className="h-5 w-5 text-gray-500" />
            <p className="text-gray-600 font-light text-lg">
              {getCompanyName()} • Plan {user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1)}
            </p>
            {isNewUser && (
              <span className="inline-flex items-center rounded-xl bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Cuenta Nueva
              </span>
            )}
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              <Clock className="h-3 w-3 mr-1" />
              Miembro desde {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="border-gray-200 bg-white/50 backdrop-blur-sm">
            <Link href="/dashboard/ai-chat">
              <Sparkles className="h-4 w-4 mr-2" />
              Asistente IA
            </Link>
          </Button>
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/dashboard/flights">
              Reservar Vuelo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Onboarding Progress - Solo para usuarios nuevos o incompletos */}
      {(!user.onboarding_completed || getCompletedSteps() < 4) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium tracking-tighter text-gray-900">
                <em className="font-serif italic">Configuración de Cuenta</em>
              </h3>
              <p className="text-sm text-gray-600 font-light">Completa tu perfil para aprovechar al máximo Suitpax</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{getCompletedSteps()}/4</div>
              <div className="text-xs text-gray-500">Completado</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 p-2 rounded-lg ${step.completed ? "bg-green-100" : "bg-white/50"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    step.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {step.completed && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-xs font-medium ${step.completed ? "text-green-700" : "text-gray-600"}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Tokens IA Usados</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">
                {user.ai_tokens_used.toLocaleString()}
              </p>
              <p className="text-xs font-light text-gray-500">de {user.ai_tokens_limit.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Búsquedas de Viajes</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">{user.travel_searches_used}</p>
              <p className="text-xs font-light text-gray-500">este mes</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Próximos Viajes</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">0</p>
              <p className="text-xs font-light text-gray-500">próximos 30 días</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-700">Ahorros</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900">$0</p>
              <p className="text-xs font-light text-gray-500">este mes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Estado Cero - Contenido principal para usuarios nuevos */}
      {isNewUser || user.travel_searches_used === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-medium tracking-tighter text-gray-900 mb-4">
                <em className="font-serif italic">¡Comienza tu viaje!</em>
              </h3>
              <p className="text-gray-600 font-light mb-6">
                Bienvenido a la plataforma de viajes empresariales más avanzada. Comienza explorando nuestras
                funcionalidades principales.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                  <Link href="/dashboard/ai-chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Hablar con IA Assistant
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/flights">
                    <Plane className="h-4 w-4 mr-2" />
                    Buscar tu primer vuelo
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Setup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-medium tracking-tighter text-gray-900 mb-6">
              <em className="font-serif italic">Configuración Rápida</em>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Completar perfil</p>
                    <p className="text-xs text-gray-500">Añade tu información personal</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/profile">Configurar</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Información de empresa</p>
                    <p className="text-xs text-gray-500">Configura políticas de viaje</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Próximamente
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Métodos de pago</p>
                    <p className="text-xs text-gray-500">Conecta tarjetas corporativas</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Próximamente
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        // Contenido para usuarios existentes con actividad
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Actividad Reciente */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
              <em className="font-serif italic">Actividad Reciente</em>
            </h3>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No hay actividad reciente</p>
              <p className="text-sm font-light">Comienza reservando tu primer viaje o chateando con la IA.</p>
            </div>
          </motion.div>

          {/* Próximos Viajes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
              <em className="font-serif italic">Próximos Viajes</em>
            </h3>
            <div className="text-center py-8 text-gray-500">
              <Plane className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No tienes viajes programados</p>
              <p className="text-sm font-light mb-4">Planifica tu próximo viaje de negocios con nuestra IA.</p>
              <Button asChild size="sm" className="bg-black text-white hover:bg-gray-800">
                <Link href="/dashboard/flights">Planificar Viaje</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-6">
          <em className="font-serif italic">Acciones Rápidas</em>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/flights"
            className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
          >
            <Plane className="h-8 w-8 text-gray-600 mb-3 group-hover:text-black transition-colors" />
            <span className="text-sm font-medium text-gray-900">Reservar Vuelo</span>
            <span className="text-xs text-gray-500 mt-1">Búsqueda inteligente</span>
          </Link>

          <Link
            href="/dashboard/ai-chat"
            className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
          >
            <MessageSquare className="h-8 w-8 text-gray-600 mb-3 group-hover:text-black transition-colors" />
            <span className="text-sm font-medium text-gray-900">Asistente IA</span>
            <span className="text-xs text-gray-500 mt-1">Chat inteligente</span>
          </Link>

          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl opacity-50 cursor-not-allowed">
            <CreditCard className="h-8 w-8 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-500">Gastos</span>
            <span className="text-xs text-gray-400 mt-1">Próximamente</span>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
          >
            <User className="h-8 w-8 text-gray-600 mb-3 group-hover:text-black transition-colors" />
            <span className="text-sm font-medium text-gray-900">Perfil</span>
            <span className="text-xs text-gray-500 mt-1">Configuración</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
