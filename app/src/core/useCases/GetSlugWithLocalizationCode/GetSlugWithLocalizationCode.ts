import { LocalizationService } from "../../domain/localization/LocalizationService";

export class GetSlugWithLocalizationCode {
  private readonly localizationService: LocalizationService;

  constructor(localizationService: LocalizationService) {
    this.localizationService = localizationService;
  }

  execute = (slug: string): string => {
    if (!this.localizationService.hasLocalizationCode(slug))
      return `${this.localizationService.getLocalizationCode()}${slug}`;
    return this.localizationService.parseSlugWithLocalizationCode(slug);
  };
}
