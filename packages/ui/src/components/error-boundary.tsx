"use client"

import React from "react"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 font-light mb-6">
              <em className="font-serif italic">We encountered an unexpected error. Please try refreshing the page.</em>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
