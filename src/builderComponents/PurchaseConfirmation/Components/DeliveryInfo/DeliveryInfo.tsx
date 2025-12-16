import * as React from "react";
import "./DeliveryInfo.scss";

const DeliveryInfo = ({
  fullName,
  street,
  city,
  state,
  zip,
  deliveryType,
}: {
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  deliveryType?: string;
}) => (
  <div className='delivery-info__container'>
    <h3 className={"delivery-info__header-title"}>Delivery Information</h3>
    <div className={"delivery-info__content-border"}></div>
    <div className='delivery-info__content'>
      <div className='delivery-info__body'>
        <p>{fullName}</p>
        <p>{street}</p>
        <p> {`${city}, ${state} ${zip || ''}`}</p>
      </div>
      <div className='delivery-info__body'>
        <p>{deliveryType}</p>
      </div>
    </div>
  </div>
);

export default DeliveryInfo;
