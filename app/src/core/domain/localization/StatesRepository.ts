import StateVM from "./StateVM";

export interface StatesRepository {
  getAllCountryStates(country: string): StateVM[];
}
