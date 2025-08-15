"use client"

import { useCallback } from "react"
import toast from "react-hot-toast"

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  redirectOnAuth?: boolean
}

export function useErrorHandler() {
  const handleError = useCallback((error: any, options: ErrorHandlerOptions = {}) => {
    const { showToast = true, logError = true, redirectOnAuth = true } = options

    // Log del error
    if (logError) {
      console.error("Error handled:", error)
    }

    // Determinar el mensaje de error
    let message = "Ha ocurrido un error inesperado"

    if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.message) {
      message = error.message
    }

    // Mostrar toast si está habilitado
    if (showToast) {
      toast.error(message)
    }

    // Manejar errores de autenticación
    if (error?.response?.status === 401 && redirectOnAuth) {
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 1500)
    }

    return message
  }, [])

  const handleSuccess = useCallback((message = "Operación exitosa") => {
    toast.success(message)
  }, [])

  const handleLoading = useCallback((message = "Cargando...") => {
    return toast.loading(message)
  }, [])

  const dismissToast = useCallback((toastId: string) => {
    toast.dismiss(toastId)
  }, [])

  return {
    handleError,
    handleSuccess,
    handleLoading,
    dismissToast,
  }
}
