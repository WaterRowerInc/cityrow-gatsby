import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import { Dropdown } from "semantic-ui-react";
import "./DropdownField.scss";
import { DropdownOptionType } from "./DropdownOptionType";

const DropdownField = ({
  afterInputEvent,
  disabled,
  inputEvent,
  label,
  linkDestination,
  linkText,
  options,
  placeholder,
  refe,
  required,
  width,
  defaultValue,
}: {
  afterInputEvent?: (newValue) => void;
  disabled?: boolean;
  inputEvent: (newValue, errorFound) => void;
  label: string;
  linkDestination?: string;
  linkText?: string;
  options: DropdownOptionType[];
  placeholder?: string;
  refe?: any;
  required: boolean;
  width: 100 | 85 | 50 | 30 | 15;
  defaultValue;
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (options?.length && !defaultValue) {
      changeValue(options[0].value);
    }
  }, []);

  useEffect(() => setError(required && !options?.[0]?.value?.length ? "This field is required" : ""), [options]);

  const changeValue = (newValue) => {
    if (disabled) return;
    setError(!newValue?.length && required ? "This field is required" : "");
    setValue(newValue);
    inputEvent(newValue, error);
    afterInputEvent && afterInputEvent(newValue);
  };

  return (
    <div className={`dropdown-field__container__ dropdown-field__size-${width}`}>
      <div className={"dropdown-field__container__label-row__"}>
        <h4>{label}</h4>
        {linkText && <Link to={`${linkDestination}`}>{linkText}</Link>}
      </div>
      <div
        className={`dropdown-field__container__input-row__ ${error && "error-dropdown"} ${
          disabled && "dropdown-disabled"
        }`}
      >
        <Dropdown
          disabled={disabled}
          placeholder={placeholder}
          fluid={true}
          ref={refe}
          onChange={(_, data) => changeValue(data.value)}
          selection={true}
          search={true}
          selectOnBlur={false}
          options={options}
          value={defaultValue !== value ? defaultValue : value}
          icon={"chevron down"}
        />
        <h4 className={"dropdown-field__container__input-row__error-label"}>{error}</h4>
      </div>
    </div>
  );
};

export default DropdownField;
