import React from "react";
import { Dropdown } from "semantic-ui-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import avatar from "../../../static/avatar.svg";
import "./index.scss";

export type ProfileOption = "logout" | "profile";

interface ProfileDropdownProps {
  onClickOption: (optionValue: ProfileOption) => void;
}

const profileTabs = [
  {
    value: `profile`,
    text: "MY ACCOUNT",
  },
  {
    value: `logout`,
    text: "LOGOUT",
  },
];

const trigger = <img src={avatar} alt='avatar' className='profile-dropdown__icon' />;

const ProfileDropdown = ({ onClickOption }: ProfileDropdownProps) => {
  return (
    <div className='profile-dropdown__'>
      <Dropdown
        className={"profile-dropdown__menu"}
        trigger={trigger}
        options={profileTabs}
        pointing='top right'
        onChange={(_, option) => onClickOption(option.value as ProfileOption)}
        value=''
        icon={null}
        selectOnBlur={false}
      />
    </div>
  );
};

export default ProfileDropdown;
