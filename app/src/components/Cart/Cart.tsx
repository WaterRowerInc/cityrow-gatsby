// noinspection XHTMLIncompatabilitiesJS

import React from "react";
import Overlay from "../Overlay/Overlay";
import "./Cart.scss";
import Loader from "../Loader/Loader";
import Header from "./Components/Header";
import CartDetails from "../CartDetails/CartDetails";
import Footer from "./Components/Footer";

const Cart = ({
  cartItemsQuantity,
  isCheckoutAvailable,
  isVisible,
  isLoading,
  onClose,
}: {
  cartItemsQuantity: number;
  isCheckoutAvailable: boolean;
  isVisible: boolean;
  isLoading: boolean;
  onClose: () => void;
}) => {
  const isDocumentDefined = () => typeof document !== "undefined";
  if (isVisible) {
    isDocumentDefined() && (document.body.style.overflow = "hidden");
  } else {
    isDocumentDefined() && (document.body.style.overflow = "auto");
    return null;
  }
  return (
    <>
      {isLoading && (
        <Overlay onClick={onClose}>
          <Loader />
        </Overlay>
      )}
      <div className='cart__wrapper'>
        <div className='cart__overlay' onClick={onClose} />
        <div>
          <div className='cart__container'>
            <Header onClose={onClose} itemsQuantity={cartItemsQuantity} />
            <CartDetails onShopNow={onClose} />
          </div>
          <Footer visible={isCheckoutAvailable} onCheckoutClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default Cart;
