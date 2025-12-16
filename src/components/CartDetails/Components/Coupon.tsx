import React from "react";
import "./Coupon.scss";
import CloseIcon from "../../../assets/images/close-black.png";
import { CartCouponVM } from "../../Cart/CartVM";

interface CouponProps {
  coupon: CartCouponVM;
  onRemovePromo: () => void;
}

const Coupon = ({ coupon, onRemovePromo }: CouponProps) => (
  <div className='cart-details__coupon'>
    <div>
      <p className='cart-details__coupon__title'>{coupon.name} applied</p>
      <p className='cart-details__coupon__description'>{coupon.description || "No description provided"}</p>
    </div>
    <img src={CloseIcon} onClick={onRemovePromo} />
  </div>
);

export default Coupon;
