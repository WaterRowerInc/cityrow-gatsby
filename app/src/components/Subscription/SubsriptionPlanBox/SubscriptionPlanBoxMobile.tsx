import clsx from "classnames";
import React from "react";
import checkWhiteIcon from "../../../assets/images/whiteFilledCheckIcon.png";
import useCheckMobile from "../../../hooks/useCheckMobile";
import "./SubscriptionPlanBoxMobile.scss";

const SubscriptionPlanBoxMobile = ({
  plan,
  onSelect,
  selected,
}: {
  plan: {
    id: string;
    description: string;
    isPopular: boolean;
    name: string;
    price: string;
  };
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <div
      className={clsx("subscription-plan-box-mobile__", { "subscription-plan-box-mobile__--selected": selected })}
      onClick={() => onSelect(plan.id)}
    >
      <div className='subscription-plan-box-mobile__title__container'>
        <h4 className='subscription-plan-box-mobile__title__text'>{plan.name} Plan</h4>
        {plan.isPopular && (
          <div className='subscription-plan-box-mobile__title__most-popular__container'>
            <p className='subscription-plan-box-mobile__title__most-popular__text'>Most Popular</p>
          </div>
        )}
      </div>
      <div className='subscription-plan-box-mobile__body-container'>
        <div className='subscription-plan-box-mobile__price__container'>
          <h4 className='subscription-plan-box-mobile__price__number'>{plan.price}</h4>
          <div className='subscription-plan-box-mobile__price__separator' />
          <p className='subscription-plan-box-mobile__price__description'>billed {plan.name.toLowerCase()}</p>
        </div>
        <div className='subscription-plan-box-mobile__description__container'>
          <p className='subscription-plan-box-mobile__description__text'>{plan.description}</p>
        </div>
        <button
          className={clsx("subscription-plan-box-mobile__cta", {
            "subscription-plan-box-mobile__cta--focus": selected,
          })}
        >
          {selected ? (
            <p>
              <img src={checkWhiteIcon} alt='Icon' />
              PLAN SELECTED
            </p>
          ) : (
            "SELECT PLAN"
          )}
        </button>
      </div>
      {selected && (
        <div className='subscription-plan-box-mobile__footer__container'>
          <p className='subscription-plan-box-mobile__footer__text'>You will be charged at the end of your trial.</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanBoxMobile;
