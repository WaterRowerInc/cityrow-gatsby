import React from "react";
import Loader from "../components/Loader/Loader";
import "../components/ForgotPassword/ForgotPasswordPage.scss";
import { navigate } from "gatsby";
import InputField from "../components/Form/InputField/InputField";
import CustomButton from "../components/CustomButton/CustomButton";
import { PresenterFactory } from "../presenters/PresenterFactory";
import FlashMessage, { FlashMessageVM } from "components/FlashMessage/FlashMessage";
import { ForgotPasswordPresenter, ForgotPasswordView } from "presenters/ForgotPassword/ForgotPasswordPresenter";
import SuccessIcon from "../assets/images/successIcon.svg";
import CTAButton from "components/CTAButton/CTAButton";

class ForgotPassword extends React.Component<State> implements ForgotPasswordView {
  state: State = {
    isLoading: false,
    isEmailInvalid: false,
    hasPasswordBeenReset: false,
    emailValue: "",
    flashMessage: {
      message: "",
      type: "none",
    },
  };
  presenter: ForgotPasswordPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.forgotPasswordPage(this);
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

  setEmailStatus = (emailValue, isEmailInvalid) => this.setState({ emailValue, isEmailInvalid });

  resetPassword = async () => {
    const { emailValue } = this.state;
    await this.presenter.handleResetPassword(emailValue);
  };

  render = () => {
    const { isLoading, emailValue, flashMessage, isEmailInvalid, hasPasswordBeenReset } = this.state;

    return (
      <div className='forgot-password-page__'>
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />

        <div className='forgot-password-page__container__'>
          <div className='forgot-password-page__container__content-box__'>
            {hasPasswordBeenReset && <img src={SuccessIcon} alt='password reset successfully' />}
            <h1 className='forgot-password-page__container__content-box__title'>Forgot Password</h1>
            <div className='forgot-password-page__container__content-box__title-border' />
            <p className='forgot-password-page__container__content-box__description'>
              {hasPasswordBeenReset
                ? "An email has been sent with a link to reset your password."
                : "Enter the email address used to set up your account."}
            </p>

            {hasPasswordBeenReset ? (
              <CTAButton goTo='/login' text='BACK TO LOGIN' />
            ) : (
              <>
                <InputField
                  label='EMAIL'
                  required
                  type='email'
                  inputEvent={this.setEmailStatus}
                  width={100}
                  extraClass='forgot-password-page__container__content-box__input'
                />
                <CustomButton
                  onClick={this.resetPassword}
                  text='RESET PASSWORD'
                  disabled={!emailValue || isEmailInvalid}
                />
              </>
            )}
          </div>
        </div>
        <Loader visible={isLoading} />
      </div>
    );
  };
}

export default ForgotPassword;

interface State {
  isLoading: boolean;
  isEmailInvalid: boolean;
  emailValue: string;
  hasPasswordBeenReset: boolean;
  flashMessage: FlashMessageVM;
}
