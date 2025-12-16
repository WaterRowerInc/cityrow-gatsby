import React from "react";
import CTAButton from "../../CTAButton/CTAButton";
import "./Footer.scss";

const Footer = ({ visible, onCheckoutClick }: { visible: boolean; onCheckoutClick: () => void }) => {
  if (!visible) return null;
  return (
    <div className='cart__footer__container'>
      <CTAButton goTo='/checkout' text='CHECKOUT' customClass='cart__footer__button' onClick={onCheckoutClick} />
    </div>
  );
};

export default Footer;
