import "./FlashMessage.scss";
import React from "react";

const FlashMessage = ({ message, type, hasSubNav }: FlashMessageVM) => {
  const isRibbonPresent = () => {
    try {
      return document.getElementsByClassName("ribbon__container__").length > 0;
    } catch (e) {
      return false;
    }
  };

  const isSubNavPresent = () => {
    try {
      return document.getElementsByClassName("sub-head__container__").length > 0;
    } catch (e) {
      return false;
    }
  };

  const generateClassName = (type) => {
    return `flash-message__ flash-message__${type === "success" ? "success" : type}
    flash-message__with-${isRibbonPresent() ? "ribbon-" : ""}header${isSubNavPresent() || hasSubNav ? "-subnav" : ""}`;
  };

  return (
    <div id={"flash-message"} className={generateClassName(type)}>
      <h4>{message}</h4>
    </div>
  );
};

export default FlashMessage;

export interface FlashMessageVM {
  message: string;
  type: "success" | "error" | "none";
  hasSubNav?: boolean;
}
