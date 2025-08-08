import { Duffel } from "@duffel/api";
import { Aircraft, AircraftListResponse } from "./types";

const duffel = new Duffel({
  token: ((globalThis as any)?.process?.env?.DUFFEL_API_KEY as string | undefined) ?? "",
  environment: "test",
});

export async function fetchAircraftById(id: string): Promise<Aircraft> {
  const response = await duffel.aircraft.get(id);
  return response.data;
}

export async function fetchAircraft(limit = 50, after?: string, before?: string): Promise<AircraftListResponse> {
  const response = await duffel.aircraft.list({ limit, after, before });
  return {
    data: response.data,
    meta: response.meta,
  };
}
