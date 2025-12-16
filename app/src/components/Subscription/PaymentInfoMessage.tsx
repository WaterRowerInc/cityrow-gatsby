import React from "react";
import { PaymentInfoVM } from "./PaymentInfoVM";

const PaymentInfoMessage = ({ paymentInfo }: { paymentInfo?: PaymentInfoVM }) => {
  if (paymentInfo?.klarna)
    return (
      <p>
        Your purchase was made through Klarna financing. Your payment information can be found by logging into
        <a href='https://klarna.com' target='_blank' rel='noreferrer'>
          klarna.com
        </a>
      </p>
    );
  if (paymentInfo?.number)
    return <p>Your payment info will be used to make payments on your CITYROW GO subscription(s).</p>;
  return <p>There is no payment info for your user</p>;
};

export default PaymentInfoMessage;
