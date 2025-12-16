// noinspection JSUnusedGlobalSymbols

import React, { FormEvent } from "react";
import Loader from "../components/Loader/Loader";
import "../components/Login/LoginPage.scss";
import { navigate } from "gatsby";
import InputField from "../components/Form/InputField/InputField";
import CustomButton from "../components/CustomButton/CustomButton";
import { PresenterFactory } from "../presenters/PresenterFactory";
import { LoginPresenter, LoginView } from "../presenters/Login/LoginPresenter";
import FlashMessage, { FlashMessageVM } from "components/FlashMessage/FlashMessage";
import Impact from "../components/Impact/Impact";
import { isEmpty } from "lodash";

class LoginPage extends React.Component<{ path: string; location: { search: string } }, State> implements LoginView {
  state: State = {
    isLoading: false,
    isEmailOk: false,
    emailValue: "",
    isPasswordOk: false,
    passwordValue: "",
    flashMessage: {
      message: "",
      type: "none",
    },
  };
  presenter: LoginPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.loginPage(this);
  }

  componentDidMount = async () => await this.presenter.start();

  hideLoader = () => this.setState({ isLoading: false });

  showLoader = () => this.setState({ isLoading: true });

  navigateToNewPath = async (path: string) => {
    const {
      location: { search },
    } = this.props;
    const params: { [key: string]: unknown } = [...new URLSearchParams(search.split("?")[1])].reduce(
      (a, [k, v]) => ((a[k] = v), a),
      {}
    );
    if (!isEmpty(params?.goBack)) {
      await navigate(-1);
    } else {
      await navigate(path);
    }
  };

  showErrorMessage = (message: string) =>
    this.setState({
      flashMessage: {
        message,
        type: "error",
      },
    });

  setEmailStatus = (emailValue, isEmailOk) => this.setState({ emailValue, isEmailOk });

  setPasswordStatus = (passwordValue, isPasswordOk) => this.setState({ passwordValue, isPasswordOk });

  logIn = async (e: FormEvent) => {
    e.preventDefault();
    const { emailValue, passwordValue } = this.state;
    await this.presenter.handleLogIn(emailValue, passwordValue);
  };

  render = () => {
    const { isLoading, passwordValue, emailValue, flashMessage } = this.state;
    const { path } = this.props;
    const setEmailStatus = this.setEmailStatus,
      setPasswordStatus = this.setPasswordStatus;
    return (
      <div className='login-page__'>
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />

        <form className='login-page__container__' onSubmit={this.logIn}>
          <div className='login-page__container__content-box__'>
            <h1 className='login-page__container__content-box__title'>Login To Your Account</h1>
            <div className='login-page__container__content-box__title-border'>.</div>
            <p className='login-page__container__content-box__description'>
              Enter your password to login to your account.
            </p>
            <InputField
              label='EMAIL'
              type='email'
              inputEvent={setEmailStatus}
              width={100}
              extraClass='login-page__container__content-box__input'
            />
            <InputField
              label='PASSWORD'
              type='password'
              linkText='Forgot Password?'
              linkDestination={path?.replace("/login", "/forgot-password") || "/forgot-password"}
              inputEvent={setPasswordStatus}
              width={100}
              extraClass='login-page__container__content-box__input'
            />
            <CustomButton type='submit' text='LOG IN' disabled={!passwordValue || !emailValue} />
          </div>
        </form>
        <Loader visible={isLoading} />
        <Impact />
      </div>
    );
  };
}

export default LoginPage;

interface State {
  isLoading: boolean;
  isEmailOk: boolean;
  emailValue: string;
  isPasswordOk: boolean;
  passwordValue: string;
  flashMessage: FlashMessageVM;
}
