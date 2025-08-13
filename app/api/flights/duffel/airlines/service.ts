import { getDuffelClient } from "@/lib/duffel/client"

interface Airline {
  id: string
  iata_code: string
  icao_code: string
  name: string
  logo_symbol_url?: string
  logo_lockup_url?: string
}

export async function fetchAirlines(): Promise<Airline[]> {
  try {
    const duffel = getDuffelClient()

    // In a real implementation, this would call Duffel's airlines endpoint
    // For now, return a static list of major airlines
    return [
      {
        id: "arl_00001876aqC8c5umZmrRds",
        iata_code: "AA",
        icao_code: "AAL",
        name: "American Airlines",
        logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/AA.svg",
        logo_lockup_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AA.svg",
      },
      {
        id: "arl_00001876aqC8c5umZmrRdt",
        iata_code: "BA",
        icao_code: "BAW",
        name: "British Airways",
        logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/BA.svg",
        logo_lockup_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/BA.svg",
      },
      {
        id: "arl_00001876aqC8c5umZmrRdu",
        iata_code: "LH",
        icao_code: "DLH",
        name: "Lufthansa",
        logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/LH.svg",
        logo_lockup_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/LH.svg",
      },
      {
        id: "arl_00001876aqC8c5umZmrRdv",
        iata_code: "AF",
        icao_code: "AFR",
        name: "Air France",
        logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/AF.svg",
        logo_lockup_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AF.svg",
      },
      {
        id: "arl_00001876aqC8c5umZmrRdw",
        iata_code: "KL",
        icao_code: "KLM",
        name: "KLM Royal Dutch Airlines",
        logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/KL.svg",
        logo_lockup_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/KL.svg",
      },
    ]
  } catch (error) {
    console.error("Error fetching airlines:", error)
    return []
  }
}

export async function fetchAirlineById(airlineId: string): Promise<Airline | null> {
  try {
    const airlines = await fetchAirlines()
    return airlines.find((a) => a.id === airlineId) || null
  } catch (error) {
    console.error("Error fetching airline by ID:", error)
    return null
  }
}
