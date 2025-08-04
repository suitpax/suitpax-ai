export interface Airline {
  id: string;
  name: string;
  iata_code?: string | null;
  conditions_of_carriage_url?: string | null;
  logo_symbol_url?: string | null;
  logo_lockup_url?: string | null;
}

export interface AirlineListResponse {
  data: Airline[];
  meta: {
    limit: number;
    after?: string;
    before?: string;
  };
}
