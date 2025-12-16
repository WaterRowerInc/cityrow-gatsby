import { capture, instance, mock, verify, when } from "ts-mockito";
import { ForgotPasswordPresenter, ForgotPasswordView } from "./ForgotPasswordPresenter";
import { ResetPassword } from "../../core/useCases/ResetPassword/ResetPassword";

describe("ForgotPasswordPresenter should", () => {
  it("show loader after trying to reset password", async () => {
    await presenter.handleResetPassword(anEmail);

    verify(view.showLoader()).calledBefore(resetPassword.execute(anEmail));
  });

  it("perform request with the provided email", async () => {
    await presenter.handleResetPassword(anEmail);

    const [email] = capture(resetPassword.execute).last();
    expect(email).toBe(anEmail);
  });

  it("show the success view when reset password succeeds", async () => {
    when(resetPassword.execute(anEmail)).thenResolve();

    await presenter.handleResetPassword(anEmail);

    verify(view.showSuccessView()).calledAfter(view.showLoader());
  });

  it("hide the loader when reset password succeeds", async () => {
    when(resetPassword.execute(anEmail)).thenResolve();

    await presenter.handleResetPassword(anEmail);

    verify(view.hideLoader()).calledAfter(view.showLoader());
  });

  it("hide error message when reset password succeeds", async () => {
    when(resetPassword.execute(anEmail)).thenResolve();

    await presenter.handleResetPassword(anEmail);

    verify(view.hideErrorMessage()).called();
  });

  it("show error messages from API", async () => {
    when(resetPassword.execute(anEmail)).thenReject(new Error("Email is not registered"));

    await presenter.handleResetPassword(anEmail);

    const [errorMessage] = capture(view.showErrorMessage).last();
    expect(errorMessage).toBe("Email is not registered");
  });

  it("hide loader when error happens", async () => {
    when(resetPassword.execute(anEmail)).thenReject(new Error("Email is not registered"));

    await presenter.handleResetPassword(anEmail);

    verify(view.hideLoader()).calledAfter(resetPassword.execute(anEmail));
  });

  beforeEach(() => {
    view = mock<ForgotPasswordView>();
    resetPassword = mock<ResetPassword>();
    presenter = createPresenter();
  });

  function createPresenter(): ForgotPasswordPresenter {
    return new ForgotPasswordPresenter(instance(view), instance(resetPassword));
  }

  let presenter: ForgotPasswordPresenter;
  let view: ForgotPasswordView;
  let resetPassword: ResetPassword;

  const anEmail = "test@user.com";
});
