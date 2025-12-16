import { IsAppTrialUser } from './../../core/useCases/IsAppTrialUser/IsAppTrialUser';
import { capture, instance, mock, verify, when } from "ts-mockito";
import { LoginPresenter, LoginView } from "./LoginPresenter";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { LogIn } from "../../core/useCases/LogIn/LogIn";
import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";

describe("LoginPresenter should", () => {
  it("track analytics page view on start", async () => {
    when(trackAnalyticsPageView.execute("Login")).thenResolve();

    await presenter.start();

    verify(view.showLoader()).called();
    verify(trackAnalyticsPageView.execute("Login")).called();
    verify(view.hideLoader()).called();
  });

  it("show loader after trying to log in", async () => {
    await presenter.handleLogIn(anEmail, aPassword);

    verify(view.showLoader()).calledBefore(logIn.execute(anEmail, aPassword));
  });

  it("perform request with the provided email and password", async () => {
    await presenter.handleLogIn(anEmail, aPassword);

    const [email, password] = capture(logIn.execute).last();
    expect(email).toBe(anEmail);
    expect(password).toBe(aPassword);
  });

  it("redirect to profile with the correct locale code appended to the URL if user is not In App Trial", async () => {
    when(isAppTrialUser.execute()).thenResolve(false);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);

    await presenter.handleLogIn(anEmail, aPassword);

    const [path] = capture(view.navigateToNewPath).last();
    expect(path).toBe(`/${aLocalizationCode}/profile`);
  });

  it("redirect to subscription with the correct locale code appended to the URL if user is In App Trial", async () => {
    when(isAppTrialUser.execute()).thenResolve(true);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);

    await presenter.handleLogIn(anEmail, aPassword);

    const [path] = capture(view.navigateToNewPath).last();
    expect(path).toBe(`/${aLocalizationCode}/subscription`);
  });

  it("show error messages from API", async () => {
    when(logIn.execute(anEmail, aPassword)).thenReject(new Error("Invalid Credentials"));

    await presenter.handleLogIn(anEmail, aPassword);

    verify(view.showLoader()).calledBefore(logIn.execute(anEmail, aPassword));
    verify(view.hideLoader()).calledAfter(logIn.execute(anEmail, aPassword));
    const [errorMessage] = capture(view.showErrorMessage).last();
    expect(errorMessage).toBe("Invalid Credentials");
  });

  beforeEach(() => {
    view = mock<LoginView>();
    logIn = mock<LogIn>();
    getLocalizationCode = mock<GetLocalizationCode>();
    trackAnalyticsPageView = mock<TrackAnalyticsPageView>();
    isAppTrialUser = mock<IsAppTrialUser>();
    presenter = createPresenter();
  });

  function createPresenter(): LoginPresenter {
    return new LoginPresenter(
      instance(view),
      instance(logIn),
      instance(getLocalizationCode),
      instance(trackAnalyticsPageView),
      instance(isAppTrialUser)
    );
  }

  let presenter: LoginPresenter;
  let view: LoginView;
  let logIn: LogIn;
  let getLocalizationCode: GetLocalizationCode;
  let trackAnalyticsPageView: TrackAnalyticsPageView;
  let isAppTrialUser: IsAppTrialUser;

  const anEmail = "anEmail@mail.com";
  const aPassword = "1234567";
  const aLocalizationCode = "en-us";
});
