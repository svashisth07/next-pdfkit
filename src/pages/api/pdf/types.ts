export interface CrimeArrestData {
  year: number;
  arrests: number;
}

export interface CrimeArrestDataResponse {
  keys: string[];
  data: { [key: string]: number }[];
}
