import React from "react";
import { ProductVM } from "../../ProductVM";
import "./SubscriptionDetails.scss";
import CustomButton from "../../../../components/CustomButton/CustomButton";

const SubscriptionDetails = ({
  description,
  isUserLoggedIn,
  onSelectSubscription,
  subscriptionProducts,
  subscriptionCta,
  subscriptionLoggedCta,
}: {
  description?: string;
  isUserLoggedIn: boolean;
  onSelectSubscription: (subscription: ProductVM) => void;
  subscriptionProducts: ProductVM[];
  subscriptionCta?: string;
  subscriptionLoggedCta?: string;
}) => {
  const isWindowDefined = () => typeof window !== "undefined";
  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: `${description}` }} className='subscriptionDetails__description' />
      <CustomButton
        customClass='subscriptionDetails__button'
        text={isUserLoggedIn ? subscriptionLoggedCta || "SELECT PLAN" : subscriptionCta || "Get 14 Days Free"}
        onClick={async () => onSelectSubscription(subscriptionProducts?.[0])}
      />
      {!isUserLoggedIn && (
        <p className='subscriptionDetails__loginCopy'>
          Already have an account?
          <a
            href={
              isWindowDefined() ? window.location.href.toString().replace("/products/app", "/login?goBack=true") : ""
            }
          >
            Log In
          </a>
        </p>
      )}
    </>
  );
};

export default SubscriptionDetails;
