
export function formatDuration(duration: string): string {
  // Duration viene en formato ISO 8601: PT2H30M
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration
  
  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function formatTime(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

export function formatDate(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export function formatDateTime(dateTime: string) {
  const date = new Date(dateTime)
  return {
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    date: date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    full: date.toLocaleString('en-US')
  }
}

export function calculateLayoverTime(arrivalTime: string, departureTime: string): string {
  const arrival = new Date(arrivalTime)
  const departure = new Date(departureTime)
  const diffMs = departure.getTime() - arrival.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function isOvernightLayover(arrivalTime: string, departureTime: string): boolean {
  const arrival = new Date(arrivalTime)
  const departure = new Date(departureTime)
  return departure.getDate() !== arrival.getDate()
}