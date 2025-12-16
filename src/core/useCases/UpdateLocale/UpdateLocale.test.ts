import { anything, instance, mock, verify, when } from "ts-mockito";
import { LocalizationService } from "../../domain/localization/LocalizationService";
import { UpdateLocale } from "./UpdateLocale";

describe("UpdateLocale should", () => {
  it("get localization code", async () => {
    when(localizationService.updateLocale("aLocale")).thenReturn(anything());

    await updateLocale().execute("aLocale");

    verify(localizationService.updateLocale("aLocale")).called();
  });

  beforeEach(() => {
    localizationService = mock<LocalizationService>();
  });

  function updateLocale(): UpdateLocale {
    return new UpdateLocale(instance(localizationService));
  }

  let localizationService: LocalizationService;
});
