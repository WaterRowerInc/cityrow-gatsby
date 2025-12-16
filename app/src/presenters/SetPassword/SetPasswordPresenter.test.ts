import { SetPassword } from "./../../core/useCases/SetPassword/SetPassword";
import { capture, instance, mock, verify, when } from "ts-mockito";
import { SetPasswordPresenter, SetPasswordView } from "./SetPasswordPresenter";

describe("SetPasswordPresenter should", () => {
  it("show loader after trying to set password", async () => {
    await presenter.handleSetPassword(aToken, aPassword);

    verify(view.showLoader()).calledBefore(setPassword.execute(aToken, aPassword));
  });

  it("perform request with the provided token / email", async () => {
    await presenter.handleSetPassword(aToken, aPassword);

    const [token, password] = capture(setPassword.execute).last();
    expect(token).toBe(aToken);
    expect(password).toBe(aPassword);
  });

  it("show the success view when set password succeeds", async () => {
    when(setPassword.execute(aToken, aPassword)).thenResolve();

    await presenter.handleSetPassword(aToken, aPassword);

    verify(view.showSuccessView()).calledAfter(view.showLoader());
  });

  it("hide the loader when set password succeeds", async () => {
    when(setPassword.execute(aToken, aPassword)).thenResolve();

    await presenter.handleSetPassword(aToken, aPassword);

    verify(view.hideLoader()).calledAfter(view.showLoader());
  });

  it("hide error message when set password succeeds", async () => {
    when(setPassword.execute(aToken, aPassword)).thenResolve();

    await presenter.handleSetPassword(aToken, aPassword);

    verify(view.hideErrorMessage()).called();
  });

  it("show error messages from API", async () => {
    when(setPassword.execute(aToken, aPassword)).thenReject(new Error("Token expired"));

    await presenter.handleSetPassword(aToken, aPassword);

    const [errorMessage] = capture(view.showErrorMessage).last();
    expect(errorMessage).toBe("Token expired");
  });

  it("hide loader when error happens", async () => {
    when(setPassword.execute(aToken, aPassword)).thenReject(new Error("Token expired"));

    await presenter.handleSetPassword(aToken, aPassword);

    verify(view.hideLoader()).calledAfter(setPassword.execute(aToken, aPassword));
  });

  beforeEach(() => {
    view = mock<SetPasswordView>();
    setPassword = mock<SetPassword>();
    presenter = createPresenter();
  });

  function createPresenter(): SetPasswordPresenter {
    return new SetPasswordPresenter(instance(view), instance(setPassword));
  }

  let presenter: SetPasswordPresenter;
  let view: SetPasswordView;
  let setPassword: SetPassword;

  const aPassword = "aValidPassword";
  const aToken = "aToken";
});
