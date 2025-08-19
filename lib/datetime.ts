export function toUTCDate(input: string | Date): Date {
  if (input instanceof Date) return new Date(Date.UTC(
    input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate(),
    input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()))
  const d = new Date(input)
  return new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
}

export function isISO8601Duration(str?: string): boolean {
  if (!str) return false
  return /^P(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/.test(str) || /^P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.test(str)
}

export function convertDurationToString(iso?: string): string {
  if (!iso) return ""
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return iso
  const h = m[1] ? `${m[1]}h` : ""
  const min = m[2] ? `${m[2]}m` : ""
  return [h, min].filter(Boolean).join(" ")
}

export function getDurationString(iso?: string): string {
  return convertDurationToString(iso)
}

export function formatDate(input: string | Date, options?: Intl.DateTimeFormatOptions, locale: string = 'en-GB') {
  const d = input instanceof Date ? input : new Date(input)
  return new Intl.DateTimeFormat(locale, options || { year: 'numeric', month: 'short', day: '2-digit' }).format(d)
}

export function getTimeString(input: string | Date, locale: string = 'en-GB') {
  const d = input instanceof Date ? input : new Date(input)
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d)
}

