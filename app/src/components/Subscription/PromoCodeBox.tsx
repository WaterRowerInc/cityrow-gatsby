import close from "assets/images/close-grey.png";
import React from "react";
import TextFieldWithButton from "../TextFieldWithButton/TextFieldWithButton";
import "./PromoCodeBox.scss";
import { PromoCodeVM } from "./PromoCodeVM";

export default function PromoCodeBox({
  invalidPromoCodeText,
  promoCode,
  onClear,
  onSubmit,
}: {
  invalidPromoCodeText: string;
  promoCode?: PromoCodeVM;
  onClear?: () => void;
  onSubmit: (code: string) => void;
}) {
  return (
    <div className='promo-code-box__'>
      <div className='promo-code-box__container'>
        <div className='promo-code-box__input-container'>
          <TextFieldWithButton
            onSubmit={onSubmit}
            placeholder='Enter Code'
            actionText='APPLY'
            className='promo-code-box__input'
          />
          {invalidPromoCodeText && <span className='promo-code-box__error-message'>{invalidPromoCodeText}</span>}
          {promoCode && (
            <div
              className='promo-code-box__coupon__container'
              onClick={onClear}
              role={"button"}
              onKeyDown={(e) => e.key.toLowerCase() === "enter" && onClear && onClear()}
              tabIndex={0}
            >
              <div className='promo-code-box__coupon__inner-container'>
                <h4 className='promo-code-box__coupon__title'>{promoCode.code.toUpperCase()} applied</h4>
                <p className='promo-code-box__coupon__text'>{promoCode.name}</p>
              </div>
              <img src={close} alt='close' />
            </div>
          )}
        </div>

        <div className='promo-code-box__separator' />

        <div className='promo-code-box__discount__'>
          <div className='promo-code-box__discount__inner-container'>
            <div className='promo-code-box__discount__container'>
              <p className='promo-code-box__discount__text'>Total Discounts</p>
              <p className='promo-code-box__discount__text-price'>{promoCode?.discount || "$0.00"}</p>
            </div>
            <div className='promo-code-box__discount__container'>
              <p className='promo-code-box__discount__text-bold'>Total</p>
              <p className='promo-code-box__discount__text-price-total'>{promoCode?.total || "$0.00"}</p>
            </div>
          </div>
          {promoCode && (
            <p className='promo-code-box__discount__apply-text'>
              You will be charged at the end of your free 14-day trial period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
