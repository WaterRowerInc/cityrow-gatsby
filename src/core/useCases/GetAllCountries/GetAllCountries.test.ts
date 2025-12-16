import { anything, instance, mock, verify, when } from "ts-mockito";
import { CountriesRepository } from "../../domain/localization/CountriesRepository";
import { GetAllCountries } from "./GetAllCountries";

describe("GetAllCountries should", () => {
  it("find all countries", async () => {
    when(countriesRepository.getAll()).thenResolve(anything());

    await getAllCountries().execute();

    verify(countriesRepository.getAll()).called();
  });

  beforeEach(() => {
    countriesRepository = mock<CountriesRepository>();
  });

  function getAllCountries(): GetAllCountries {
    return new GetAllCountries(instance(countriesRepository));
  }

  let countriesRepository: CountriesRepository;
});
