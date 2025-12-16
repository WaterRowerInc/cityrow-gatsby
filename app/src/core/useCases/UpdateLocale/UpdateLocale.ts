import { LocalizationService } from "../../domain/localization/LocalizationService";

export class UpdateLocale {
  private readonly localizationService: LocalizationService;

  constructor(localizationService: LocalizationService) {
    this.localizationService = localizationService;
  }

  execute = (locale: string) => this.localizationService.updateLocale(locale);
}
