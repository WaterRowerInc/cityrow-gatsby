import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { IsUserLoggedIn } from "../../core/useCases/IsUserLoggedIn/IsUserLoggedIn";

export interface SubscriptionPlanSelectorModalView {
  setIsUserLoggedIn(isUserLoggedIn: boolean);

  setLocale(locale: string);
}

export class SubscriptionPlanSelectorModalPresenter {
  private view: SubscriptionPlanSelectorModalView;
  private isUserLoggedIn: IsUserLoggedIn;
  private getLocalizationCode: GetLocalizationCode;

  constructor(
    view: SubscriptionPlanSelectorModalView,
    isUserLoggedIn: IsUserLoggedIn,
    getLocalizationCode: GetLocalizationCode
  ) {
    this.view = view;
    this.isUserLoggedIn = isUserLoggedIn;
    this.getLocalizationCode = getLocalizationCode;
  }

  start = async () => {
    this.view.setIsUserLoggedIn(await this.isUserLoggedIn.execute());
    this.view.setLocale(this.getLocalizationCode.execute());
  };
}
