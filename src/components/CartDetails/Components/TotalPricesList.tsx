import React from "react";
import "./TotalPricesList.scss";

const TotalPricesList = ({
  subscriptionDiscounts,
  discounts,
  subtotal,
  shipping,
  tax,
}: {
  subscriptionDiscounts?: string;
  discounts?: string;
  subtotal?: string;
  shipping?: any;
  tax?: string;
}) => {
  return (
    <div className='cart-details__promo__discounts__container' id='checkout-summary-discounts'>
      <div className='cart-details__promo__discounts__line__container'>
        <p className='cart-details__promo__discounts__line__title'>Subtotal</p>
        <p className='cart-details__promo__discounts__line__price'>{subtotal}</p>
      </div>
      <div className='cart-details__promo__discounts__line__container'>
        <p className='cart-details__promo__discounts__line__title'>Product Discounts</p>
        <p className='cart-details__promo__discounts__line__price cart-details__promo__discounts__line__price-blue'>
          {discounts}
        </p>
      </div>
      {subscriptionDiscounts && (
        <div className='cart-details__promo__discounts__line__container'>
          <p className='cart-details__promo__discounts__line__title'>Promo Discount</p>
          <p className='cart-details__promo__discounts__line__price cart-details__promo__discounts__line__price-blue'>
            {subscriptionDiscounts}
          </p>
        </div>
      )}
      <div className='cart-details__promo__discounts__line__container'>
        <p className='cart-details__promo__discounts__line__title'>Shipping</p>
        <p className='cart-details__promo__discounts__line__price'>{shipping}</p>
      </div>
      <div className='cart-details__promo__discounts__line__container'>
        <p className='cart-details__promo__discounts__line__title'>Tax</p>
        <p className='cart-details__promo__discounts__line__price'>{tax}</p>
      </div>
    </div>
  );
};

export default TotalPricesList;
