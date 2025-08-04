// app/api/flights/duffel/airlines/service.ts

import { Duffel } from "@duffel/api";
import { Airline, AirlineListResponse } from "./types";

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: "test",
});

export async function fetchAirlineById(id: string): Promise<Airline> {
  const res = await duffel.airlines.get(id);
  return res.data;
}

export async function fetchAirlines(
  limit = 50,
  after?: string,
  before?: string
): Promise<AirlineListResponse> {
  const res = await duffel.airlines.list({ limit, after, before });
  return {
    data: res.data,
    meta: res.meta,
  };
}
