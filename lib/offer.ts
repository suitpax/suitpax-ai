export function offerIsExpired(offer?: { expires_at?: string }) {
  if (!offer?.expires_at) return false
  return new Date(offer.expires_at).getTime() < Date.now()
}

export function getSegmentDates(segment: any) {
  const depart = segment?.departing_at ? new Date(segment.departing_at) : null
  const arrive = segment?.arriving_at ? new Date(segment.arriving_at) : null
  return { depart, arrive }
}

