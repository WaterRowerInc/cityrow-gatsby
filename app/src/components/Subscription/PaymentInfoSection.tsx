import React from "react";
import { PaymentInfoVM } from "./PaymentInfoVM";
import "./PaymentInfoSection.scss";

export const PaymentInfoSection = ({
  info,
  toggleUpdateForm,
}: {
  info?: PaymentInfoVM;
  toggleUpdateForm: () => void;
}) => {
  return (
    <div className='payment-info-section__'>
      {info && (
        <div className='payment-info-section__container__'>
          <div className='payment-info-section__container__number'>
            <span className='payment-info-section__container__title'>CARD NUMBER</span>
            <h5 className='payment-info-section__container__detail'>
              {info.number ? `XXXX-XXXX-XXXX-${info.number}` : ""}
            </h5>
          </div>
          <div className='payment-info-section__container__expiration'>
            <span className='payment-info-section__container__title'>EXPIRATION DATE</span>
            <h5 className='payment-info-section__container__detail'>{info.expiration}</h5>
          </div>
        </div>
      )}
      <button onClick={toggleUpdateForm} className='payment-info-section__button'>
        UPDATE PAYMENT
      </button>
    </div>
  );
};
