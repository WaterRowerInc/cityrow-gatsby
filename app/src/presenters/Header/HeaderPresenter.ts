import { ProfileOption } from "components/ProfileDropdown";
import { User } from "core/domain/user/User";
import { UserSubscription } from "core/domain/user/UserStorage";
import { GetUser } from "core/useCases/GetUser/GetUser";
import { LogOut } from "core/useCases/LogOut/LogOut";
import { UserNotLoggedInError } from "../../core/domain/user/UserNotLoggedInError";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";

export interface HeaderView {
  setLocalizationCode(localizationCode: string);

  setUser(user: User | null);

  navigateToNewPath(path: string);
}

export class HeaderPresenter {
  private view: HeaderView;
  private getLocalizationCode: GetLocalizationCode;
  private getUser: GetUser;
  private logOut: LogOut;
  private userSubscription?: UserSubscription;
  private currentPage?: string;

  constructor(view: HeaderView, getLocalizationCode: GetLocalizationCode, getUser: GetUser, logOut: LogOut) {
    this.view = view;
    this.getLocalizationCode = getLocalizationCode;
    this.getUser = getUser;
    this.logOut = logOut;
  }

  start = async (page: string) => {
    this.currentPage = page;
    this.view.setLocalizationCode(this.getLocalizationCode.execute());
    const user = await this.tryGetUser();
    this.view.setUser(user);
    this.userSubscription = this.getUser.subscribe((user: User | null) => this.view.setUser(user));
  };

  refreshPath = (page: string) => (this.currentPage = page);

  handleLogout = async () => {
    await this.logOut.execute();
    if (!["subscription", "profile"].find((page) => this.currentPage?.includes(page))) return;
    this.redirectToHome();
  };

  handleProfileOptionClick = async (profileOption: ProfileOption) => {
    if (profileOption === "logout") await this.handleLogout();
    if (profileOption === "profile") this.navigateToProfile();
  };

  navigateToProfile = () => {
    const configuredLocale = this.getLocalizationCode.execute();
    this.view.navigateToNewPath(`/${configuredLocale}/profile`);
  };

  private redirectToHome = () => {
    const configuredLocale = this.getLocalizationCode.execute();
    this.view.navigateToNewPath(`/${configuredLocale}`);
  };

  dispose = () => {
    this.userSubscription?.unsubscribe();
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
