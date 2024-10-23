export interface ObservationsResponse {
  total_results?: number;
  page?: number;
  per_page?: number;
  results: Observation[];
}

export interface Observation {
  id?: number;
  created_at?: string;
  created_at_details?: DateDetails;
  created_time_zone?: string;
  location?: string;
  photos?: Photo[];
  taxon?: ObservationTaxon;
}

export interface DateDetails {
  date?: string;
  day?: number;
  hour?: number;
  month?: number;
  week?: number;
  year?: number;
}

export interface Photo {
  id?: number;
  attribution?: string;
  license_code?: string;
  url?: string;
}

export interface ObservationTaxon {
  id?: number;
  iconic_taxon_id?: number;
  iconic_taxon_name?: string;
  is_active?: boolean;
  name?: string;
  preferred_common_name?: string;
  rank?: string;
  rank_level?: number;
  ancestor_ids?: number[];
  ancestry?: string;
  endemic?: boolean;
  introduced?: boolean;
  native?: boolean;
  threatened?: boolean;
}
