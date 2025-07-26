import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiAirplaneTilt, PiBuilding, PiCalendar } from "react-icons/pi"

export default function BusinessTravelPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Business Travel</h2>
        <Button>
          <PiAirplaneTilt className="mr-2 h-4 w-4" />
          Book New Trip
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiAirplaneTilt className="h-5 w-5" />
              Upcoming Flights
            </CardTitle>
            <CardDescription>Your scheduled business trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">NYC → SF</p>
                  <p className="text-sm text-gray-500">March 15, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$450</p>
                  <p className="text-sm text-gray-500">Delta</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">SF → LAX</p>
                  <p className="text-sm text-gray-500">March 20, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$320</p>
                  <p className="text-sm text-gray-500">United</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiBuilding className="h-5 w-5" />
              Hotel Bookings
            </CardTitle>
            <CardDescription>Your accommodation reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Hilton San Francisco</p>
                  <p className="text-sm text-gray-500">Mar 15-18, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$180/night</p>
                  <p className="text-sm text-gray-500">3 nights</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Marriott Downtown LA</p>
                  <p className="text-sm text-gray-500">Mar 20-22, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$220/night</p>
                  <p className="text-sm text-gray-500">2 nights</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiCalendar className="h-5 w-5" />
              Travel Calendar
            </CardTitle>
            <CardDescription>Your travel schedule overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Client Meeting - SF</p>
                  <p className="text-sm text-gray-500">March 16, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Conference - LA</p>
                  <p className="text-sm text-gray-500">March 21, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
