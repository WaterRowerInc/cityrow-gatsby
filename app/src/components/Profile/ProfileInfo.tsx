import { InfoField } from "./InfoField";
import CustomButton from "../CustomButton/CustomButton";
import React from "react";
import { User } from "../../core/domain/user/User";

export const ProfileInfo = ({ userData, showEditForm }: { userData: User; showEditForm: () => void }) => {
  return (
    <>
      <div className={"profile-page__change-password__container"}>
        <InfoField title='FIRST NAME' detail={userData?.firstName} />
        <InfoField title='LAST NAME' detail={userData?.lastName} />
        <InfoField title='EMAIL' detail={userData?.email} />
        <InfoField title='DATE OF BIRTH' detail={userData?.birthday} emptyMessage='Enter Your Date Of Birth' />
        <InfoField title='ROWING MACHINE' detail={userData?.machineTitle} emptyMessage='Enter Your Rowing Machine' />
        <InfoField title='ROWING MONITOR' detail={userData?.monitorTitle} emptyMessage='Enter Your Rowing Monitor' />
      </div>
      <div className={"profile-page__edit-btn"}>
        <CustomButton text='EDIT PROFILE' onClick={showEditForm} variation='secondary' />
      </div>
    </>
  );
};
