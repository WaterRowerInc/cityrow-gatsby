import { anything, instance, mock, verify, when } from "ts-mockito";
import { PasswordsDontMatchError } from "../../core/domain/auth/PasswordsDontMatchError";
import { ChangePassword } from "../../core/useCases/ChangePassword/ChangePassword";
import { GetAllEquipments } from "../../core/useCases/GetAllEquipments/GetAllEquipments";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { UpdateUser } from "../../core/useCases/UpdateUser/UpdateUser";
import { UserNotLoggedInError } from "./../../core/domain/user/UserNotLoggedInError";
import { ProfilePresenter, ProfileView } from "./ProfilePresenter";

const anEmptyEquipmentsResponse = [];
const aUser = { firstName: "Text", lastName: "User", email: "user@test.com", birthday: "" };

describe("ProfilePresenter should", () => {
  it("track analytics page view on start", async () => {
    when(trackAnalyticsPageView.execute("Profile")).thenResolve();
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);

    await presenter.start();

    verify(view.showLoader()).called();
    verify(trackAnalyticsPageView.execute("Profile")).called();
    verify(view.hideLoader()).called();
  });

  it("get all equipments", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);

    await presenter.start();

    verify(getAllEquipments.execute()).called();
  });

  it("set machine options", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);

    await presenter.start();

    verify(view.setMachineOptions(anything())).called();
  });

  it("set monitor options", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);

    await presenter.start();

    verify(view.setMonitorList(anything())).called();
  });

  it("get user data on start", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);
    when(getUser.execute()).thenResolve(anything());

    await presenter.start();

    verify(getUser.execute()).called();
  });

  it("show user data on start", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);
    when(getUser.execute()).thenResolve(aUser);
    when(view.showUser(aUser)).thenResolve(anything());

    await presenter.start();

    verify(view.showUser(aUser)).called();
  });

  it("show an error message for any error on start", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);
    when(getUser.execute()).thenThrow(new Error("Some error message"));

    await presenter.start();

    verify(view.setErrorMessage(anything())).called();
  });

  it("hide loader on start", async () => {
    when(getAllEquipments.execute()).thenResolve(anEmptyEquipmentsResponse);
    when(getUser.execute()).thenResolve(aUser);
    when(view.showUser(aUser)).thenResolve(anything());

    await presenter.start();

    verify(view.hideLoader()).called();
  });

  it("show error if new password and confirm password don't match", async () => {
    when(changePassword.execute(currentPassword, newPassword, confirmPasswordBad)).thenThrow(
      new PasswordsDontMatchError()
    );

    await presenter.handleChangePassword(currentPassword, newPassword, confirmPasswordBad);

    verify(view.setErrorMessage("Your new password doesn't match the confirm password")).called();
  });

  it("hide loader if new password and confirm password don't match", async () => {
    when(changePassword.execute(currentPassword, newPassword, confirmPasswordBad)).thenThrow(
      new PasswordsDontMatchError()
    );

    await presenter.handleChangePassword(currentPassword, newPassword, confirmPasswordBad);

    verify(view.hideLoader()).calledAfter(changePassword.execute(currentPassword, newPassword, confirmPasswordBad));
  });

  it("show loader after trying to change password and new password and confirm password match", async () => {
    when(changePassword.execute(currentPassword, newPassword, newPassword)).thenResolve();

    await presenter.handleChangePassword(currentPassword, newPassword, confirmPasswordGood);

    verify(view.showLoader()).calledBefore(changePassword.execute(currentPassword, newPassword, confirmPasswordGood));
  });

  it("hide loader after password change succeeds", async () => {
    when(changePassword.execute(currentPassword, newPassword, confirmPasswordGood)).thenResolve();

    await presenter.handleChangePassword(currentPassword, newPassword, confirmPasswordGood);

    verify(view.hideLoader()).calledAfter(changePassword.execute(currentPassword, newPassword, confirmPasswordGood));
  });

  it("show success message after changing password", async () => {
    when(changePassword.execute(currentPassword, newPassword, confirmPasswordGood)).thenResolve();

    await presenter.handleChangePassword(currentPassword, newPassword, confirmPasswordGood);

    verify(view.setSuccessMessage("Your password has been updated successfully")).calledAfter(
      changePassword.execute(currentPassword, newPassword, confirmPasswordGood)
    );
  });

  it("show error message and hide loader when API call fails", async () => {
    when(changePassword.execute(currentPassword, newPassword, confirmPasswordGood)).thenThrow(new Error("My Error"));

    await presenter.handleChangePassword(currentPassword, newPassword, confirmPasswordGood);

    verify(view.setErrorMessage("My Error")).called();
    verify(view.hideLoader()).calledBefore(view.setErrorMessage("My Error"));
  });

  it("show loader before updating the user", async () => {
    await presenter.handleUpdateUser(anything());

    verify(view.showLoader()).called();
  });

  it("update the user", async () => {
    when(updateUser.execute(anything())).thenResolve(anything());

    await presenter.handleUpdateUser(anything());

    verify(updateUser.execute(anything())).called();
  });

  it("show new user data", async () => {
    await presenter.handleUpdateUser(anything());

    verify(view.showUser(anything())).called();
  });

  it("hide update form after updating the user", async () => {
    await presenter.handleUpdateUser(anything());

    verify(view.hideUpdateProfileForm()).called();
  });

  it("show a success message after updating the user", async () => {
    await presenter.handleUpdateUser(anything());

    verify(view.setSuccessMessage(anything())).called();
  });

  it("hide loader before updating the user", async () => {
    await presenter.handleUpdateUser(anything());

    verify(view.hideLoader()).called();
  });

  it("show an error message for any errors when updating the user", async () => {
    when(updateUser.execute(anything())).thenThrow(new Error("Some error message"));

    await presenter.handleUpdateUser(anything());

    verify(view.setErrorMessage(anything())).called();
  });

  it("redirect to login if user is not logged in", async () => {
    when(getUser.execute()).thenThrow(new UserNotLoggedInError());

    await presenter.start();

    verify(view.navigateToNewPath("login")).called();
  });

  beforeEach(() => {
    view = mock<ProfileView>();
    getLocalizationCode = mock<GetLocalizationCode>();
    changePassword = mock<ChangePassword>();
    getAllEquipments = mock<GetAllEquipments>();
    getUser = mock<GetUser>();
    trackAnalyticsPageView = mock<TrackAnalyticsPageView>();
    updateUser = mock<UpdateUser>();
    presenter = createPresenter();
  });

  function createPresenter(): ProfilePresenter {
    return new ProfilePresenter(
      instance(view),
      instance(getLocalizationCode),
      instance(changePassword),
      instance(updateUser),
      instance(getAllEquipments),
      instance(getUser),
      instance(trackAnalyticsPageView)
    );
  }

  let presenter: ProfilePresenter;
  let view: ProfileView;
  let getLocalizationCode: GetLocalizationCode;
  let changePassword: ChangePassword;
  let getAllEquipments: GetAllEquipments;
  let getUser: GetUser;
  let trackAnalyticsPageView: TrackAnalyticsPageView;
  let updateUser: UpdateUser;

  const currentPassword = "currentPassword";
  const newPassword = "newPassword";
  const confirmPasswordGood = "newPassword";
  const confirmPasswordBad = "doesn'tMatch";
});
