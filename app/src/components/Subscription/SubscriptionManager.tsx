import React from "react";
import { Card } from "../../core/domain/payment/Card";
import PaymentInfoMessage from "./PaymentInfoMessage";
import { PaymentInfoSection } from "./PaymentInfoSection";
import { PaymentInfoVM } from "./PaymentInfoVM";
import PromoCodeBox from "./PromoCodeBox";
import { PromoCodeVM } from "./PromoCodeVM";
import "./SubscriptionManager.scss";
import SubscriptionPlanBox from "./SubsriptionPlanBox/SubscriptionPlanBox";
import { UpdatePaymentInfoForm } from "./UpdatePaymentInfoForm";

export default function SubscriptionManager({
  checkPromoCode,
  clearPromoCode,
  creditCardInfo,
  invalidPromoCodeText,
  isUpdatePaymentFormVisible,
  onPlanSelect,
  onClearPaymentMethod,
  onCreditCardError,
  paymentInfo,
  promoCode,
  selectedPlanId,
  setCreditCardInfo,
  toggleUpdatePaymentForm,
  subscriptionPlans,
  updatePaymentInfo,
}: {
  checkPromoCode: (code: string) => void;
  clearPromoCode: () => void;
  creditCardInfo?: Card;
  invalidPromoCodeText: string;
  isUpdatePaymentFormVisible: boolean;
  onPlanSelect: (planId: string) => void;
  onClearPaymentMethod: () => void;
  onCreditCardError: (error: string) => void;
  paymentInfo?: PaymentInfoVM;
  promoCode?: PromoCodeVM;
  selectedPlanId: string;
  setCreditCardInfo: (card: Card) => void;
  toggleUpdatePaymentForm: () => void;
  subscriptionPlans: any[];
  updatePaymentInfo: () => void;
}) {
  return (
    <>
      {!!subscriptionPlans.length && !paymentInfo && (
        <div className='subscription-manager__container__'>
          <h1 className='subscription-manager__container__title'>Select Your Subscription Plan</h1>
          <div className='subscription-manager__container__title-border'>.</div>
          <p className='subscription-manager__container__description'>
            Choose a monthly plan or save when you sign up for a year, easily cancel at anytime.
          </p>
          <div className='subscription-manager__plans'>
            {subscriptionPlans.map((subscriptionPlan, index) => (
              <SubscriptionPlanBox
                plan={subscriptionPlan}
                onSelect={onPlanSelect}
                selected={selectedPlanId === subscriptionPlan.id}
                key={index}
              />
            ))}
          </div>
          <PromoCodeBox
            invalidPromoCodeText={invalidPromoCodeText}
            promoCode={promoCode}
            onSubmit={checkPromoCode}
            onClear={clearPromoCode}
          />
        </div>
      )}
      <div className='subscription-manager__container__'>
        <h1 className='subscription-manager__container__title'>Payment Info</h1>
        <div className='subscription-manager__container__title-border'>.</div>
        <div className='subscription-manager__container__description'>
          <PaymentInfoMessage paymentInfo={paymentInfo} />
        </div>
        {!paymentInfo?.klarna &&
          (paymentInfo?.number || !!subscriptionPlans.length) &&
          (isUpdatePaymentFormVisible || !!subscriptionPlans.length ? (
            <UpdatePaymentInfoForm
              insertMode={!!subscriptionPlans.length}
              isFormOk={!!creditCardInfo}
              onClearPaymentMethod={onClearPaymentMethod}
              onCreditCardError={onCreditCardError}
              setCreditCardInfo={setCreditCardInfo}
              toggleUpdatePaymentForm={toggleUpdatePaymentForm}
              updatePaymentInfo={updatePaymentInfo}
            />
          ) : (
            <PaymentInfoSection toggleUpdateForm={toggleUpdatePaymentForm} info={paymentInfo} />
          ))}
      </div>
    </>
  );
}
