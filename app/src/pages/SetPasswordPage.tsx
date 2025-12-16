// noinspection JSUnusedGlobalSymbols

import React from "react";
import Loader from "../components/Loader/Loader";
import "../components/SetPassword/SetPasswordPage.scss";
import { navigate } from "gatsby";
import InputField from "../components/Form/InputField/InputField";
import CustomButton from "../components/CustomButton/CustomButton";
import { PresenterFactory } from "../presenters/PresenterFactory";
import FlashMessage, { FlashMessageVM } from "components/FlashMessage/FlashMessage";
import SuccessIcon from "../assets/images/successIcon.svg";
import CTAButton from "components/CTAButton/CTAButton";
import { SetPasswordPresenter, SetPasswordView } from "../presenters/SetPassword/SetPasswordPresenter";
import Impact from "../components/Impact/Impact";

class SetPassword extends React.PureComponent<State> implements SetPasswordView {
  state: State = {
    isLoading: false,
    hasPasswordBeenReset: false,
    passwordValue: "",
    passwordConfirmationValue: "",
    passwordError: "",
    passwordConfirmationError: "",
    token: "",
    flashMessage: {
      message: "",
      type: "none",
    },
  };
  presenter: SetPasswordPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.setPasswordPage(this);
  }

  componentDidMount() {
    const search = window.location.search;
    const token = new URLSearchParams(search).get("token");
    this.setState({ token });
  }

  hideLoader = () => this.setState({ isLoading: false });

  showLoader = () => this.setState({ isLoading: true });

  showSuccessView = () => this.setState({ hasPasswordBeenReset: true });

  navigateToNewPath = async (path: string) => await navigate(path);

  showErrorMessage = (message: string) =>
    this.setState({
      flashMessage: {
        message,
        type: "error",
      },
    });

  hideErrorMessage = () =>
    this.setState({
      flashMessage: {
        message: "",
        type: "none",
      },
    });

  setPasswordStatus = (passwordValue: string, passwordError: string) => this.setState({ passwordValue, passwordError });

  setPasswordConfirmationStatus = (passwordConfirmationValue: string, passwordConfirmationError: string) =>
    this.setState({ passwordConfirmationValue, passwordConfirmationError });

  passwordsMatch = () => {
    const { passwordValue, passwordConfirmationValue } = this.state;
    return passwordValue === passwordConfirmationValue;
  };

  setPassword = async () => {
    const { token, passwordValue } = this.state;
    await this.presenter.handleSetPassword(token, passwordValue);
  };

  render = () => {
    const { isLoading, passwordError, passwordConfirmationError, flashMessage, hasPasswordBeenReset } = this.state;

    return (
      <div className='set-password-page__'>
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />

        <div className='set-password-page__container__'>
          <div className='set-password-page__container__content-box__'>
            {hasPasswordBeenReset && <img src={SuccessIcon} alt='password reset successfully' />}
            <h1 className='set-password-page__container__content-box__title'>
              {!hasPasswordBeenReset ? "Reset Password" : "All Set!"}
            </h1>
            <div className='set-password-page__container__content-box__title-border' />
            {hasPasswordBeenReset && (
              <p className='set-password-page__container__content-box__description'>
                Your password has been successfully reset!
              </p>
            )}

            {hasPasswordBeenReset ? (
              <CTAButton goTo='/login' text='BACK TO LOGIN' />
            ) : (
              <>
                <InputField
                  label='PASSWORD'
                  required
                  type='password'
                  inputEvent={this.setPasswordStatus}
                  width={100}
                  extraClass='set-password-page__container__content-box__input'
                />
                <InputField
                  label='CONFIRM PASSWORD'
                  required
                  type='password'
                  inputEvent={this.setPasswordConfirmationStatus}
                  width={100}
                  extraClass='set-password-page__container__content-box__input'
                />
                <CustomButton
                  onClick={this.setPassword}
                  text='RESET PASSWORD'
                  disabled={!this.passwordsMatch() || !!passwordError || !!passwordConfirmationError}
                />
              </>
            )}
          </div>
        </div>
        <Loader visible={isLoading} />
        <Impact />
      </div>
    );
  };
}

export default SetPassword;

interface State {
  isLoading: boolean;
  passwordValue: string;
  passwordConfirmationValue: string;
  passwordError: string;
  passwordConfirmationError: string;
  hasPasswordBeenReset: boolean;
  token: string;
  flashMessage: FlashMessageVM;
}
