import { getDuffelClient } from '@/lib/duffel'
import { AircraftResource } from './Aircraft'
import { AirlinesResource } from './Airlines'
import { AirportsResource } from './Airports'

export const airports = AirportsResource
export const airlines = AirlinesResource
export const aircraft = AircraftResource

export const supportingResources = { airports, airlines, aircraft }