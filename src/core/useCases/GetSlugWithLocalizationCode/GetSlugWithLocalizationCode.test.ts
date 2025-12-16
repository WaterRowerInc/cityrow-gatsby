import { anything, instance, mock, verify, when } from "ts-mockito";
import { LocalizationService } from "../../domain/localization/LocalizationService";
import { GetSlugWithLocalizationCode } from "./GetSlugWithLocalizationCode";

describe("GetSlugWithLocalizationCode should", () => {
  it("if slug doesn't have localization code, get slug with localization code from service", async () => {
    when(localizationService.hasLocalizationCode("aSlug")).thenReturn(false);
    when(localizationService.getLocalizationCode()).thenReturn(anything());
    when(localizationService.parseSlugWithLocalizationCode("aSlug")).thenReturn(anything());

    await getSlugWithLocalizationCode().execute("aSlug");

    verify(localizationService.getLocalizationCode()).called();
    verify(localizationService.parseSlugWithLocalizationCode("aSlug")).never();
  });

  it("if slug has localization code, parse slug with localization code from service", async () => {
    when(localizationService.hasLocalizationCode("aSlug")).thenReturn(true);
    when(localizationService.getLocalizationCode()).thenReturn(anything());
    when(localizationService.parseSlugWithLocalizationCode("aSlug")).thenReturn(anything());

    await getSlugWithLocalizationCode().execute("aSlug");

    verify(localizationService.getLocalizationCode()).never();
    verify(localizationService.parseSlugWithLocalizationCode("aSlug")).called();
  });

  beforeEach(() => {
    localizationService = mock<LocalizationService>();
  });

  function getSlugWithLocalizationCode(): GetSlugWithLocalizationCode {
    return new GetSlugWithLocalizationCode(instance(localizationService));
  }

  let localizationService: LocalizationService;
});
