"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plane, Sparkles, TrendingUp, Globe, Calendar, ArrowRight } from "lucide-react"
import { AirportSearch } from "@/components/flights/airport-search"
import { PerformanceDashboard } from "@/components/flights/perfomance-dashboard"

export default function FlightsPage() {
  const [searchType, setSearchType] = useState("roundtrip")
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-black p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-gray-600/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-white/80">AI-Powered Business Travel</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-none mb-4">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse">
                Smart Business
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]">
                Flight Solutions
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Revolutionize your corporate travel with AI-driven insights, real-time pricing, and seamless booking
              experiences.
              <span className="text-blue-400 font-medium"> Powered by advanced algorithms</span> that understand your
              business needs.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white">30% Cost Savings</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">500+ Airlines</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white">AI Optimization</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-green-100">
                <Badge className="bg-green-500 text-white rounded-lg">Live</Badge>
              </div>
              <span className="text-lg font-semibold tracking-tight">Real-Time Pricing</span>
            </div>
            <p className="text-sm text-gray-600">Updated every minute with the latest fares and availability</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <Badge variant="outline" className="border-blue-200 text-blue-800 rounded-lg">
                  Enterprise
                </Badge>
              </div>
              <span className="text-lg font-semibold tracking-tight">Premium Routes</span>
            </div>
            <p className="text-sm text-gray-600">Access to exclusive business class deals and corporate rates</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-purple-100">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-lg font-semibold tracking-tight">AI Insights</span>
            </div>
            <p className="text-sm text-gray-600">Smart recommendations based on your travel patterns</p>
          </div>
        </div>

        <Card className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl tracking-tighter">Search Business Flights</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse rounded-lg">
                Live Pricing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="roundtrip" className="rounded-lg">
                  Round Trip
                </TabsTrigger>
                <TabsTrigger value="oneway" className="rounded-lg">
                  One Way
                </TabsTrigger>
                <TabsTrigger value="multicity" className="rounded-lg">
                  Multi-City
                </TabsTrigger>
              </TabsList>

              <TabsContent value={searchType} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <AirportSearch placeholder="Departure city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <AirportSearch placeholder="Destination city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departure">Departure</Label>
                    <div className="relative">
                      <Input type="date" className="rounded-xl" />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {searchType === "roundtrip" && (
                    <div className="space-y-2">
                      <Label htmlFor="return">Return</Label>
                      <div className="relative">
                        <Input type="date" className="rounded-xl" />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4+ Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={travelClass} onValueChange={setTravelClass}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Search className="h-4 w-4 mr-2" />
                      Search Flights
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <PerformanceDashboard />

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
