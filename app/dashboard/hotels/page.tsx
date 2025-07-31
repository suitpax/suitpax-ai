"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  BuildingOffice2Icon,
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockHotels = [
  {
    id: 1,
    name: "Hilton London Metropole",
    location: "London, UK",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    nights: 3,
    pricePerNight: 180,
    totalPrice: 540,
    status: "confirmed",
    rating: 4.5,
    amenities: ["WiFi", "Gym", "Restaurant", "Business Center"],
    image: "/images/hilton-london.jpg",
    bookingRef: "HL-2024-001",
  },
  {
    id: 2,
    name: "Marriott Times Square",
    location: "New York, USA",
    checkIn: "2024-04-10",
    checkOut: "2024-04-12",
    nights: 2,
    pricePerNight: 320,
    totalPrice: 640,
    status: "pending",
    rating: 4.7,
    amenities: ["WiFi", "Spa", "Restaurant", "Concierge"],
    image: "/images/marriott-ny.jpg",
    bookingRef: "MR-2024-002",
  },
]

export default function HotelsPage() {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [formData, setFormData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    rooms: "1",
    budget: "",
    preferences: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Hotel booking submitted:", formData)
    setShowBookingForm(false)
    setFormData({
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: "1",
      rooms: "1",
      budget: "",
      preferences: "",
    })
  }

  const filteredHotels = mockHotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || hotel.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const totalSpent = mockHotels.reduce((sum, hotel) => sum + hotel.totalPrice, 0)
  const upcomingBookings = mockHotels.filter((hotel) => new Date(hotel.checkIn) > new Date()).length
  const avgNightlyRate = mockHotels.reduce((sum, hotel) => sum + hotel.pricePerNight, 0) / mockHotels.length

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No hotel bookings found</h3>
      <p className="text-gray-500 mb-6 text-sm">
        {searchQuery || selectedStatus !== "all"
          ? "Try adjusting your filters or search terms."
          : "Get started by booking your first business hotel stay."}
      </p>
      {!searchQuery && selectedStatus === "all" && (
        <Button onClick={() => setShowBookingForm(true)} className="bg-black text-white hover:bg-gray-800">
          <PlusIcon className="h-4 w-4 mr-2" />
          Book Hotel
        </Button>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-0 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none mb-2">Hotels</h1>
          <p className="text-gray-600 font-light text-sm">Manage your business hotel bookings and accommodations</p>
        </div>
        <Button onClick={() => setShowBookingForm(true)} className="bg-black text-white hover:bg-gray-800">
          <PlusIcon className="h-4 w-4 mr-2" />
          Book Hotel
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-medium tracking-tighter">${totalSpent.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">+8% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Stays</p>
                <p className="text-2xl font-medium tracking-tighter">{upcomingBookings}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">Next 30 days</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Nightly Rate</p>
                <p className="text-2xl font-medium tracking-tighter">${Math.round(avgNightlyRate)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">Per night average</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="all">All Bookings</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </motion.div>

      {/* Booking Form */}
      {showBookingForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium tracking-tighter">Book New Hotel</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="Enter city or hotel name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <select
                      id="guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="rooms">Rooms</Label>
                    <select
                      id="rooms"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget per Night ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="preferences">Special Preferences</Label>
                    <Input
                      id="preferences"
                      value={formData.preferences}
                      onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                      placeholder="High floor, quiet room, near business district..."
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                  Search Hotels
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Hotels List */}
      {filteredHotels.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tighter">
              {searchQuery || selectedStatus !== "all" ? "Filtered Bookings" : "Recent Bookings"}
            </h2>
            <Badge className="bg-gray-200 text-gray-700 border-gray-200">
              {filteredHotels.length} booking{filteredHotels.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                          <BuildingOffice2Icon className="h-8 w-8 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {hotel.location}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {hotel.checkIn} - {hotel.checkOut}
                            </span>
                            <span>{hotel.nights} nights</span>
                            <span>Ref: {hotel.bookingRef}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
                              {hotel.amenities.slice(0, 2).join(", ")}
                            </Badge>
                            {hotel.amenities.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{hotel.amenities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-medium">${hotel.totalPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">${hotel.pricePerNight}/night</div>
                          <Badge
                            className={`text-xs mt-1 ${
                              hotel.status === "confirmed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : hotel.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
