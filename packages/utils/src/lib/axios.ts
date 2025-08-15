import axios from "axios"
import toast from "react-hot-toast"

// Crear instancia de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí puedes añadir tokens de autenticación si es necesario
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Manejo global de errores
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status
      const message = error.response.data?.message || error.message

      switch (status) {
        case 400:
          toast.error("Solicitud incorrecta: " + message)
          break
        case 401:
          toast.error("No autorizado. Por favor, inicia sesión.")
          // Redirigir al login si es necesario
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login"
          }
          break
        case 403:
          toast.error("Acceso denegado")
          break
        case 404:
          toast.error("Recurso no encontrado")
          break
        case 429:
          toast.error("Demasiadas solicitudes. Intenta más tarde.")
          break
        case 500:
          toast.error("Error interno del servidor")
          break
        default:
          toast.error("Error: " + message)
      }
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      toast.error("Error de conexión. Verifica tu internet.")
    } else {
      // Algo pasó al configurar la solicitud
      toast.error("Error inesperado: " + error.message)
    }

    return Promise.reject(error)
  },
)

export default api
