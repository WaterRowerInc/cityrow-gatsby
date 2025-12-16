import React from "react";
import "./Header.scss";

const Header = ({ itemsQuantity, onClose }: { itemsQuantity?: number; onClose: () => void }) => {
  return (
    <div className='cart__header__container'>
      <h3 className='cart__header__title'>Your Cart&nbsp;</h3>
      <p className='cart__header__items-number'>{`(${itemsQuantity || 0})`}</p>
      <div className='cart__header__close-button' onClick={onClose} />
    </div>
  );
};

export default Header;
