import { LocalizationService } from "../../domain/localization/LocalizationService";

export class GetLocalizationCode {
  private readonly localizationService: LocalizationService;

  constructor(localizationService: LocalizationService) {
    this.localizationService = localizationService;
  }

  execute = (): string => this.localizationService.getLocalizationCode();
}
