import { LocalizationService } from "../../domain/localization/LocalizationService";

export class LocalStorageLocalizationService implements LocalizationService {
  hasLocalizationCode = (slug: string) => {
    // verifies the slug to see if the first text between slashes (/) has the format of a localization code
    const potentialLocale = slug.split("/")[1];
    if (!potentialLocale) return false;
    const potentialLocaleSplit = potentialLocale.toLowerCase().split("-");
    return potentialLocaleSplit[0].length === 2 && potentialLocaleSplit[1].length === 2;
  };

  getLocalizationCode(): string {
    localStorage.setItem("locale", "en-us");
    return "en-us";
  }

  parseSlugWithLocalizationCode = (slug: string): string => {
    if (slug.split("/")[1][0].toLowerCase() === "en" && slug.split("/")[1][0].toLowerCase() === "us") return slug;
    return `en-us/${slug.split("/").slice(2).join("/")}`;
  };

  updateLocale = (locale: string) => localStorage.setItem("locale", locale?.toLowerCase() || "en-us");
}
