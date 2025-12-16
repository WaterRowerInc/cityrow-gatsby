import { anything, instance, mock, verify, when } from "ts-mockito";
import { CountriesRepository } from "../../domain/localization/CountriesRepository";
import { FindCountryByName } from "./FindCountryByName";

describe("FindCountryByName should", () => {
  it("find a country by name", async () => {
    when(countriesRepository.findByName("aCountryName")).thenResolve(anything());

    await getCountryByName().execute("aCountryName");

    verify(countriesRepository.findByName("aCountryName")).called();
  });

  beforeEach(() => {
    countriesRepository = mock<CountriesRepository>();
  });

  function getCountryByName(): FindCountryByName {
    return new FindCountryByName(instance(countriesRepository));
  }

  let countriesRepository: CountriesRepository;
});
