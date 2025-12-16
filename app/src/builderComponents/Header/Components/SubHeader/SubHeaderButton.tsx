import React from "react";
import "./SubHeader.scss";
import { Link } from "gatsby";
import clsx from "classnames";

const SubHeaderButton = ({
  isExternal,
  path,
  name,
  localizationCode,
  fullWidth = false,
}: {
  isExternal: boolean;
  path: string;
  name: string;
  localizationCode: string;
  fullWidth?: boolean;
}) => {
  if (isExternal)
    return (
      <a
        href={path}
        className={clsx("sub-head__text", {
          "sub-head__text--full": fullWidth,
        })}
        target={"_blank"}
        rel={"noopener noreferrer"}
      >
        {name}
      </a>
    );
  return (
    <Link
      to={`${localizationCode && `/${localizationCode}`}${path}`}
      className={clsx("sub-head__text", {
        "sub-head__text--full": fullWidth,
      })}
      activeClassName={"sub-head__option--active"}
    >
      {name}
    </Link>
  );
};

export default SubHeaderButton;
