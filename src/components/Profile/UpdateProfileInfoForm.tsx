import React from "react";
import InputField from "../Form/InputField/InputField";
import DropdownField from "../Form/DropdownField/DropdownField";
import { DropdownOptionType } from "../Form/DropdownField/DropdownOptionType";
import DateField from "../Form/DateField/DateField";
import CustomButton from "../CustomButton/CustomButton";
import { InfoField } from "./InfoField";

export const UpdateProfileInfoForm = ({
  cancelAction,
  day,
  dayOptions,
  firstName,
  firstNameError,
  email,
  enableSaveButton,
  lastName,
  lastNameError,
  machineOptions,
  machine,
  monitorOptions,
  monitor,
  month,
  saveAction,
  setValue,
  year,
}: {
  cancelAction: () => void;
  day: string;
  dayOptions: DropdownOptionType[];
  email: string;
  enableSaveButton: boolean;
  firstName?: string;
  firstNameError: string;
  lastName?: string;
  lastNameError: string;
  machineOptions: DropdownOptionType[];
  machine?: string;
  monitorOptions: DropdownOptionType[];
  monitor?: string;
  month: string;
  saveAction: () => void;
  setValue: (key: string, value: string, error?: string) => void;
  year: string;
}) => {
  return (
    <>
      <div className={"profile-page__change-password__container"}>
        <InputField
          defaultValue={firstName}
          width={100}
          label='FIRST NAME'
          givenError={firstNameError}
          type='text'
          required={true}
          inputEvent={(value: string, error: string) => setValue("firstName", value, error)}
        />
        <InputField
          defaultValue={lastName}
          width={100}
          label='LAST NAME'
          givenError={lastNameError}
          type='text'
          required={true}
          inputEvent={(value: string, error: string) => setValue("lastName", value, error)}
        />
        <InfoField title='EMAIL' detail={email} />
        <DateField
          dayOptions={dayOptions}
          width={100}
          label='DATE OF BIRTH'
          inputDayAction={(value: string, error: string) => setValue("day", value)}
          inputMonthAction={(value: string, error: string) => setValue("month", value)}
          inputYearAction={(value: string, error: string) => setValue("year", value)}
          day={day}
          month={month}
          year={year}
        />
        <DropdownField
          inputEvent={(value: string, errorFound: string) => {
            setValue("machine", value);
          }}
          label='ROWING MACHINE'
          options={machineOptions}
          required={false}
          width={100}
          defaultValue={machine}
        />
        <DropdownField
          inputEvent={(value: string, errorFound: string) => setValue("monitor", value)}
          label='ROWING MONITOR'
          options={monitorOptions || []}
          required={false}
          width={100}
          defaultValue={monitor}
        />
      </div>
      <div className={"profile-page__btn-row"}>
        <CustomButton text='SAVE CHANGES' onClick={saveAction} disabled={!enableSaveButton} />
        <CustomButton variation='secondary' text='CANCEL' onClick={cancelAction} />
      </div>
    </>
  );
};
