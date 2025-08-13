export function formatPrice(amount: string, currency: string): string {
  const numAmount = Number.parseFloat(amount)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount)
}

export function formatDuration(duration: string): string {
  // Duration comes in ISO 8601 format like "PT2H30M"
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function getStopDescription(stopCount: number): string {
  if (stopCount === 0) return "Direct"
  if (stopCount === 1) return "1 stop"
  return `${stopCount} stops`
}

export function formatDateTime(dateTime: string): string {
  return new Date(dateTime).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function getAirlineName(carrier: any): string {
  return carrier?.name || "Unknown Airline"
}

export function getAircraftName(aircraft: any): string {
  return aircraft?.name || "Unknown Aircraft"
}

export function validatePassengerData(passengers: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(passengers) || passengers.length === 0) {
    errors.push("At least one passenger is required")
    return { valid: false, errors }
  }

  passengers.forEach((passenger, index) => {
    const passengerErrors = validateSinglePassenger(passenger, index + 1)
    errors.push(...passengerErrors)
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

function validateSinglePassenger(passenger: any, passengerNumber: number): string[] {
  const errors: string[] = []
  const prefix = `Passenger ${passengerNumber}: `

  if (!passenger.given_name || passenger.given_name.trim().length < 1) {
    errors.push(`${prefix}First name is required`)
  }

  if (!passenger.family_name || passenger.family_name.trim().length < 1) {
    errors.push(`${prefix}Last name is required`)
  }

  if (!passenger.born_on) {
    errors.push(`${prefix}Date of birth is required`)
  } else {
    const birthDate = new Date(passenger.born_on)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 0 || age > 120) {
      errors.push(`${prefix}Invalid date of birth`)
    }
  }

  if (!passenger.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
    errors.push(`${prefix}Valid email is required`)
  }

  if (!passenger.phone_number || passenger.phone_number.trim().length < 10) {
    errors.push(`${prefix}Valid phone number is required`)
  }

  if (!["mr", "ms", "mrs", "dr"].includes(passenger.title?.toLowerCase())) {
    errors.push(`${prefix}Valid title is required (mr, ms, mrs, dr)`)
  }

  if (!["male", "female"].includes(passenger.gender?.toLowerCase())) {
    errors.push(`${prefix}Valid gender is required (male, female)`)
  }

  return errors
}

export function formatSearchDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function calculateTotalDuration(slices: any[]): string {
  const totalMinutes = slices.reduce((total, slice) => {
    const match = slice.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return total

    const hours = Number.parseInt(match[1] || "0")
    const minutes = Number.parseInt(match[2] || "0")
    return total + hours * 60 + minutes
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}
