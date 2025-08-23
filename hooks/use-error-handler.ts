"use client"

import { useCallback } from "react"
import { dismissToast, showError, showLoading, showToast } from "@/lib/toast"

export function useErrorHandler() {
  const handleError = useCallback((message = "Something went wrong") => {
    showError(message)
  }, [])

  const handleSuccess = useCallback((message = "Operation successful") => {
    showToast(message)
  }, [])

  const handleLoading = useCallback((message = "Loading…") => {
    return showLoading(message)
  }, [])

  const handleDismiss = useCallback((toastId?: string) => {
    dismissToast(toastId)
  }, [])

  return {
    handleError,
    handleSuccess,
    handleLoading,
    handleDismiss,
  }
}
