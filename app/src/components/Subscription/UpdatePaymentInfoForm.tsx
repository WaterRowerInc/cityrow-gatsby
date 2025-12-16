import React from "react";
import { Card } from "../../core/domain/payment/Card";
import CreditCardInput from "../Checkout/PaymentForm/CreditCardInput";
import CustomButton from "../CustomButton/CustomButton";
import "./UpdatePaymentInfoForm.scss";

export const UpdatePaymentInfoForm = ({
  insertMode = false,
  isFormOk,
  onClearPaymentMethod,
  onCreditCardError,
  setCreditCardInfo,
  toggleUpdatePaymentForm,
  updatePaymentInfo,
}: {
  insertMode?: boolean;
  isFormOk: boolean;
  onClearPaymentMethod: () => void;
  onCreditCardError: (error: string) => void;
  setCreditCardInfo: (card: Card) => void;
  toggleUpdatePaymentForm: () => void;
  updatePaymentInfo: () => void;
}) => (
  <div className='payment-info-form__'>
    <CreditCardInput
      onCreditCardComplete={setCreditCardInfo}
      onCreditCardError={onCreditCardError}
      onClearPaymentMethod={onClearPaymentMethod}
    />
    <div className='payment-info-form__container__button-wrapper'>
      {!insertMode && <CustomButton text='CANCEL' variation='secondary' onClick={toggleUpdatePaymentForm} />}
      <CustomButton
        disabled={!isFormOk}
        text={insertMode ? "PURCHASE SUBSCRIPTION" : "SAVE CARD"}
        onClick={() => updatePaymentInfo()}
      />
    </div>
  </div>
);
