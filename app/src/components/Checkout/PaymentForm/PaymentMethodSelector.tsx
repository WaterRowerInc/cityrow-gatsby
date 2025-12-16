import React, { useState } from "react";
import "./PaymentMethodSelector.scss";
import RadioButton from "../../Form/RadioButton/RadioButton";
import klarnaBadge from "../../../assets/images/klarna.png";
import CreditCardInput from "./CreditCardInput";
import { Card } from "../../../core/domain/payment/Card";

const PaymentMethodSelector = ({
  defaultValue,
  isCardNotCompleted,
  isKlarnaPaymentMethodVisible,
  onCreditCardComplete,
  onCreditCardError,
  onCreditCardInputReady,
  onSelect,
}: {
  defaultValue: string;
  isCardNotCompleted: boolean;
  isKlarnaPaymentMethodVisible: boolean;
  onCreditCardComplete: (card: Card) => void;
  onCreditCardError: (error: string) => void;
  onCreditCardInputReady: (cardElement) => void;
  onSelect: (deliveryOption: string) => void;
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const select = (value) => {
    onSelect(value);
    setSelected(value);
  };
  return (
    <div className={"payment-method-selector__container__"}>
      <div className={"payment-method-selector__container__item__ payment-method-selector__container__item__extra"}>
        <div
          className={"payment-method-selector__container__item__info__"}
          role={"button"}
          onKeyPress={(e) => e.key.toLowerCase() === "enter" && select("card")}
          tabIndex={0}
          onClick={() => select("card")}
        >
          <div className={"payment-method-selector__container__item__info__title-row__"}>
            <RadioButton selected={selected === "card"} onClick={() => null} />
            <h4 className={"payment-method-selector__container__item__info__title-row__name"}>Pay With Credit Card</h4>
          </div>
        </div>
        {selected === "card" && (
          <CreditCardInput
            isCardNotCompleted={isCardNotCompleted}
            onInputReady={onCreditCardInputReady}
            onCreditCardComplete={onCreditCardComplete}
            onCreditCardError={onCreditCardError}
          />
        )}
      </div>
      <div
        className={"payment-method-selector__container__item__"}
        style={!isKlarnaPaymentMethodVisible ? { display: "none" } : undefined}
      >
        <div
          className={"payment-method-selector__container__item__info__"}
          role={"button"}
          onKeyPress={(e) => e.key.toLowerCase() === "enter" && select("klarna")}
          tabIndex={0}
          onClick={() => select("klarna")}
        >
          <div className={"payment-method-selector__container__item__info__title-row__"}>
            <RadioButton selected={selected === "klarna"} onClick={() => null} />
            <h4 className={"payment-method-selector__container__item__info__title-row__name"}>{"Pay Over Time"}</h4>
            <img src={klarnaBadge} className={"payment-method-selector__klarna-badge"} alt={"klarna"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
