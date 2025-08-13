import { getDuffelClient } from "@/lib/duffel/client"

interface Aircraft {
  id: string
  iata_code: string
  name: string
  manufacturer: string
}

export async function fetchAircraft(): Promise<Aircraft[]> {
  try {
    const duffel = getDuffelClient()

    // In a real implementation, this would call Duffel's aircraft endpoint
    // For now, return a static list of common aircraft
    return [
      {
        id: "arc_00009UhD4ongolulWd91Ky",
        iata_code: "320",
        name: "Airbus A320",
        manufacturer: "Airbus",
      },
      {
        id: "arc_00009UhD4ongolulWd91Kz",
        iata_code: "321",
        name: "Airbus A321",
        manufacturer: "Airbus",
      },
      {
        id: "arc_00009UhD4ongolulWd91K1",
        iata_code: "737",
        name: "Boeing 737",
        manufacturer: "Boeing",
      },
      {
        id: "arc_00009UhD4ongolulWd91K2",
        iata_code: "777",
        name: "Boeing 777",
        manufacturer: "Boeing",
      },
      {
        id: "arc_00009UhD4ongolulWd91K3",
        iata_code: "787",
        name: "Boeing 787 Dreamliner",
        manufacturer: "Boeing",
      },
    ]
  } catch (error) {
    console.error("Error fetching aircraft:", error)
    return []
  }
}

export async function fetchAircraftById(aircraftId: string): Promise<Aircraft | null> {
  try {
    const aircraft = await fetchAircraft()
    return aircraft.find((a) => a.id === aircraftId) || null
  } catch (error) {
    console.error("Error fetching aircraft by ID:", error)
    return null
  }
}
