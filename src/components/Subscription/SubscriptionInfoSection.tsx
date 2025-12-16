import clsx from "classnames";
import React from "react";
import ResubscriptionContainer from "./ResubscriptionContainer";
import "./SubscriptionInfoSection.scss";
import { SubscriptionInfoVM } from "./SubscriptionInfoVM";

export const SubscriptionInfoSection = ({
  info,
  cancelSubscriptionAction,
  resubscribeUrl,
}: {
  cancelSubscriptionAction: () => void;
  info?: SubscriptionInfoVM;
  resubscribeUrl: string;
}) => {
  if (!info) return <ResubscriptionContainer resubscribeUrl={resubscribeUrl} />;

  return (
    <div className='subscription-info-section__'>
      {info.status === "canceled" && <ResubscriptionContainer resubscribeUrl={resubscribeUrl} />}
      <div className='subscription-info-section__container__'>
        <div className='subscription-info-section__container__box flex-2'>
          <span className='subscription-info-section__container__title'>NAME</span>
          <span className='subscription-info-section__container__detail'>{info.name}</span>
          <span className='subscription-info-section__container__extra-info'>{info.pricing}</span>
        </div>
        <div className='subscription-info-section__container__box flex-1'>
          <span className='subscription-info-section__container__title'>START DATE</span>
          <span className='subscription-info-section__container__detail'>{info.purchaseDate}</span>
        </div>
        <div className='subscription-info-section__container__box flex-1'>
          <span className='subscription-info-section__container__title'>STATUS</span>
          <span
            className={clsx("subscription-info-section__container__detail", {
              "subscription-info-section__container__detail--canceled": info.status === "canceled",
            })}
          >
            {info.status}
          </span>
        </div>
        <div className='subscription-info-section__container__box flex-1'>
          <span className='subscription-info-section__container__title'>NEXT BILL DATE</span>
          <span className='subscription-info-section__container__detail'>
            {info.status !== "canceled" ? info.nextBillDate : "—"}
          </span>
        </div>
      </div>
      {!info.klarna && info.status !== "canceled" && info.paymentInfo?.number && (
        <span onClick={cancelSubscriptionAction} className='subscription-info-section__cancel-link'>
          Cancel Subscription
        </span>
      )}
      {info?.status === "not started" && (
        <div className='subscription-info-section__resubscribe-container__'>
          <p className='subscription-info-section__resubscribe-container__trial-text'>
            Your trial period begins when you take your first class in the app. Your credit card will only be charged
            for the subscription once your trial period is over.
          </p>
        </div>
      )}
    </div>
  );
};
