import React from "react";
import { Link } from "gatsby";

const CheckoutCopyText = () => {
  return (
    <p className='checkout-page__copy-text'>
      By completing my purchase, I confirm that I have read and agree to the CITYROW{" "}
      <Link to='/en-us/terms-of-service-app'>Terms of Service </Link> and{" "}
      <Link to='/en-us/privacy-policy-app'>Privacy Policy</Link>, and I understand that my membership will automatically
      renew at the now-current subscription rate until or unless I pause or cancel.
    </p>
  );
};

export default CheckoutCopyText;
