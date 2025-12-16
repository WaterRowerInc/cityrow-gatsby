// noinspection JSVoidFunctionReturnValueUsed

import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { LogOut } from "../../core/useCases/LogOut/LogOut";
import { HeaderPresenter, HeaderView } from "./HeaderPresenter";

describe("HeaderPresenter should", () => {
  it("initialize header with localization code", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);

    await presenter.start(somePath);

    const [localizationCode] = capture(view.setLocalizationCode).last();
    expect(localizationCode).toBe(aLocalizationCode);
  });

  it("initialize header with user", async () => {
    when(getUser.execute()).thenResolve(anUser);

    await presenter.start(somePath);

    const [user] = capture(view.setUser).last();
    expect(user).toBe(anUser);
  });

  it("update user when an update is received", async () => {
    const subscription = { unsubscribe: jest.fn() };
    when(getUser.execute()).thenResolve(anUser);
    when(getUser.subscribe(anything())).thenReturn(subscription);

    await presenter.start(somePath);

    const [updateUserCallback] = capture(getUser.subscribe).last();
    updateUserCallback(anotherUser);
    const [user] = capture(view.setUser).last();
    expect(user).toBe(anotherUser);
  });

  it("perform logout but do not redirect if user selected that option and the page is not profile or subscription", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    await presenter.start("notProfileNorSubscriptionPage");

    await presenter.handleProfileOptionClick("logout");

    verify(logOut.execute()).called();
    verify(view.navigateToNewPath(`/${aLocalizationCode}`)).never();
  });

  it("perform logout and home redirection if user selected that option and is located in the profile page", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    await presenter.start("profile");

    await presenter.handleProfileOptionClick("logout");

    verify(logOut.execute()).called();
    verify(view.navigateToNewPath(`/${aLocalizationCode}`)).called();
  });

  it("perform logout and home redirection if user selected that option and is located in the subscription page", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    await presenter.start("subscription");

    await presenter.handleProfileOptionClick("logout");

    verify(logOut.execute()).called();
    verify(view.navigateToNewPath(`/${aLocalizationCode}`)).called();
  });

  it("navigate to profile if user selected that option", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);

    await presenter.handleProfileOptionClick("profile");

    verify(view.navigateToNewPath(`/${aLocalizationCode}/profile`)).called();
  });

  it("navigate to profile if user selected that option", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);

    await presenter.handleProfileOptionClick("profile");

    const [path] = capture(view.navigateToNewPath).last();
    expect(path).toBe(`/${aLocalizationCode}/profile`);
  });

  it("remove subscription to user updates when disposing", async () => {
    const subscription = { unsubscribe: jest.fn() };
    when(getUser.execute()).thenResolve(anUser);
    when(getUser.subscribe(anything())).thenReturn(subscription);

    await presenter.start(somePath);
    presenter.dispose();

    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  beforeEach(() => {
    view = mock<HeaderView>();
    getUser = mock<GetUser>();
    logOut = mock<LogOut>();
    getLocalizationCode = mock<GetLocalizationCode>();
    presenter = createPresenter();
  });

  function createPresenter(): HeaderPresenter {
    return new HeaderPresenter(instance(view), instance(getLocalizationCode), instance(getUser), instance(logOut));
  }

  let presenter: HeaderPresenter;
  let view: HeaderView;
  let getUser: GetUser;
  let getLocalizationCode: GetLocalizationCode;
  let logOut: LogOut;

  const aLocalizationCode = "en-us";
  const anUser = {
    firstName: "Test",
    lastName: "User",
    email: "test@email.com",
  };

  const anotherUser = {
    firstName: "Test",
    lastName: "User 2",
    email: "test@email.com",
  };
  const somePath = "somePath";
});
