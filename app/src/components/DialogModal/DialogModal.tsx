import React from "react";
import Overlay from "../Overlay/Overlay";
import "./DialogModal.scss";
import CustomButton from "../CustomButton/CustomButton";

const DialogModal = ({
  title,
  subtitle,
  dismissText,
  confirmText,
  onConfirm,
  onDismiss,
}: {
  title?: string;
  subtitle: string;
  dismissText: string;
  confirmText?: string;
  onConfirm?: () => void;
  onDismiss: () => void;
}) => {
  return (
    <Overlay>
      <div className={"dialog-modal__container__"}>
        {title && (
          <>
            <h4 className={"dialog-modal__container__title"}>{title}</h4>
            <h4 className={"dialog-modal__container__title-border"}>{"."}</h4>
          </>
        )}
        <p className={"dialog-modal__container__subtitle"}>{subtitle}</p>
        {onConfirm ? (
          <div className={"dialog-modal__container__buttons-wrapper"}>
            <CustomButton text={dismissText} variation={"secondary"} onClick={onDismiss} />
            <CustomButton text={confirmText} onClick={onConfirm} />
          </div>
        ) : (
          <div className={"dialog-modal__container__buttons-wrapper"}>
            <CustomButton text={dismissText} onClick={onDismiss} />
          </div>
        )}
      </div>
    </Overlay>
  );
};

export default DialogModal;
