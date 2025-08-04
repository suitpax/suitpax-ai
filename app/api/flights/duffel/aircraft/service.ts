import { Duffel } from "@duffel/api";
const duffel = new Duffel({ token: process.env.DUFFEL_API_KEY!, environment: "test" });

export async function fetchAircraftById(id: string) {
  return (await duffel.aircraft.get(id)).data;
}
export async function fetchAircraft(limit = 50, after?: string, before?: string) {
  const res = await duffel.aircraft.list({ limit, after, before });
  return { data: res.data, meta: res.meta };
}
