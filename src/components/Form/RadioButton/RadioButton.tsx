import React from "react";
import { RadioButtonType } from "./RadioButtonType";
import radioEmpty from "../../../assets/images/radioEmpty.png";
import radioChecked from "../../../assets/images/radioChecked.png";
import radioDisabled from "../../../assets/images/radioDisabled.png";
import "./RadioButton.scss";

const RadioButton = ({ selected, onClick, disabled }: RadioButtonType) => {
  return (
    <img
      alt={"button"}
      className={`radio-button ${disabled && "radio-button-disabled"}`}
      onClick={onClick}
      src={disabled ? radioDisabled : selected ? radioChecked : radioEmpty}
    />
  );
};

export default RadioButton;
