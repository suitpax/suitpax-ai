import { resolveCityImage } from "@/lib/utils"

export function mapCityImage(city?: string, width = 640, height = 400) {
  return resolveCityImage(city || "city", { width, height, preferPexels: true, preferUnsplash: false })
}