// noinspection JSUnusedGlobalSymbols

import InputField from "../components/Form/InputField/InputField";
import CustomButton from "../components/CustomButton/CustomButton";
import { Link, navigate } from "gatsby";
import { PresenterFactory } from "../presenters/PresenterFactory";
import React from "react";
import Loader from "../components/Loader/Loader";
import "../components/Profile/ProfilePage.scss";
import { ProfilePresenter, ProfileView } from "../presenters/Profile/ProfilePresenter";
import FlashMessage, { FlashMessageVM } from "../components/FlashMessage/FlashMessage";
import { User } from "../core/domain/user/User";
import { ProfileInfo } from "../components/Profile/ProfileInfo";
import { UpdateProfileInfoForm } from "../components/Profile/UpdateProfileInfoForm";
import { DropdownOptionType } from "../components/Form/DropdownField/DropdownOptionType";
import { MonitorOptionsVM } from "../components/Profile/MonitorOptionsVM";
import { months, padDay, padStringMonth } from "../utils/dateUtils";
import ProfileTopBar from "../components/Profile/ProfileTopBar";
import Impact from "../components/Impact/Impact";

class ProfilePage extends React.Component<State> implements ProfileView {
  state: State = {
    confirmPasswordValue: "",
    confirmPasswordError: " ",
    currentPasswordValue: "",
    currentPasswordError: " ",
    day: "1",
    dayOptions: [{ key: "", value: "", text: "" }],
    enableSaveButton: true,
    firstName: "",
    firstNameError: "",
    flashMessage: {
      message: "",
      type: "none",
    },
    forgotPasswordUrl: "",
    isLoading: false,
    isUpdateUserFormVisible: false,
    lastName: "",
    lastNameError: "",
    localizationCode: "",
    machine: "",
    machineOptions: [],
    monitor: "",
    monitorList: [],
    monitorOptions: [],
    month: "1",
    newPasswordValue: "",
    newPasswordError: " ",
    userData: null,
    year: "1990",
  };
  presenter: ProfilePresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.profilePage(this);
  }

  componentDidMount = async () => {
    await this.presenter.start();
    this.setState({
      forgotPasswordUrl:
        typeof window !== "undefined" ? window.location.href.toString().replace("profile", "forgot-password") : "",
    });
    this.populateDays();
  };

  changePassword = async () => {
    const { currentPasswordValue, newPasswordValue, confirmPasswordValue } = this.state;
    await this.presenter.handleChangePassword(currentPasswordValue, newPasswordValue, confirmPasswordValue);
  };

  editUser = async () => {
    const { firstName, lastName, day, month, year, machine, machineOptions, monitor, monitorOptions } = this.state;
    await this.presenter.handleUpdateUser({
      firstName,
      lastName,
      machine: machineOptions.find((option: DropdownOptionType) => option.value === machine)?.key || "",
      monitor: monitorOptions.find((option: DropdownOptionType) => option.value === monitor)?.key || "",
      birthday: `${year}-${padStringMonth(month)}-${padDay(day)}`,
    });
  };

  getMonitorOptions = (machineTitle?: string) => {
    if (!machineTitle) return;
    const { monitorList, machineOptions } = this.state;
    const machineId = machineOptions.find((option) => option.value === machineTitle)?.key;
    return monitorList.find((option) => option.machine === machineId)?.monitors || [];
  };

  hideUpdateProfileForm = () => this.setState({ isUpdateUserFormVisible: false });

  hideLoader = () => this.setState({ isLoading: false });

  navigateToNewPath = (path: string) => navigate(`/${this.state.localizationCode}/${path}`);

  showUser = (userData: User | null) => {
    if (userData) {
      const dates = userData.birthday ? userData.birthday?.split("/") : [];
      this.setState(
        {
          userData,
          year: dates?.[2] || new Date().getFullYear().toString(),
          month: months[parseInt(dates?.[0] || "1") - 1],
          day: dates?.[1] || "1",
          machine: userData?.machineTitle || "",
          monitor: userData?.monitorTitle || "",
          monitorOptions: this.getMonitorOptions(userData?.machineTitle) || [],
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.email,
        },
        () => this.setDefaultMonitor()
      );
    } else {
      this.setState({ userData });
    }
  };

  populateDays = () => {
    const { month, year } = this.state;
    const currentDate = new Date();
    const dayOptions: DropdownOptionType[] = [];
    const sampleDate = new Date(
      year ? parseInt(year) : currentDate.getFullYear(),
      month ? months.indexOf(month) + 1 : 0,
      0
    );
    for (let i = 1; i <= sampleDate.getDate(); i++) {
      dayOptions.push({ key: i.toString(), value: i.toString(), text: i.toString() });
    }
    this.setState({ dayOptions });
  };

  setConfirmPassword = (confirmPasswordValue, confirmPasswordError) =>
    this.setState({ confirmPasswordValue, confirmPasswordError });

  setCurrentPassword = (currentPasswordValue, currentPasswordError) =>
    this.setState({ currentPasswordValue, currentPasswordError });

  setDefaultMonitor = () => {
    const { machine } = this.state;
    const monitorOptions = this.getMonitorOptions(machine) || [];
    this.setState({ monitorOptions, monitor: monitorOptions?.[0]?.value });
  };

  setErrorMessage = (message) =>
    this.setState({
      flashMessage: {
        message,
        type: "error",
      },
    });

  setMachineOptions = (machineOptions: DropdownOptionType[]) => this.setState({ machineOptions });

  setMonitorList = (monitorList: MonitorOptionsVM[]) => {
    this.setState({ monitorList }, () => {
      this.setDefaultMonitor();
    });
  };

  setNewPassword = (newPasswordValue, newPasswordError) => {
    this.setState({ newPasswordValue, newPasswordError });
  };

  setSuccessMessage = (message) =>
    this.setState(
      {
        flashMessage: {
          message,
          type: "none",
        },
      },
      () =>
        this.setState({
          flashMessage: {
            message,
            type: "success",
          },
        })
    );

  setValue = (key: string, value: string, error?: string) => {
    const stateUpdate = { [key]: value };
    if (key !== "birthday" && key !== "machine" && key !== "monitor") {
      stateUpdate[`${key}Error`] = error || "";
    }
    this.setState(stateUpdate, () => {
      if (key === "machine") {
        this.setDefaultMonitor();
      } else if (key === "year" || key === "month") {
        this.populateDays();
      } else if (key === "firstName" || key === "lastName") {
        const { firstNameError, lastNameError } = this.state;
        this.setState({ enableSaveButton: !(firstNameError || lastNameError) });
      }
    });
  };

  setLocalizationCode = (localizationCode: string) => this.setState({ localizationCode });

  showLoader = () => this.setState({ isLoading: true });

  showUpdateProfileForm = () => this.setState({ isUpdateUserFormVisible: true });

  render = () => {
    const {
      day,
      dayOptions,
      confirmPasswordError,
      currentPasswordError,
      enableSaveButton,
      flashMessage,
      firstName,
      firstNameError,
      forgotPasswordUrl,
      isUpdateUserFormVisible,
      isLoading,
      lastName,
      lastNameError,
      localizationCode,
      machine,
      machineOptions,
      monitor,
      monitorOptions,
      month,
      newPasswordError,
      userData,
      year,
    } = this.state;
    return (
      <div className='profile-page__'>
        <ProfileTopBar
          name={`${firstName} ${lastName}`}
          dateJoined={userData?.dateJoined}
          localizationCode={localizationCode}
          page='profile'
        />
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
        <div className='profile-page__container__'>
          <div className='profile-page__container__content-box__'>
            <h1 className='profile-page__container__content-box__title'>Profile Info</h1>
            <div className='profile-page__container__content-box__title-border'>.</div>
            {isUpdateUserFormVisible ? (
              <UpdateProfileInfoForm
                cancelAction={this.hideUpdateProfileForm}
                day={day}
                dayOptions={dayOptions}
                email={userData?.email}
                enableSaveButton={enableSaveButton}
                firstName={firstName}
                firstNameError={firstNameError}
                lastName={lastName}
                lastNameError={lastNameError}
                machine={machine}
                machineOptions={machineOptions}
                monitor={monitor}
                monitorOptions={monitorOptions}
                month={month}
                saveAction={this.editUser}
                setValue={this.setValue}
                year={year}
              />
            ) : (
              <ProfileInfo showEditForm={this.showUpdateProfileForm} userData={userData} />
            )}
            <h1 className='profile-page__container__content-box__title'>Change Password</h1>
            <div className='profile-page__container__content-box__title-border'>.</div>
            <div className='profile-page__change-password__container'>
              <InputField
                label='CURRENT PASSWORD'
                type='password'
                required
                inputEvent={this.setCurrentPassword}
                width={100}
              />
              <Link to={forgotPasswordUrl} className='profile-page__change-password__forgot-password'>
                Forgot password?
              </Link>
              <InputField label='NEW PASSWORD' type='password' inputEvent={this.setNewPassword} required width={100} />
              <InputField
                label='CONFIRM PASSWORD'
                type='password'
                inputEvent={this.setConfirmPassword}
                required
                width={100}
              />
            </div>
            <CustomButton
              onClick={this.changePassword}
              text='SAVE CHANGES'
              disabled={!!currentPasswordError || !!newPasswordError || !!confirmPasswordError}
            />
          </div>
          <Loader visible={isLoading} />
          <Impact />
        </div>
      </div>
    );
  };
}

export default ProfilePage;

interface State {
  dayOptions: DropdownOptionType[];
  day: string;
  firstName: string;
  firstNameError: string;
  enableSaveButton: boolean;
  forgotPasswordUrl: string;
  isLoading: boolean;
  isUpdateUserFormVisible: boolean;
  userData: any;
  currentPasswordValue: string;
  currentPasswordError: string;
  lastName: string;
  lastNameError: string;
  localizationCode: string;
  machine: string;
  machineOptions: DropdownOptionType[];
  monitor: string;
  monitorList: MonitorOptionsVM[];
  monitorOptions: DropdownOptionType[];
  month: string;
  newPasswordValue: string;
  newPasswordError: string;
  confirmPasswordValue: string;
  confirmPasswordError: string;
  flashMessage: FlashMessageVM;
  year: string;
}
