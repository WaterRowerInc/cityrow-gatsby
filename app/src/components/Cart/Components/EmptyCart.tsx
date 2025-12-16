import React from "react";
import "./EmptyCart.scss";
import CTAButton from "../../CTAButton/CTAButton";

const EmptyCart = ({ onShopNow }: { onShopNow?: () => void }) => (
  <div className='cart__empty__container'>
    <p className='cart__empty__text'>Your cart is empty, shop now to fill it with everything you need to get rowing!</p>
    <CTAButton goTo='/shop' text='SHOP NOW' customClass='cart__empty__button' onClick={onShopNow} />
  </div>
);

export default EmptyCart;
