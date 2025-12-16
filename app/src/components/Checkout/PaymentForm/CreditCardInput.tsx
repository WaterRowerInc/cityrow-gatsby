import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import "./CreditCardInput.scss";
import { Card } from "../../../core/domain/payment/Card";

const CreditCardInput = ({
  isCardNotCompleted,
  onCreditCardComplete,
  onCreditCardError,
  onClearPaymentMethod,
  onInputReady,
}: {
  isCardNotCompleted?: boolean;
  onCreditCardComplete: (card: Card) => void;
  onCreditCardError: (error: string) => void;
  onClearPaymentMethod?: () => void;
  onInputReady?: (cardElement) => void;
}) => {
  useEffect(() => {
    loadCard().then();
  }, []);
  const [showInvalid, setShowInvalid] = useState(false);

  const loadCard = async () => {
    const stripe: any = await loadStripe(process.env.GATSBY_STRIPE_USD!);
    const cardElement = stripe.elements().create("card", {
      hidePostalCode: true,
      style: {
        base: {
          color: "black",
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "16px",
          "::placeholder": {
            color: "#767676",
          },
        },
        invalid: {
          color: "#EC6868",
          iconColor: "#EC6868",
        },
      },
    });
    cardElement.mount("#card-element");
    cardElement.on("ready", () => onInputReady && onInputReady(cardElement));
    cardElement.on("change", async (event: any) => {
      if (event.complete) {
        setShowInvalid(false);
        const { paymentMethod, error } = await stripe.createPaymentMethod({ type: "card", card: cardElement });
        if (error) {
          setShowInvalid(true);
          return onCreditCardError(error.message);
        }
        const card = {
          token: paymentMethod.id,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
          brand: paymentMethod.card.brand,
          addressCheck: paymentMethod.card.checks.address_line1_check,
          cvcCheck: paymentMethod.card.checks.cvc_check,
          zipCheck: paymentMethod.card.checks.address_postal_code_check,
        };
        return onCreditCardComplete(card);
      }
      setShowInvalid(true);
      return onClearPaymentMethod && onClearPaymentMethod();
    });
  };

  return (
    <div className='credit-card-wrapper'>
      <div id='card-element' className='credit-card-input' />
      {(showInvalid || isCardNotCompleted) && (
        <h4 className='credit-card-invalid-text'>Please enter a valid card, expiration date and CVC</h4>
      )}
    </div>
  );
};

export default CreditCardInput;
