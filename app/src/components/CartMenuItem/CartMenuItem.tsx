import React from "react";
import cart from "assets/images/cart.svg";
import "./CartMenuItem.scss";

export default function CartMenuItem({ cartItemsQuantity, onCartClick }: CartMenuItemProps) {
  return (
    <div className='cart-menu-item__container'>
      <h1 className={`cart-menu-item__counter ${cartItemsQuantity > 0 ? "d-block" : "d-none"}`}>{cartItemsQuantity}</h1>
      <img src={cart} alt='menu' onClick={onCartClick} />
    </div>
  );
}

interface CartMenuItemProps {
  cartItemsQuantity: number;
  onCartClick: () => void;
}
