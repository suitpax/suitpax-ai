"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PassengerData {
  title: string
  given_name: string
  family_name: string
  born_on: string
  email: string
  phone_number: string
  type: string
}

interface PassengerFormProps {
  passengerNumber: number
  passengerData: PassengerData
  onChange: (data: PassengerData) => void
}

export default function PassengerForm({ passengerNumber, passengerData, onChange }: PassengerFormProps) {
  const handleChange = (field: keyof PassengerData, value: string) => {
    onChange({ ...passengerData, [field]: value })
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Passenger {passengerNumber} ({passengerData.type})</CardTitle>
        <CardDescription>Please enter the details as they appear on the passport.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor={`title-${passengerNumber}`}>Title</Label>
          <Select value={passengerData.title} onValueChange={(value) => handleChange('title', value)}>
            <SelectTrigger id={`title-${passengerNumber}`}>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Mrs">Mrs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`given_name-${passengerNumber}`}>First Name</Label>
          <Input id={`given_name-${passengerNumber}`} value={passengerData.given_name} onChange={(e) => handleChange('given_name', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`family_name-${passengerNumber}`}>Last Name</Label>
          <Input id={`family_name-${passengerNumber}`} value={passengerData.family_name} onChange={(e) => handleChange('family_name', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`born_on-${passengerNumber}`}>Date of Birth</Label>
          <Input id={`born_on-${passengerNumber}`} type="date" value={passengerData.born_on} onChange={(e) => handleChange('born_on', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`email-${passengerNumber}`}>Email Address</Label>
          <Input id={`email-${passengerNumber}`} type="email" value={passengerData.email} onChange={(e) => handleChange('email', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`phone_number-${passengerNumber}`}>Phone Number</Label>
          <Input id={`phone_number-${passengerNumber}`} type="tel" value={passengerData.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} required />
        </div>
      </CardContent>
    </Card>
  )
}
