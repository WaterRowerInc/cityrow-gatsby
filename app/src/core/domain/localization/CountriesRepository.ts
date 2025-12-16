import Country from "./Country";

export interface CountriesRepository {
  getAll(): Country[];

  findByCode(code: string): Country | undefined;

  findByName(name: string): Country | undefined;

  getByBrowserConfiguration(): Country;
}
