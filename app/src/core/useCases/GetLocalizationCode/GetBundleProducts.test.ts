import { anything, instance, mock, verify, when } from "ts-mockito";
import { LocalizationService } from "./../../domain/localization/LocalizationService";
import { GetLocalizationCode } from "./GetLocalizationCode";

describe("GetLocalizationCode should", () => {
  it("get localization code", async () => {
    when(localizationService.getLocalizationCode()).thenReturn(anything());

    await getLocalizationCode().execute();

    verify(localizationService.getLocalizationCode()).called();
  });

  beforeEach(() => {
    localizationService = mock<LocalizationService>();
  });

  function getLocalizationCode(): GetLocalizationCode {
    return new GetLocalizationCode(instance(localizationService));
  }

  let localizationService: LocalizationService;
});
