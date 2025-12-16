import React, { useEffect, useState } from "react";
import "./InputField.scss";
import { Link } from "gatsby";
import { validateField } from "../../../utils/validationUtils";

const InputField = ({
  width,
  label,
  type,
  placeholder,
  linkText,
  linkDestination,
  inputEvent,
  extraClass,
  refe,
  required,
  defaultValue,
  givenError,
  onBlur,
  submitted,
}: {
  width: 100 | 85 | 50 | 30 | 15;
  label?: string;
  type: "text" | "number" | "email" | "password" | "zip" | "confirmPassword";
  placeholder?: string;
  linkText?: string;
  linkDestination?: string;
  inputEvent: (newValue, errorFound) => void;
  extraClass?: string;
  refe?: any;
  required?: boolean;
  defaultValue?: any;
  givenError?: string;
  onBlur?: (value) => void;
  submitted?: boolean;
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(givenError || "");
  const changeValue = (newValue) => {
    let errorFound = validateField(type, newValue, required);
    if (!submitted && !newValue) errorFound = "";
    setError(errorFound);
    setValue(newValue);
    inputEvent(newValue, errorFound);
  };
  const showError = () => {
    const errorFound = validateField(type, value, required);
    setError(errorFound);
  };

  useEffect(() => {
    if (defaultValue || value) changeValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (submitted) {
      showError();
      inputEvent(value, error);
    }
  }, [submitted]);

  return (
    <div className={`input-field__container__ input-field__size-${width} ${extraClass}`}>
      {(label || linkText) && (
        <div className={"input-field__container__label-row__"}>
          {label && <h4>{label}</h4>}
          {linkText && <Link to={`${linkDestination}`}>{linkText}</Link>}
        </div>
      )}
      <div className={"input-field__container__input-row__"}>
        <input
          className={`input-field__size-100 ${givenError || error ? "input-field__error" : ""}
            ${type === "email" && "input-field__lowercase"}`}
          type={type === "zip" ? "text" : type === "confirmPassword" ? "password" : type}
          placeholder={placeholder}
          ref={refe}
          onBlur={() => {
            showError();
            onBlur && onBlur(value);
          }}
          value={defaultValue !== value ? defaultValue : value}
          onChange={(event) => changeValue(event.target.value)}
        />
        {(givenError || error) && (
          <h4 className={"input-field__container__input-row__error-label"}>{givenError || error}</h4>
        )}
      </div>
    </div>
  );
};

export default InputField;
