import React from "react";
import "./Promo.scss";
import TextFieldWithButton from "../../TextFieldWithButton/TextFieldWithButton";

interface PromoProps {
  onApplyPromo: (promoCode: string) => void;
}

const Promo = ({onApplyPromo}: PromoProps) => {
  return (
    <>
      <p className='cart-details__promo__title'>PROMO CODE</p>
      <TextFieldWithButton
        onSubmit={onApplyPromo}
        actionText='>'
        className='cart-details__promo__input'
        borderStyle='cart-details__promo__input__border-style'
      />
    </>
  );
};

export default Promo;
