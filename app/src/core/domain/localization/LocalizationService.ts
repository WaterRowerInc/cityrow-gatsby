export interface LocalizationService {
  hasLocalizationCode(slug: string): boolean;

  getLocalizationCode(): string;

  parseSlugWithLocalizationCode(slug: string): string;

  updateLocale(locale: string);
}
