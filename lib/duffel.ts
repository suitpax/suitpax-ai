import { Duffel } from '@duffel/api'

if (!process.env.DUFFEL_ACCESS_TOKEN) {
  throw new Error('DUFFEL_ACCESS_TOKEN is required')
}

export const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN,
})

export interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passengers: {
    adults: number
    children?: number
    infants?: number
  }
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first'
}

export interface BookingPassenger {
  given_name: string
  family_name: string
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr'
  gender: 'male' | 'female'
  born_on: string
  phone_number: string
  email: string
}