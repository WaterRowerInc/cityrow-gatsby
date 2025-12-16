import * as React from "react";
import { Link } from "gatsby";
import CustomButton from "components/CustomButton/CustomButton";

const UserStatusIndicator = ({
  isAuthenticated,
  localizationCode,
  onLogout,
}: {
  isAuthenticated?: boolean;
  localizationCode: string;
  onLogout: () => void;
}) => (
  <div className='footer__actions' style={{ justifyContent: "space-between" }}>
    {isAuthenticated ? (
      <CustomButton text={"LOGOUT"} onClick={onLogout} />
    ) : (
      <Link to={`${localizationCode && `/${localizationCode}`}/login`} style={{ textDecoration: "none" }}>
        <CustomButton text={"LOGIN"} />
      </Link>
    )}
  </div>
);

export default UserStatusIndicator;
