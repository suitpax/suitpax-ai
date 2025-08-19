export function formatDurationISO(iso?: string) {
  if (!iso) return ""
  // very basic PTxxHxxM formatting to "xh ym"
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return iso
  const h = m[1] ? `${m[1]}h` : ""
  const min = m[2] ? `${m[2]}m` : ""
  return [h, min].filter(Boolean).join(" ")
}

