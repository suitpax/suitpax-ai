"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, MapPin, Calendar, DollarSign, Plane, Building, Car } from "lucide-react"

interface Trip {
  id: string
  title: string
  description?: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  status: "planned" | "active" | "completed" | "cancelled"
  expenses?: Array<{
    id: string
    amount: number
    category: string
  }>
}

export function TripPlanner() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingTrip, setIsAddingTrip] = useState(false)

  const [newTrip, setNewTrip] = useState({
    title: "",
    description: "",
    destination: "",
    start_date: "",
    end_date: "",
    budget: "",
  })

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      // Mock data for demo
      const mockTrips: Trip[] = [
        {
          id: "1",
          title: "NYC Business Conference",
          description: "Annual tech conference and client meetings",
          destination: "New York, NY",
          start_date: "2024-02-15",
          end_date: "2024-02-18",
          budget: 2500.0,
          status: "planned",
          expenses: [
            { id: "1", amount: 450, category: "flight" },
            { id: "2", amount: 720, category: "hotel" },
          ],
        },
        {
          id: "2",
          title: "London Client Visit",
          description: "Meeting with European partners",
          destination: "London, UK",
          start_date: "2024-03-10",
          end_date: "2024-03-14",
          budget: 3200.0,
          status: "planned",
          expenses: [],
        },
        {
          id: "3",
          title: "San Francisco Product Launch",
          description: "Product launch event and team meetings",
          destination: "San Francisco, CA",
          start_date: "2024-01-20",
          end_date: "2024-01-23",
          budget: 1800.0,
          status: "completed",
          expenses: [
            { id: "3", amount: 380, category: "flight" },
            { id: "4", amount: 640, category: "hotel" },
            { id: "5", amount: 250, category: "meals" },
          ],
        },
      ]
      setTrips(mockTrips)
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTrip = async () => {
    try {
      const trip: Trip = {
        id: Date.now().toString(),
        title: newTrip.title,
        description: newTrip.description,
        destination: newTrip.destination,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        budget: Number.parseFloat(newTrip.budget),
        status: "planned",
        expenses: [],
      }

      setTrips((prev) => [trip, ...prev])
      setNewTrip({
        title: "",
        description: "",
        destination: "",
        start_date: "",
        end_date: "",
        budget: "",
      })
      setIsAddingTrip(false)
    } catch (error) {
      console.error("Failed to add trip:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateSpent = (trip: Trip) => {
    return trip.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  }

  const calculateProgress = (trip: Trip) => {
    const spent = calculateSpent(trip)
    return trip.budget > 0 ? (spent / trip.budget) * 100 : 0
  }

  const getDaysUntil = (date: string) => {
    const today = new Date()
    const tripDate = new Date(date)
    const diffTime = tripDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trip Planner</h2>
          <p className="text-muted-foreground">Plan and manage your business trips</p>
        </div>
        <Dialog open={isAddingTrip} onOpenChange={setIsAddingTrip}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Plan Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Plan New Trip</DialogTitle>
              <DialogDescription>Create a new business trip with budget tracking.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Trip Title</Label>
                <Input
                  id="title"
                  value={newTrip.title}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter trip title"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, destination: e.target.value }))}
                  placeholder="Enter destination"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTrip.description}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter trip description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newTrip.start_date}
                    onChange={(e) => setNewTrip((prev) => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newTrip.end_date}
                    onChange={(e) => setNewTrip((prev) => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={newTrip.budget}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, budget: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingTrip(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTrip}>Create Trip</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">All time trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.filter((t) => t.status === "planned").length}</div>
            <p className="text-xs text-muted-foreground">Upcoming trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.filter((t) => t.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently traveling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${trips.reduce((sum, trip) => sum + trip.budget, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Allocated budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.map((trip) => {
          const spent = calculateSpent(trip)
          const progress = calculateProgress(trip)
          const daysUntil = getDaysUntil(trip.start_date)

          return (
            <Card key={trip.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{trip.title}</h3>
                      <p className="text-muted-foreground">{trip.destination}</p>
                      {trip.description && <p className="text-sm text-muted-foreground mt-1">{trip.description}</p>}
                    </div>
                  </div>
                  <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(trip.start_date).toLocaleDateString()} -{" "}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                      {trip.status === "planned" && daysUntil > 0 && (
                        <p className="text-xs text-muted-foreground">{daysUntil} days until departure</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        ${spent.toFixed(2)} / ${trip.budget.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{trip.expenses?.length || 0} expenses</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {Math.ceil(
                          (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </p>
                      <p className="text-xs text-muted-foreground">Trip duration</p>
                    </div>
                  </div>
                </div>

                {trip.budget > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${spent.toFixed(2)} spent</span>
                      <span>${(trip.budget - spent).toFixed(2)} remaining</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {trips.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Plane className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No trips planned</h3>
            <p className="text-muted-foreground mb-4">Start planning your next business trip with budget tracking.</p>
            <Button onClick={() => setIsAddingTrip(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Plan Your First Trip
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
