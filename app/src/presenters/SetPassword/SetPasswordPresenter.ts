import { SetPassword } from './../../core/useCases/SetPassword/SetPassword';

export interface SetPasswordView {
  showLoader();

  hideLoader();

  showSuccessView();

  showErrorMessage(message: string);

  hideErrorMessage();

  navigateToNewPath(path: string);
}

export class SetPasswordPresenter {
  private view: SetPasswordView;
  private setPassword: SetPassword;

  constructor(view: SetPasswordView, setPassowrd: SetPassword) {
    this.view = view;
    this.setPassword = setPassowrd;
  }

  handleSetPassword = async (token: string, password: string) => {
    try {
      this.view.hideErrorMessage();
      this.view.showLoader();
      await this.setPassword.execute(token, password);
      this.view.hideLoader();
      this.view.showSuccessView();
    } catch (error: any) {
      this.view.hideLoader();
      this.view.showErrorMessage(error?.message);
    }
  };
}
