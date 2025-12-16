import React, { useState } from "react";
import "./CheckboxField.scss";
import { Link } from "gatsby";
import checkboxEmpty from "../../../assets/images/checkboxEmpty.png";
import checkboxChecked from "../../../assets/images/checkboxChecked.png";

const CheckboxField = ({
  defaultValue,
  inputEvent,
  label,
  linkDestination,
  linkText,
  required,
  width,
}: {
  defaultValue?: boolean;
  inputEvent: (newValue, errorFound) => void;
  label: string;
  linkDestination?: string;
  linkText?: string;
  required?: boolean;
  width: 100 | 85 | 50 | 30 | 15;
}) => {
  const [checked, setChecked] = useState(defaultValue);
  const [error, setError] = useState(defaultValue ? "" : "");

  const switchValue = () => {
    setChecked(!checked);
    setError(!checked && required ? "This field is required" : "");
    inputEvent(!checked, error);
  };

  return (
    <div className={`checkbox-field__container__ checkbox-field__size-${width}`}>
      <img
        alt={"checkbox"}
        className={"checkbox-field__container__checkbox"}
        src={checked ? checkboxChecked : checkboxEmpty}
        onClick={switchValue}
      />
      <div className={"checkbox-field__container__input-row__"}>
        <div className={"checkbox-field__container__input-row__label"}>
          <h4 onClick={switchValue}>{label}</h4>
          {linkText && <Link to={`${linkDestination}`}>{linkText}</Link>}
        </div>
        <h4 className={"input-field__container__input-row__error-label"}>{error}</h4>
      </div>
    </div>
  );
};

export default CheckboxField;
