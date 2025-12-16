import { StatesRepository } from "../../domain/localization/StatesRepository";

export class GetAllStatesByCountry {
  private readonly statesRepository: StatesRepository;

  constructor(statesRepository: StatesRepository) {
    this.statesRepository = statesRepository;
  }

  execute = (country: string) => this.statesRepository.getAllCountryStates(country);
}
