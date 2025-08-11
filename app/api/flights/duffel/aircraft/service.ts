import { Aircraft, AircraftListResponse } from "./types";
import { createDuffelClient } from "@/lib/duffel";

export async function fetchAircraftById(id: string): Promise<Aircraft> {
  const duffel = createDuffelClient();
  const response = await duffel.aircraft.get(id);
  return response.data;
}

export async function fetchAircraft(limit = 50, after?: string, before?: string): Promise<AircraftListResponse> {
  const duffel = createDuffelClient();
  const response = await duffel.aircraft.list({ limit, after, before });
  return {
    data: response.data,
    meta: response.meta,
  };
}
