export interface Aircraft {
  id: string;
  name: string;
  iata_code?: string | null;
  type?: string | null;
  registration?: string | null;
  manufacturer_name?: string | null;
  model?: string | null;
  max_seats?: number | null;
}

export interface AircraftListResponse {
  data: Aircraft[];
  meta: {
    limit: number;
    after?: string;
    before?: string;
  };
}
