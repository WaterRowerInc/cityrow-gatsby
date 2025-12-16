import * as React from "react";
import clsx from "classnames";
import "./CustomButton.scss";

const CustomButton = ({
  customClass,
  disabled = false,
  onClick,
  text,
  type = "button",
  variation = "primary",
}: {
  customClass?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: any;
  type?: "submit" | "reset" | "button";
  variation?: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
}) => (
  <button
    type={type}
    className={clsx(
      "custom-button__wrapper-button",
      {
        "custom-button__wrapper--disabled": disabled,
        "custom-button__wrapper--secondary": variation === "secondary",
        "custom-button__wrapper--secondary-white": variation === "secondaryWhite",
        "custom-button__wrapper--secondary-link": variation === "link",
        "custom-button__wrapper--secondary-link--inverse": variation === "linkInverse",
      },
      customClass
    )}
    onClick={!disabled ? onClick : () => null}
  >
    {text}
  </button>
);

export default CustomButton;
