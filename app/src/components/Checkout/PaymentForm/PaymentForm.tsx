import React from "react";
import { Card } from "../../../core/domain/payment/Card";
import PaymentMethodSelector from "./PaymentMethodSelector";
import UpgradePlanMessage from "./UpgradePlanMessage";

const PaymentForm = ({
  defaultPaymentMethod,
  isCardNotCompleted,
  isKlarnaPaymentMethodVisible,
  klarnaTotalPrice,
  onSelect,
  onCreditCardComplete,
  onCreditCardError,
  onCreditCardInputReady,
  updateFormValue,
  upgradePlanMessageVisible,
}: {
  defaultPaymentMethod: string;
  isCardNotCompleted: boolean;
  isKlarnaPaymentMethodVisible: boolean;
  klarnaTotalPrice: string;
  onSelect: (paymentMethod: string) => void;
  onCreditCardComplete: () => void;
  onCreditCardError: (error: string) => void;
  onCreditCardInputReady: (cardElement) => void;
  updateFormValue: (key: string, value: any) => void;
  upgradePlanMessageVisible: boolean;
}) => {
  return (
    <>
      <h1 className={"checkout-page__container__flow-container__big-title"}>Payment Method</h1>
      <PaymentMethodSelector
        onCreditCardInputReady={onCreditCardInputReady}
        defaultValue={defaultPaymentMethod}
        isCardNotCompleted={isCardNotCompleted}
        isKlarnaPaymentMethodVisible={isKlarnaPaymentMethodVisible}
        onCreditCardComplete={(card: Card) => {
          updateFormValue("isPaymentOk", true);
          updateFormValue("card", card);
          onCreditCardComplete();
        }}
        onCreditCardError={onCreditCardError}
        onSelect={(value) => {
          updateFormValue("paymentMethod", value);
          onSelect(value);
        }}
      />
      <UpgradePlanMessage visible={upgradePlanMessageVisible} />
    </>
  );
};

export default PaymentForm;
