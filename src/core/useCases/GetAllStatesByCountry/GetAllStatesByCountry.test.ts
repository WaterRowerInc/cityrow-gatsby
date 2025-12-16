import { anything, instance, mock, verify, when } from "ts-mockito";
import { StatesRepository } from "./../../domain/localization/StatesRepository";
import { GetAllStatesByCountry } from "./GetAllStatesByCountry";

describe("GetAllStatesByCountry should", () => {
  it("find all states by country", async () => {
    when(statesRepository.getAllCountryStates("aCountry")).thenResolve(anything());

    await getAllStatesByCountry().execute("aCountry");

    verify(statesRepository.getAllCountryStates("aCountry")).called();
  });

  beforeEach(() => {
    statesRepository = mock<StatesRepository>();
  });

  function getAllStatesByCountry(): GetAllStatesByCountry {
    return new GetAllStatesByCountry(instance(statesRepository));
  }

  let statesRepository: StatesRepository;
});
