import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { LogIn } from "../../core/useCases/LogIn/LogIn";
import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { IsAppTrialUser } from "./../../core/useCases/IsAppTrialUser/IsAppTrialUser";

export interface LoginView {
  showLoader();

  hideLoader();

  showErrorMessage(message: string);

  navigateToNewPath(path: string);
}

export class LoginPresenter {
  private view: LoginView;
  private logIn: LogIn;
  private getLocalizationCode: GetLocalizationCode;
  private trackAnalyticsPageView: TrackAnalyticsPageView;
  private isAppTrialUser: IsAppTrialUser;

  constructor(
    view: LoginView,
    logIn: LogIn,
    getLocalizationCode: GetLocalizationCode,
    trackAnalyticsPageView: TrackAnalyticsPageView,
    isAppTrialUser: IsAppTrialUser
  ) {
    this.view = view;
    this.logIn = logIn;
    this.getLocalizationCode = getLocalizationCode;
    this.trackAnalyticsPageView = trackAnalyticsPageView;
    this.isAppTrialUser = isAppTrialUser;
  }

  start = async () => {
    this.view.showLoader();
    await this.trackAnalyticsPageView.execute("Login");
    this.view.hideLoader();
  };

  handleLogIn = async (email: string, password: string) => {
    try {
      this.view.showLoader();
      await this.logIn.execute(email, password);
      const isAppTrial = await this.isAppTrialUser.execute();
      this.navigateTo(isAppTrial ? "subscription" : "profile");
    } catch (error: any) {
      this.view.hideLoader();
      this.view.showErrorMessage(error?.message);
    }
  };

  navigateTo = (path: string) => {
    const configuredLocale = this.getLocalizationCode.execute();
    this.view.navigateToNewPath(`/${configuredLocale}/${path}`);
  };
}
