import { ResetPassword } from "core/useCases/ResetPassword/ResetPassword";

export interface ForgotPasswordView {
  showLoader();

  hideLoader();

  showSuccessView();

  showErrorMessage(message: string);

  hideErrorMessage();

  navigateToNewPath(path: string);
}

export class ForgotPasswordPresenter {
  private view: ForgotPasswordView;
  private resetPassword: ResetPassword;

  constructor(view: ForgotPasswordView, resetPassword: ResetPassword) {
    this.view = view;
    this.resetPassword = resetPassword;
  }

  handleResetPassword = async (email: string) => {
    try {
      this.view.hideErrorMessage();
      this.view.showLoader();
      await this.resetPassword.execute(email);
      this.view.hideLoader();
      this.view.showSuccessView();
    } catch (error: any) {
      this.view.hideLoader();
      this.view.showErrorMessage(error?.message);
    }
  };
}
