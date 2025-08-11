// app/api/flights/duffel/airlines/service.ts

import { Airline, AirlineListResponse } from "./types";
import { createDuffelClient } from "@/lib/duffel";

export async function fetchAirlineById(id: string): Promise<Airline> {
  const duffel = createDuffelClient();
  const res = await duffel.airlines.get(id);
  return res.data;
}

export async function fetchAirlines(
  limit = 50,
  after?: string,
  before?: string
): Promise<AirlineListResponse> {
  const duffel = createDuffelClient();
  const res = await duffel.airlines.list({ limit, after, before } as any);
  return {
    data: res.data,
    meta: {
      limit: res.meta?.limit ?? limit,
      after: (res.meta?.after ?? undefined) as string | undefined,
      before: (res.meta?.before ?? undefined) as string | undefined,
    },
  };
}
