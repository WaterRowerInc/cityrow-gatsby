import { ChangePassword } from "core/useCases/ChangePassword/ChangePassword";
import { DropdownOptionType } from "../../components/Form/DropdownField/DropdownOptionType";
import { MonitorOptionsVM } from "../../components/Profile/MonitorOptionsVM";
import { RowingItem } from "../../core/domain/equipments/RowingItem";
import { UpdateUserRequest } from "../../core/domain/user/UpdateUserRequest";
import { User } from "../../core/domain/user/User";
import { GetAllEquipments } from "../../core/useCases/GetAllEquipments/GetAllEquipments";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { UpdateUser } from "../../core/useCases/UpdateUser/UpdateUser";
import { padNumberMonth } from "../../utils/dateUtils";
import { UserNotLoggedInError } from "../../core/domain/user/UserNotLoggedInError";

export interface ProfileView {
  showLoader();

  hideUpdateProfileForm();

  hideLoader();

  navigateToNewPath(path: string);

  showUser(userData: User);

  setErrorMessage(errorMessage: string);

  setMachineOptions(machineOptions: DropdownOptionType[]);

  setMonitorList(monitorOptions: MonitorOptionsVM[]);

  setSuccessMessage(successMessage: string);

  setLocalizationCode(localizationCode: string);
}

export class ProfilePresenter {
  private view: ProfileView;
  private getLocalizationCode: GetLocalizationCode;
  private changePassword: ChangePassword;
  private updateUser: UpdateUser;
  private trackAnalyticsPageView: TrackAnalyticsPageView;
  private getAllEquipments: GetAllEquipments;
  private getUser: GetUser;
  private locale: string;

  constructor(
    view: ProfileView,
    getLocalizationCode: GetLocalizationCode,
    changePassword: ChangePassword,
    editUser: UpdateUser,
    getAllEquipments: GetAllEquipments,
    getUser: GetUser,
    trackAnalyticsPageView: TrackAnalyticsPageView
  ) {
    this.view = view;
    this.getLocalizationCode = getLocalizationCode;
    this.changePassword = changePassword;
    this.updateUser = editUser;
    this.getAllEquipments = getAllEquipments;
    this.getUser = getUser;
    this.locale = "";
    this.trackAnalyticsPageView = trackAnalyticsPageView;
  }

  start = async () => {
    this.view.setLocalizationCode(this.getLocalizationCode.execute());
    this.view.showLoader();
    try {
      await this.trackAnalyticsPageView.execute("Profile");
      await this.initializeUser();
      await this.initializeEquipments();
    } catch (e: any) {
      if (!(e instanceof UserNotLoggedInError)) this.view.setErrorMessage(e.message);

      this.view.navigateToNewPath("login");
    }
    this.view.hideLoader();
  };

  handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      this.view.showLoader();
      await this.changePassword.execute(currentPassword, newPassword, confirmPassword);
      this.view.setSuccessMessage("Your password has been updated successfully");
      this.view.hideLoader();
    } catch (error: any) {
      this.handleErrorResponse(error);
    }
  };

  handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      this.view.showLoader();
      const user = await this.updateUser.execute(updateUserRequest);
      user?.birthday && (user.birthday = this.dateToStringFormat(new Date(user?.birthday)));
      this.view.showUser(user);
      this.view.hideUpdateProfileForm();
      this.view.hideLoader();
      this.view.setSuccessMessage("Your profile has been updated successfully");
    } catch (error: any) {
      this.handleErrorResponse(error.message);
    }
  };

  handleErrorResponse = (error: any) => {
    this.view.hideLoader();
    this.view.setErrorMessage(error?.message);
  };

  private initializeEquipments = async () => {
    const equipments = await this.getAllEquipments.execute();
    const machineOptions = equipments.map((equipment: RowingItem) => this.itemToDropdownType(equipment));
    const monitorOptions = equipments.map((equipment: RowingItem) => this.itemToMonitorOption(equipment));
    this.view.setMachineOptions(machineOptions);
    this.view.setMonitorList(monitorOptions);
  };

  private initializeUser = async () => {
    const userData = await this.getUser.execute();
    userData?.birthday && (userData.birthday = this.dateToStringFormat(new Date(userData?.birthday)));
    this.view.showUser(userData);
  };

  private itemToMonitorOption = (json: RowingItem): MonitorOptionsVM => ({
    machine: json.id,
    monitors: json.monitors?.map((monitor: any) => this.itemToDropdownType(monitor)),
  });

  private itemToDropdownType = (item: RowingItem): DropdownOptionType => ({
    key: item.id,
    text: item.title,
    value: item.title,
  });

  private dateToStringFormat = (date: Date) =>
    `${padNumberMonth(date.getMonth())}/${date.getDate() + 1}/${date.getFullYear()}`;
}
