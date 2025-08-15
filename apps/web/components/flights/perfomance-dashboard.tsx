"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ChartBarIcon,
  ClockIcon,
  ServerIcon,
  LightningBoltIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSmartCache } from "@/lib/cache-manager"

interface PerformanceMetrics {
  cacheStats: {
    hitRate: number
    size: number
    hits: number
    misses: number
    averageAccessTime: number
  }
  apiStats: {
    averageResponseTime: number
    successRate: number
    totalRequests: number
    errorRate: number
  }
  systemHealth: {
    status: 'healthy' | 'warning' | 'error'
    uptime: number
    lastUpdated: string
  }
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { getStats, getInfo, clear } = useSmartCache()

  useEffect(() => {
    // Solo mostrar en desarrollo o para admins
    const isDev = process.env.NODE_ENV === 'development'
    const isAdmin = localStorage.getItem('user_role') === 'admin'
    
    if (isDev || isAdmin) {
      setIsVisible(true)
      updateMetrics()
      
      const interval = setInterval(updateMetrics, 5000) // Actualizar cada 5 segundos
      return () => clearInterval(interval)
    }
  }, [])

  const updateMetrics = () => {
    const cacheStats = getStats()
    const cacheInfo = getInfo()
    
    // Simular métricas de API - en producción vendría de monitoring real
    const mockApiStats = {
      averageResponseTime: Math.random() * 1000 + 500, // 500-1500ms
      successRate: 95 + Math.random() * 5, // 95-100%
      totalRequests: 1250 + Math.floor(Math.random() * 100),
      errorRate: Math.random() * 2 // 0-2%
    }

    const systemHealth = {
      status: cacheStats.hitRate > 30 && mockApiStats.successRate > 90 ? 'healthy' as const :
               cacheStats.hitRate > 15 && mockApiStats.successRate > 80 ? 'warning' as const : 'error' as const,
      uptime: Date.now() - (Date.now() - Math.random() * 86400000), // Simular uptime
      lastUpdated: new Date().toISOString()
    }

    setMetrics({
      cacheStats: {
        ...cacheStats,
        averageAccessTime: cacheStats.averageAccessTime || Math.random() * 10
      },
      apiStats: mockApiStats,
      systemHealth
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'warning':
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      default:
        return <ServerIcon className="h-4 w-4" />
    }
  }

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m ${seconds % 60}s`
  }

  if (!isVisible || !metrics) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <CpuChipIcon className="h-4 w-4 mr-2" />
              Performance Monitor
            </div>
            <Badge className={`text-xs ${getStatusColor(metrics.systemHealth.status)}`}>
              {getStatusIcon(metrics.systemHealth.status)}
              <span className="ml-1 capitalize">{metrics.systemHealth.status}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Cache Performance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Cache Performance</span>
              <span className="font-medium">
                {metrics.cacheStats.hitRate.toFixed(1)}% hit rate
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, metrics.cacheStats.hitRate)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{metrics.cacheStats.hits} hits</span>
              <span>{metrics.cacheStats.misses} misses</span>
              <span>{metrics.cacheStats.size} cached</span>
            </div>
          </div>

          {/* API Performance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">API Performance</span>
              <span className="font-medium">
                {metrics.apiStats.averageResponseTime.toFixed(0)}ms avg
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="font-medium text-green-600">
                  {metrics.apiStats.successRate.toFixed(1)}%
                </div>
                <div className="text-gray-500">Success</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="font-medium text-gray-900">
                  {metrics.apiStats.totalRequests}
                </div>
                <div className="text-gray-500">Requests</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">System Health</span>
              <span className="font-medium">
                {formatUptime(metrics.systemHealth.uptime)} uptime
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <GlobeAltIcon className="h-3 w-3 text-blue-500" />
                <span>Duffel API</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-1">
                <ServerIcon className="h-3 w-3 text-gray-500" />
                <span>Cache</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Updated: {new Date(metrics.systemHealth.lastUpdated).toLocaleTimeString()}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={clear}
                className="text-xs px-2 py-1 h-auto"
              >
                Clear Cache
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={updateMetrics}
                className="text-xs px-2 py-1 h-auto"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
