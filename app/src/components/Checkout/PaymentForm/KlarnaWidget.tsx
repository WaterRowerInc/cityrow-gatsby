import React from "react";
import "./KlarnaWidget.scss";
import Overlay from "../../Overlay/Overlay";
import CustomButton from "../../CustomButton/CustomButton";

const KlarnaWidget = ({
  onClose,
  onContinue,
  visible,
}: {
  onClose: () => void;
  onContinue: () => void;
  visible: boolean;
}) => {
  return (
    <Overlay style={{ display: visible ? "flex" : "none" }} onClick={onClose}>
      <div className='klarna-widget__container' style={{ display: visible ? "flex" : "none" }}>
        <div id='klarna-payments-container' />
        <CustomButton text='Continue' onClick={onContinue} customClass='klarna-widget__button' />
      </div>
    </Overlay>
  );
};

export default KlarnaWidget;
