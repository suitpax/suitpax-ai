"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MapPinIcon
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SearchAnalytics {
  popularRoutes: Array<{
    route: string
    searches: number
    avgPrice: number
    trend: 'up' | 'down' | 'stable'
  }>
  priceAlerts: Array<{
    route: string
    currentPrice: number
    targetPrice: number
    savings: number
  }>
  bestDays: Array<{
    day: string
    avgSavings: number
  }>
  searchTrends: {
    totalSearches: number
    avgSearchTime: number
    cacheHitRate: number
    popularFilters: string[]
  }
}

interface SearchAnalyticsProps {
  onRouteSelect?: (origin: string, destination: string) => void
  className?: string
}

export function SearchAnalytics({ onRouteSelect, className = "" }: SearchAnalyticsProps) {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Datos mock para demostración - en producción vendría de una API
  const mockAnalytics: SearchAnalytics = {
    popularRoutes: [
      { route: "JFK → LHR", searches: 1247, avgPrice: 654, trend: 'down' },
      { route: "LAX → NRT", searches: 983, avgPrice: 892, trend: 'up' },
      { route: "SFO → CDG", searches: 756, avgPrice: 723, trend: 'stable' },
      { route: "MIA → BCN", searches: 634, avgPrice: 445, trend: 'down' },
      { route: "ORD → FRA", searches: 567, avgPrice: 598, trend: 'up' }
    ],
    priceAlerts: [
      { route: "JFK → LHR", currentPrice: 654, targetPrice: 600, savings: 54 },
      { route: "LAX → NRT", currentPrice: 892, targetPrice: 800, savings: 92 },
      { route: "SFO → CDG", currentPrice: 723, targetPrice: 650, savings: 73 }
    ],
    bestDays: [
      { day: "Tuesday", avgSavings: 18 },
      { day: "Wednesday", avgSavings: 15 },
      { day: "Saturday", avgSavings: 12 },
      { day: "Thursday", avgSavings: 9 },
      { day: "Sunday", avgSavings: 6 }
    ],
    searchTrends: {
      totalSearches: 15420,
      avgSearchTime: 2.3,
      cacheHitRate: 34,
      popularFilters: ["Non-stop", "Morning departure", "Refundable", "Business class"]
    }
  }

  useEffect(() => {
    // Simular carga de analytics
    setLoading(true)
    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setLoading(false)
    }, 1000)
  }, [])

  const handleRouteClick = (route: string) => {
    const [origin, destination] = route.split(' → ')
    onRouteSelect?.(origin, destination)
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-3 w-3 text-red-500" />
      case 'down':
        return <ArrowTrendingDownIcon className="h-3 w-3 text-green-500" />
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
          <CardHeader className="pb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumen ejecutivo */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Flight Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-medium text-blue-900">
                {analytics.searchTrends.totalSearches.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">Total searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-blue-900">
                {analytics.searchTrends.avgSearchTime}s
              </div>
              <div className="text-xs text-blue-600">Avg search time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-blue-900">
                {analytics.searchTrends.cacheHitRate}%
              </div>
              <div className="text-xs text-blue-600">Cache hit rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-blue-900">
                {analytics.popularRoutes.length}
              </div>
              <div className="text-xs text-blue-600">Popular routes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rutas populares */}
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Popular Routes
              </div>
              <Badge variant="outline" className="bg-gray-50 rounded-xl">
                Last 7 days
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularRoutes.map((route, index) => (
                <motion.div
                  key={route.route}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleRouteClick(route.route)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {route.route}
                      </div>
                      <div className="text-xs text-gray-600">
                        {route.searches} searches
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${route.avgPrice}
                      </div>
                      <div className={`text-xs flex items-center ${getTrendColor(route.trend)}`}>
                        {getTrendIcon(route.trend)}
                        <span className="ml-1">
                          {route.trend === 'stable' ? 'stable' : route.trend === 'up' ? '+5%' : '-3%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas de precios */}
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Price Opportunities
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-xl">
                Save up to $92
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.priceAlerts.map((alert, index) => (
                <motion.div
                  key={alert.route}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {alert.route}
                    </div>
                    <div className="text-xs text-green-700">
                      Target: ${alert.targetPrice} (Save ${alert.savings})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${alert.currentPrice}
                    </div>
                    <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700 text-white mt-1">
                      Set Alert
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mejores días para volar */}
      <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Best Days to Fly
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Average savings
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {analytics.bestDays.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {day.day}
                </div>
                <div className="text-lg font-medium text-blue-600">
                  {day.avgSavings}%
                </div>
                <div className="text-xs text-gray-500">
                  savings
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros populares */}
      <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Popular Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.searchTrends.popularFilters.map((filter, index) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Badge 
                  variant="outline" 
                  className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 cursor-pointer rounded-xl"
                >
                  {filter}
                </Badge>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Search performance</span>
              <div className="flex items-center space-x-4">
                <span>
                  Avg time: <strong>{analytics.searchTrends.avgSearchTime}s</strong>
                </span>
                <span>
                  Cache rate: <strong>{analytics.searchTrends.cacheHitRate}%</strong>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
