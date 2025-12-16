import React from "react";
import "./ProfileTopBar.scss";
import { Link } from "gatsby";

const ProfileTopBar = ({
  name,
  dateJoined,
  page,
  localizationCode,
}: {
  name: string;
  dateJoined: string;
  page: "profile" | "subscription";
  localizationCode: string;
}) => {
  const since = new Date(dateJoined);
  return (
    <div className={"profile-top-bar__container__"}>
      <div className={"profile-top-bar__container__left__"}>
        <h5 className={"profile-top-bar__container__left__name"}>{name}</h5>
        <h5 className={"profile-top-bar__container__left__separator"}>|</h5>
        <h5 className={"profile-top-bar__container__left__since"}>{`Rowing Since ${since.getFullYear()}`}</h5>
      </div>
      <div className={"profile-top-bar__container__right__"}>
        <Link
          to={`/${localizationCode}/profile`}
          className={`profile-top-bar__container__right__item ${
            page === "profile" && "profile-top-bar__container__right__item--active"
          }`}
        >
          Profile
        </Link>
        <Link
          to={`/${localizationCode}/subscription`}
          className={`profile-top-bar__container__right__item ${
            page === "subscription" && "profile-top-bar__container__right__item--active"
          }`}
        >
          Subscription
        </Link>
      </div>
    </div>
  );
};

export default ProfileTopBar;
