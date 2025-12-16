import { CountriesRepository } from "../../domain/localization/CountriesRepository";

export class FindCountryByCode {
  private readonly countriesRepository: CountriesRepository;

  constructor(countriesRepository: CountriesRepository) {
    this.countriesRepository = countriesRepository;
  }

  execute = (code: string) => this.countriesRepository.findByCode(code);
}
