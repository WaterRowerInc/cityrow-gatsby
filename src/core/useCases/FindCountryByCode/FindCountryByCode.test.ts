import { anything, instance, mock, verify, when } from "ts-mockito";
import { CountriesRepository } from "../../domain/localization/CountriesRepository";
import { FindCountryByCode } from "./FindCountryByCode";

describe("FindCountryByCode should", () => {
  it("find a country by code", async () => {
    when(countriesRepository.findByCode("aCountryCode")).thenResolve(anything());

    await getCountryByCode().execute("aCountryCode");

    verify(countriesRepository.findByCode("aCountryCode")).called();
  });

  beforeEach(() => {
    countriesRepository = mock<CountriesRepository>();
  });

  function getCountryByCode(): FindCountryByCode {
    return new FindCountryByCode(instance(countriesRepository));
  }

  let countriesRepository: CountriesRepository;
});
