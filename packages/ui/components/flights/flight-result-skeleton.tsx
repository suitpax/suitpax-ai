"use client"

import { Card, CardContent } from "@/components/ui/card"

interface FlightResultsSkeletonProps {
  count?: number
}

export function FlightResultsSkeleton({ count = 3 }: FlightResultsSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Flight slice skeleton */}
              <div className="space-y-4">
                {/* Route overview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    {/* Origin */}
                    <div className="text-center">
                      <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded mb-1"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>

                    {/* Flight path */}
                    <div className="flex-1 px-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="w-full h-px bg-gray-200 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-3 w-12 bg-gray-200 rounded mt-1"></div>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="text-center">
                      <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded mb-1"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Flight details */}
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Bottom section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="h-8 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SearchResultsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <FlightResultsSkeleton count={4} />
    </div>
  )
}
