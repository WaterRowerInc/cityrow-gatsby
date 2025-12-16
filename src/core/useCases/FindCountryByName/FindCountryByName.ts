import { CountriesRepository } from "../../domain/localization/CountriesRepository";

export class FindCountryByName {
  private readonly countriesRepository: CountriesRepository;

  constructor(countriesRepository: CountriesRepository) {
    this.countriesRepository = countriesRepository;
  }

  execute = (name: string) => this.countriesRepository.findByName(name);
}
