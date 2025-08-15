'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserIcon } from '@heroicons/react/24/outline'

interface PassengerData {
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr'
  given_name: string
  family_name: string
  born_on: string
  email: string
  phone_number: string
  type: 'adult' | 'child' | 'infant_without_seat'
}

interface PassengerFormProps {
  passengerNumber: number
  passengerData: PassengerData
  onChange: (data: PassengerData) => void
  errors?: Partial<PassengerData>
}

export default function PassengerForm({ 
  passengerNumber, 
  passengerData, 
  onChange, 
  errors = {} 
}: PassengerFormProps) {
  const [formData, setFormData] = useState<PassengerData>(passengerData)

  useEffect(() => {
    setFormData(passengerData)
  }, [passengerData])

  const handleChange = (field: keyof PassengerData, value: string) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    onChange(updatedData)
  }

  const getMaxBirthDate = () => {
    const today = new Date()
    if (formData.type === 'child') {
      // Children: 2-17 years old
      const maxDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate())
      return maxDate.toISOString().split('T')[0]
    } else if (formData.type === 'infant_without_seat') {
      // Infants: under 2 years old
      const maxDate = new Date(today.getFullYear() - 0, today.getMonth(), today.getDate())
      return maxDate.toISOString().split('T')[0]
    } else {
      // Adults: 18+ years old
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      return maxDate.toISOString().split('T')[0]
    }
  }

  const getMinBirthDate = () => {
    const today = new Date()
    if (formData.type === 'child') {
      // Children: 2-17 years old
      const minDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())
      return minDate.toISOString().split('T')[0]
    } else if (formData.type === 'infant_without_seat') {
      // Infants: under 2 years old
      const minDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate())
      return minDate.toISOString().split('T')[0]
    } else {
      // Adults: no minimum (reasonable limit)
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
      return minDate.toISOString().split('T')[0]
    }
  }

  const getPassengerTypeLabel = () => {
    switch (formData.type) {
      case 'adult': return 'Adult'
      case 'child': return 'Child (2-17 years)'
      case 'infant_without_seat': return 'Infant (under 2 years)'
      default: return 'Passenger'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserIcon className="h-5 w-5" />
          Passenger {passengerNumber} - {getPassengerTypeLabel()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title and Names Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`title-${passengerNumber}`}>Title *</Label>
            <Select
              value={formData.title}
              onValueChange={(value: any) => handleChange('title', value)}
            >
              <SelectTrigger className={errors.title ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mr">Mr</SelectItem>
                <SelectItem value="ms">Ms</SelectItem>
                <SelectItem value="mrs">Mrs</SelectItem>
                <SelectItem value="miss">Miss</SelectItem>
                <SelectItem value="dr">Dr</SelectItem>
              </SelectContent>
            </Select>
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`given_name-${passengerNumber}`}>First Name *</Label>
            <Input
              id={`given_name-${passengerNumber}`}
              type="text"
              value={formData.given_name}
              onChange={(e) => handleChange('given_name', e.target.value)}
              placeholder="Enter first name"
              className={errors.given_name ? 'border-red-500' : ''}
            />
            {errors.given_name && (
              <p className="mt-1 text-xs text-red-500">{errors.given_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`family_name-${passengerNumber}`}>Last Name *</Label>
            <Input
              id={`family_name-${passengerNumber}`}
              type="text"
              value={formData.family_name}
              onChange={(e) => handleChange('family_name', e.target.value)}
              placeholder="Enter last name"
              className={errors.family_name ? 'border-red-500' : ''}
            />
            {errors.family_name && (
              <p className="mt-1 text-xs text-red-500">{errors.family_name}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`born_on-${passengerNumber}`}>Date of Birth *</Label>
            <Input
              id={`born_on-${passengerNumber}`}
              type="date"
              value={formData.born_on}
              onChange={(e) => handleChange('born_on', e.target.value)}
              min={getMinBirthDate()}
              max={getMaxBirthDate()}
              className={errors.born_on ? 'border-red-500' : ''}
            />
            {errors.born_on && (
              <p className="mt-1 text-xs text-red-500">{errors.born_on}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              As shown on passport or ID
            </p>
          </div>

          <div>
            <Label htmlFor={`email-${passengerNumber}`}>Email Address *</Label>
            <Input
              id={`email-${passengerNumber}`}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="passenger@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`phone_number-${passengerNumber}`}>Phone Number *</Label>
            <Input
              id={`phone_number-${passengerNumber}`}
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={errors.phone_number ? 'border-red-500' : ''}
            />
            {errors.phone_number && (
              <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>
            )}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Important Notes:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Names must match exactly as shown on passport or government ID</li>
            <li>• Date of birth must be accurate for age verification</li>
            <li>• Email address will receive booking confirmation and updates</li>
            {formData.type === 'infant_without_seat' && (
              <li>• Infants must travel on an adult's lap and be under 2 years old</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
