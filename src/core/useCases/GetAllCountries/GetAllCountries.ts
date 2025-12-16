import { CountriesRepository } from "../../domain/localization/CountriesRepository";

export class GetAllCountries {
  private readonly countriesRepository: CountriesRepository;

  constructor(countriesRepository: CountriesRepository) {
    this.countriesRepository = countriesRepository;
  }

  execute = () => this.countriesRepository.getAll();
}
