"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  CalendarIcon,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Search,
  Filter,
  SortAsc,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function HotelsPage() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")
  const [guests, setGuests] = useState("1")
  const [rooms, setRooms] = useState("1")

  // Mock data for demonstration
  const hotelStats = [
    { label: "Total Bookings", value: "0", change: "+0%" },
    { label: "Avg. Nightly Rate", value: "$0", change: "+0%" },
    { label: "Total Spent", value: "$0", change: "+0%" },
    { label: "Nights Stayed", value: "0", change: "+0%" },
  ]

  const recentBookings = []
  const savedHotels = []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hotels</h1>
          <p className="text-sm text-gray-600 mt-1">Search and book hotels for your business trips</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Building2 className="h-4 w-4 mr-2" />
          Book Hotel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotelStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-xs text-gray-500">{stat.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Hotels
          </CardTitle>
          <CardDescription>Find the perfect accommodation for your business trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="destination"
                  placeholder="City, hotel, or landmark"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="space-y-2">
              <Label>Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label>Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests & Rooms */}
            <div className="space-y-2">
              <Label>Guests & Rooms</Label>
              <div className="flex gap-2">
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Room{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4 mr-2" />
              Search Hotels
            </Button>
            <Button variant="outline" className="sm:w-auto bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="sm:w-auto bg-transparent">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest hotel reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start by searching for hotels in your destination</p>
                <Button variant="outline">Search Hotels</Button>
              </div>
            ) : (
              <div className="space-y-4">{/* Booking items would go here */}</div>
            )}
          </CardContent>
        </Card>

        {/* Saved Hotels */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Hotels</CardTitle>
            <CardDescription>Your favorite accommodations</CardDescription>
          </CardHeader>
          <CardContent>
            {savedHotels.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved hotels</h3>
                <p className="text-gray-600 mb-4">Save hotels you like for quick booking later</p>
                <Button variant="outline">Browse Hotels</Button>
              </div>
            ) : (
              <div className="space-y-4">{/* Saved hotel items would go here */}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hotel Amenities Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Hotel Amenities</CardTitle>
          <CardDescription>Common amenities you'll find in search results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Free WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-green-500" />
              <span className="text-sm">Parking</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-amber-500" />
              <span className="text-sm">Breakfast</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-red-500" />
              <span className="text-sm">Fitness Center</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
