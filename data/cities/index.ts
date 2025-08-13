export interface City {
  id: string
  name: string
  country: string
  continent: string
  businessImportance: "high" | "medium" | "low"
  imageUrl: string
  description: string
  timezone: string
  coordinates: {
    lat: number
    lng: number
  }
}

export const businessCities: City[] = [
  {
    id: "nyc",
    name: "New York",
    country: "United States",
    continent: "North America",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg",
    description: "Global financial hub and business center",
    timezone: "America/New_York",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    continent: "Europe",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
    description: "European financial capital and business hub",
    timezone: "Europe/London",
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg",
    description: "Asian business and technology center",
    timezone: "Asia/Tokyo",
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    continent: "Asia",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg",
    description: "Southeast Asian business gateway",
    timezone: "Asia/Singapore",
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    country: "Hong Kong",
    continent: "Asia",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg",
    description: "International financial center",
    timezone: "Asia/Hong_Kong",
    coordinates: { lat: 22.3193, lng: 114.1694 },
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg",
    description: "Middle Eastern business hub",
    timezone: "Asia/Dubai",
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
  {
    id: "frankfurt",
    name: "Frankfurt",
    country: "Germany",
    continent: "Europe",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg",
    description: "European financial center",
    timezone: "Europe/Berlin",
    coordinates: { lat: 50.1109, lng: 8.6821 },
  },
  {
    id: "zurich",
    name: "Zurich",
    country: "Switzerland",
    continent: "Europe",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
    description: "Swiss banking and finance center",
    timezone: "Europe/Zurich",
    coordinates: { lat: 47.3769, lng: 8.5417 },
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    continent: "Europe",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    description: "European business and cultural center",
    timezone: "Europe/Paris",
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    continent: "Oceania",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg",
    description: "Asia-Pacific business hub",
    timezone: "Australia/Sydney",
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    continent: "North America",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
    description: "Canadian financial center",
    timezone: "America/Toronto",
    coordinates: { lat: 43.6532, lng: -79.3832 },
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    continent: "Asia",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg",
    description: "Korean technology and business hub",
    timezone: "Asia/Seoul",
    coordinates: { lat: 37.5665, lng: 126.978 },
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    continent: "Asia",
    businessImportance: "high",
    imageUrl: "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg",
    description: "Indian financial capital",
    timezone: "Asia/Kolkata",
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    continent: "South America",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/161901/sao-paulo-brazil-skyline-skyscrapers-161901.jpeg",
    description: "South American business center",
    timezone: "America/Sao_Paulo",
    coordinates: { lat: -23.5505, lng: -46.6333 },
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    continent: "North America",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg",
    description: "Latin American business hub",
    timezone: "America/Mexico_City",
    coordinates: { lat: 19.4326, lng: -99.1332 },
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    continent: "Europe",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg",
    description: "European business and logistics hub",
    timezone: "Europe/Amsterdam",
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },
  {
    id: "milan",
    name: "Milan",
    country: "Italy",
    continent: "Europe",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
    description: "Italian business and fashion center",
    timezone: "Europe/Rome",
    coordinates: { lat: 45.4642, lng: 9.19 },
  },
  {
    id: "stockholm",
    name: "Stockholm",
    country: "Sweden",
    continent: "Europe",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
    description: "Nordic business and tech hub",
    timezone: "Europe/Stockholm",
    coordinates: { lat: 59.3293, lng: 18.0686 },
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    continent: "Europe",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg",
    description: "Mediterranean business center",
    timezone: "Europe/Madrid",
    coordinates: { lat: 41.3851, lng: 2.1734 },
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    businessImportance: "medium",
    imageUrl: "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg",
    description: "African business gateway",
    timezone: "Africa/Johannesburg",
    coordinates: { lat: -33.9249, lng: 18.4241 },
  },
]

export const getCityById = (id: string): City | undefined => {
  return businessCities.find((city) => city.id === id)
}

export const getCitiesByContinent = (continent: string): City[] => {
  return businessCities.filter((city) => city.continent === continent)
}

export const getTopBusinessCities = (limit = 10): City[] => {
  return businessCities.filter((city) => city.businessImportance === "high").slice(0, limit)
}
