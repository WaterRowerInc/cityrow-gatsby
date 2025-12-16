import { User } from "core/domain/user/User";
import { UserSubscription } from "core/domain/user/UserStorage";
import { GetUser } from "core/useCases/GetUser/GetUser";
import { LogOut } from "core/useCases/LogOut/LogOut";
import Country from "../core/domain/localization/Country";
import { UserNotLoggedInError } from "../core/domain/user/UserNotLoggedInError";
import { FindCountryByCode } from "../core/useCases/FindCountryByCode/FindCountryByCode";
import { FindCountryByName } from "../core/useCases/FindCountryByName/FindCountryByName";
import { GetAllCountries } from "../core/useCases/GetAllCountries/GetAllCountries";
import { GetLocalizationCode } from "../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { TrackAnalyticsEmailSubmitted } from "../core/useCases/TrackAnalytics/EmailSubmitted/TrackAnalyticsEmailSubmitted";
import { UpdateLocale } from "../core/useCases/UpdateLocale/UpdateLocale";

export interface FooterView {
  setLocalizationCode(localizationCode: string);

  updateSelectedCountry(country: string);

  showCountries(countries: Country[]);

  navigateToNewPath(path: string);

  setUser(user: User | null);
}

export class FooterPresenter {
  private view: FooterView;
  private getLocalizationCode: GetLocalizationCode;
  private getAllCountries: GetAllCountries;
  private findCountryByCode: FindCountryByCode;
  private findCountryByName: FindCountryByName;
  private trackAnalyticsEmailSubmitted: TrackAnalyticsEmailSubmitted;
  private updateLocale: UpdateLocale;
  private getUser: GetUser;
  private logOut: LogOut;
  private path: string;
  private userSubscription?: UserSubscription;

  constructor(
    view: FooterView,
    getLocalizationCode: GetLocalizationCode,
    getAllCountries: GetAllCountries,
    findCountryByCode: FindCountryByCode,
    findCountryByName: FindCountryByName,
    trackAnalyticsEmailSubmitted: TrackAnalyticsEmailSubmitted,
    updateLocale: UpdateLocale,
    getUser: GetUser,
    logOut: LogOut
  ) {
    this.view = view;
    this.getLocalizationCode = getLocalizationCode;
    this.getAllCountries = getAllCountries;
    this.findCountryByCode = findCountryByCode;
    this.findCountryByName = findCountryByName;
    this.trackAnalyticsEmailSubmitted = trackAnalyticsEmailSubmitted;
    this.updateLocale = updateLocale;
    this.getUser = getUser;
    this.logOut = logOut;
    this.path = "";
  }

  start = async (path: string) => {
    this.path = path;
    const locale = this.getLocalizationCode.execute();
    const countries = this.getAllCountries.execute();
    let currentCountry = this.findCountryByCode.execute(locale.split("-")[1]);
    if (!currentCountry) {
      currentCountry = this.findCountryByCode.execute("us");
      this.updateLocale.execute(locale.split("-")[0].concat("-us"));
    }
    this.view.setLocalizationCode(locale);
    this.view.showCountries(countries);
    this.view.updateSelectedCountry(currentCountry?.text || "");
    this.view.setUser(await this.tryGetUser());
    this.userSubscription = this.getUser.subscribe((user: User | null) => this.view.setUser(user));
  };

  refreshPath = (newPath: string) => (this.path = newPath);

  changeLocale = async (_, data) => {
    const country = this.findCountryByName.execute(data.value);
    const newLocale = `en-${country!.key.toUpperCase()}`;
    const newPath = `/${newLocale}${this.path.substring(6)}`;
    this.updateLocale.execute(newLocale);
    this.view.updateSelectedCountry(country!.text);
    await this.view.navigateToNewPath(newPath);
  };

  dispose = () => {
    this.userSubscription?.unsubscribe();
  };

  handleLogout = async () => {
    await this.logOut.execute();
    if (!["subscription", "profile"].find((page) => this.path?.includes(page))) return;
    this.redirectToHome();
  };

  trackEmailSubmitted = async (email: string) => {
    if (!email) return;
    this.trackAnalyticsEmailSubmitted.execute(email).then();
  };

  private redirectToHome = () => {
    const configuredLocale = this.getLocalizationCode.execute();
    this.view.navigateToNewPath(`/${configuredLocale}`);
  };

  private tryGetUser = async (): Promise<User | null> => {
    try {
      return await this.getUser.execute();
    } catch (error: any) {
      if (error instanceof UserNotLoggedInError) return null;
      throw error;
    }
  };
}
