export function normalizeDuffelStays(raw: any[]): any[] {
  return (raw || []).map((s: any, idx: number) => {
    const price = s?.price?.total || s?.price?.amount || s?.price
    const currency = s?.price?.currency || s?.currency || "USD"
    return {
      id: s?.id || String(idx),
      name: s?.name || s?.hotel_name || "",
      brand: s?.brand || null,
      city: s?.address?.city || s?.city || null,
      address: s?.address?.line_1 || s?.address?.formatted || null,
      image: s?.images?.[0]?.url || s?.image || null,
      rating: typeof s?.rating === 'number' ? s.rating : null,
      price: currency ? `${currency} ${price}` : String(price || ""),
      currency,
      refundable: s?.refundable ?? null,
      badges: [],
      booking_url: `/dashboard/hotels/book/${s?.id || idx}`,
    }
  })
}