import InputField from "../../Form/InputField/InputField";
import React from "react";

const AccountForm = ({
  accountEmailRef,
  confirmPassword,
  password,
  updateFormValue,
  visible,
}: {
  accountEmailRef: any;
  confirmPassword: string;
  password?: string;
  updateFormValue: any;
  visible: boolean;
}) => {
  const [accountEmailError, setAccountEmailError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("This field is required");
  const [passwordError, setPasswordError] = React.useState("This field is required");
  const [givenError, setGivenError] = React.useState("");
  const isWindowDefined = () => typeof window !== "undefined";

  const switchGivenError = (existsError) => {
    if (existsError) {
      setConfirmPasswordError("Passwords do not match");
      setGivenError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
      setGivenError("");
    }
  };

  const updateErrorValue = (key, value, errorFound) => {
    switch (key) {
      case "accountEmail":
        setAccountEmailError(errorFound);
        break;
      case "password":
        setPasswordError(errorFound);
        switchGivenError(value !== confirmPassword);
        break;
      case "confirmPassword":
        setConfirmPasswordError(errorFound);
        switchGivenError(value !== password);
        break;
      default:
        break;
    }
    updateFormValue(key, value);
  };

  React.useEffect(() => {
    updateFormValue(
      "isAccountFormOk",
      !accountEmailError.length && !confirmPasswordError.length && !passwordError.length
    );
  }, [accountEmailError, confirmPasswordError, passwordError]);

  return (
    <div className={!visible ? "checkout-page__container__flow-container__account-creation-modal" : ""}>
      <h1 className={"checkout-page__container__flow-container__big-title"}>{"Create Account"}</h1>
      <div className={"checkout-page__container__flow-container__account-creation-details__"}>
        <h4 className={"checkout-page__container__flow-container__account-creation-details__bold-text"}>
          {"You'll use this to log in to the app and manage your subscription."}
        </h4>
        <h4 className={"checkout-page__container__flow-container__account-creation-details__normal-text"}>
          {"Please enter details for your CITYROW account."}
        </h4>
      </div>
      <div className={"checkout-page__container__flow-container__input-row"}>
        <InputField
          width={50}
          label='EMAIL'
          type='email'
          refe={accountEmailRef}
          inputEvent={(value, errorFound) => updateErrorValue("accountEmail", value, errorFound)}
        />
      </div>
      <div className={"checkout-page__container__flow-container__input-row"}>
        <InputField
          width={50}
          label='CREATE PASSWORD'
          type='password'
          required={true}
          inputEvent={(value, errorFound) => updateErrorValue("password", value, errorFound)}
        />
      </div>
      <div className={"checkout-page__container__flow-container__input-row"}>
        <InputField
          width={50}
          label='CONFIRM PASSWORD'
          type='confirmPassword'
          required={true}
          givenError={givenError}
          inputEvent={(value, errorFound) => updateErrorValue("confirmPassword", value, errorFound)}
        />
      </div>
      <div className={"checkout-page__container__flow-container__input-row"}>
        <p className={"checkout-page__login-copy"}>
          {"Already have an account with us? "}
          <a href={isWindowDefined() ? window.location.href.toString().replace("checkout", "login") : ""}>Log In</a>
        </p>
      </div>
    </div>
  );
};

export default AccountForm;
