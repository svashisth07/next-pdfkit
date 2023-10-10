import { CrimeArrestData, CrimeArrestDataResponse } from "./types";

export const fetchCrimeArrestData = async (): Promise<CrimeArrestData[]> => {
  const response = await fetch(
    "https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv"
  );
  const { keys, data } = (await response.json()) as CrimeArrestDataResponse;
  return data.map((d: any) => ({
    year: parseInt(d.data_year),
    arrests: keys.reduce((acc, key) => acc + parseInt(d[key] || 0), 0),
  }));
};
